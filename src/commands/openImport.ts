import type { Editor } from 'grapesjs';
import { RequiredPluginOptions } from '..';
import { cmdImport } from './../consts';

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
        container.appendChild(btnImp);

        // Import HTML and CSS files button
        const btnImportFiles = document.createElement('button');
        btnImportFiles.type = 'button';
        btnImportFiles.innerHTML = 'Import HTML & CSS Files';
        btnImportFiles.className = `${pfx}btn-prim ${pfx}btn-import-files`;
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
  });
};
