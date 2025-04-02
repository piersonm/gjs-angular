import type { Editor } from 'grapesjs';
import { RequiredPluginOptions } from '..';
import { cmdImport } from './../consts';
import { json } from 'body-parser';

export default (editor: Editor, config: RequiredPluginOptions) => {
  const pfx = editor.getConfig('stylePrefix');
  const importLabel = config.modalImportLabel;
  const importCnt = config.modalImportContent;

  editor.Commands.add(cmdImport, {
    codeViewer: null as any,
    container: null as HTMLElement | null,

    run(editor) {
      const codeContent = typeof importCnt == 'function' ? importCnt(editor) : importCnt;
      const codeViewer = this.getCodeViewer();
      editor.Modal.open({
        title: config.modalImportTitle,
        content: this.getContainer(),
      }).onceClose(() => editor.stopCommand(cmdImport));
      codeViewer.setContent(codeContent ?? '');
      codeViewer.refresh();
      setTimeout(() => codeViewer.focus(), 0);
    },

    stop() {
      editor.Modal.close();
    },

    getContainer() {
      if (!this.container) {
        const codeViewer = this.getCodeViewer();
        const container = document.createElement('div');
        container.className = `${pfx}import-container`;

        // Import Label
        if (importLabel) {
          const labelEl = document.createElement('div');
          labelEl.className = `${pfx}import-label`;
          labelEl.innerHTML = importLabel;
          container.appendChild(labelEl);
        }

        container.appendChild(codeViewer.getElement());

        // Import button
        const btnImp = document.createElement('button');
        btnImp.type = 'button';
        btnImp.innerHTML = config.modalImportButton;
        btnImp.className = `${pfx}btn-prim ${pfx}btn-import`;
        btnImp.onclick = () => {
          editor.Css.clear();
          editor.setComponents(codeViewer.getContent().trim());
          editor.Modal.close();
        };
        btnImp.style.marginBottom = '10px';
        btnImp.style.marginRight = '10px';
        container.appendChild(btnImp);

        // Import HTML and CSS files button
        const btnImportFiles = document.createElement('button');
        btnImportFiles.type = 'button';
        btnImportFiles.innerHTML = 'Import HTML & CSS Files';
        btnImportFiles.className = `${pfx}btn-prim ${pfx}btn-import-files`;
        btnImportFiles.style.marginBottom = '10px';
        btnImportFiles.style.marginRight = '10px'; // Add spacing
        btnImportFiles.onclick = async () => {
          const [htmlFile, cssFile] = await this.importFiles();
          if (htmlFile) {
            const htmlContent = await htmlFile.text();
            editor.setComponents(htmlContent.trim());
          }
          if (cssFile) {
            const cssContent = await cssFile.text();
            editor.Css.addRules(cssContent.trim());
          }
          editor.Modal.close();
        };
        container.appendChild(btnImportFiles);

        // Import folder button
        const btnImportFolder = document.createElement('button');
        btnImportFolder.type = 'button';
        btnImportFolder.innerHTML = 'Import Folder';
        btnImportFolder.className = `${pfx}btn-prim ${pfx}btn-import-folder`;
        btnImportFolder.style.marginBottom = '10px';
        btnImportFolder.style.marginRight = '10px'; // Add spacing
        btnImportFolder.onclick = async () => {
          const files = await this.importFolder();
          const htmlFile = files.find((file) => file.name.endsWith('.html'));
          const cssFile = files.find((file) => file.name.endsWith('.css'));

          if (htmlFile) {
            const htmlContent = await htmlFile.text();
            editor.setComponents(htmlContent.trim());
          }
          if (cssFile) {
            const cssContent = await cssFile.text();
            editor.Css.addRules(cssContent.trim());
          }
          editor.Modal.close();
        };
        container.appendChild(btnImportFolder);

        // Import JSON file button
        const btnImportJson = document.createElement('button');
        btnImportJson.type = 'button';
        btnImportJson.innerHTML = 'Import JSON File';
        btnImportJson.className = `${pfx}btn-prim ${pfx}btn-import-json`;
        btnImportJson.style.marginBottom = '10px'; // Add spacing
        btnImportJson.style.marginRight = '10px'; // Add spacing
        btnImportJson.onclick = async () => {
          const jsonFile = await this.importJsonFile();
          if (jsonFile) {
            const jsonContent = await jsonFile.text();
            try {
              const parsedContent = JSON.parse(jsonContent);
              console.log('Parsed JSON content:', parsedContent);

              // Call the function to update the editor content
              updateEditorContentById(editor, sampleData.map(data => ({ id: data.componentId, content: data.content })));
            } catch (error) {
              console.error('Invalid JSON file:', error);
            }
          }
          editor.Modal.close();
          console.log('Updated HTML:', editor.getHtml());
        };
        container.appendChild(btnImportJson);

        this.container = container;
      }

      return this.container;
    },

    /**
     * Return the code viewer instance
     * @returns {CodeViewer}
     */
    getCodeViewer() {
      if (!this.codeViewer) {
        this.codeViewer = editor.CodeManager.createViewer({
          codeName: 'htmlmixed',
          theme: 'hopscotch',
          readOnly: false,
          ...config.importViewerOptions,
        });
      }

      return this.codeViewer;
    },

    /**
     * Handle importing HTML and CSS files
     * @returns {Promise<File[]>}
     */
    async importFiles(): Promise<File[]> {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.css';
        input.multiple = true;
        input.onchange = () => {
          const files = Array.from(input.files || []);
          const htmlFile = files.find((file) => file.name.endsWith('.html'));
          const cssFile = files.find((file) => file.name.endsWith('.css'));
          resolve([htmlFile, cssFile].filter((file): file is File => file !== null));
        };
        input.click();
      });
    },

    /**
     * Handle importing a folder containing HTML and CSS files
     * @returns {Promise<File[]>}
     */
    async importFolder(): Promise<File[]> {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true; // Allow folder selection
        input.onchange = () => {
          const files = Array.from(input.files || []);
          resolve(files);
        };
        input.click();
      });
    },

    /**
     * Handle importing a JSON file
     * @returns {Promise<File | null>}
     */
    async importJsonFile(): Promise<File | null> {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = () => {
          const files = Array.from(input.files || []);
          resolve(files[0] || null);
        };
        input.click();
      });
    },
  });

  const sampleData = [
    {
      componentId: 'Title',
      attributeID: 'textLocation',
      content: 'Welcome to a Test',
    },
    {
      componentId: 'descrip',
      attributeID: 'textLocation',
      content: 'Testing content',
    },
  ];
  
  /**
   * Updates the text of a tag in the editor that matches the given id and ensures changes are reflected in editor.getHtml().
   * @param editor - The GrapesJS editor instance.
   * @param sampleData - Array of objects containing id and content to update.
   */
  function updateEditorContentById(editor: Editor, sampleData: { id: string; content: string }[]) {
    sampleData.forEach((data) => {
      // Find the component in the editor by id
      const wrapper = editor.getWrapper();
      const components = wrapper ? wrapper.find(`[id="${data.id}"]`) : [];

      if (components.length > 0) {
        components.forEach((component) => {
          // Update the content of the matching component
          if (component.is('textnode')) {
            component.set('content', data.content); // Update text content for text nodes
          } else {
            const el = component.getEl();
            if (el) {
              editor.select(component); // Select the component
              const targetedComponent = editor.getSelected(); // Get the selected component
              if (targetedComponent) {
                const targetedEl = targetedComponent.getEl(); // Get the DOM element of the selected component
                if (targetedEl) {
                  targetedEl.innerText = data.content; // Update the innerText of the DOM element
                  console.log(`Updated innerText for component with id ${data.id}:`, targetedEl.innerText);

                  // Map the innerText to the editor's internal state
                  const updatedInnerHTML = targetedEl.innerHTML; // Get the updated innerHTML
                  console.log(`Updated targetedComponent content:`, updatedInnerHTML);

                  // Set targetedComponent.toHTML() to targetedComponent.__innerHTML
                  targetedComponent.__innerHTML = () => updatedInnerHTML; // Update the internal __innerHTML
                  console.log(`Updated targetedComponent.__innerHTML:`, targetedComponent.__innerHTML);
                }
              }
            }
          }

          // Trigger a change event to ensure the editor reflects the updates
          console.log(`Updated content for component with id ${data.id}:`, data.content);
        });
      } else {
        console.log(`No component found with id: ${data.id}`);
      }
    });
  }
};
