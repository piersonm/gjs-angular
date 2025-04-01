import type { Editor, Plugin } from 'grapesjs';
import blocks from './blocks';
import commands from './commands';
import panels from './panels';
import { initializeGrapesJS } from './config/grapesjsConfig';
import exportPlugin from './exportIndex';

export type PluginOptions = {
  /**
   * Which blocks to add.
   * @default ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map']
   */
  blocks?: string[];

  /**
   * Make use of flexbox for the grid
   * @default false
   */
  flexGrid?: boolean;

  /**
   * Classes prefix
   * @default 'gjs-'
   */
  stylePrefix?: string;

  /**
   * Use basic CSS for blocks
   * @default true
   */
  addBasicStyle?: boolean;

  /**
   * Blocks category name
   * @default 'Basic'
   */
  category?: string;

  /**
   * 1 Column label
   * @default '1 Column'
   */
  labelColumn1?: string;

  /**
   * 2 Columns label
   * @default '2 Columns'
   */
  labelColumn2?: string;

  /**
   * 3 Columns label
   * @default '3 Columns'
   */
  labelColumn3?: string;

  /**
   * 3/7 Columns label
   * @default '2 Columns 3/7'
   */
  labelColumn37?: string;

  /**
   * Text label
   * @default 'Text'
   */
  labelText?: string;

  /**
   * Link label
   * @default 'Link'
   */
  labelLink?: string;

  /**
   * Image label
   * @default 'Image'
   */
  labelImage?: string;

  /**
   * Video label
   * @default 'Video'
   */
  labelVideo?: string;

  /**
   * Map label
   * @default 'Map'
   */
  labelMap?: string;

  /**
   * Initial row height
   * @default 75
   */
  rowHeight?: number;

  /**
   * Add custom block options, based on block id.
   * @default (blockId) => ({})
   * @example (blockId) => blockId === 'quote' ? { attributes: {...} } : {};
   */
  block?: (blockId: string) => ({});

  /**
   * Modal import title.
   * @default 'Import'
   */
  modalImportTitle?: string;

  /**
   * Modal import button text.
   * @default 'Import'
   */
  modalImportButton?: string;

  /**
   * Import description inside import modal.
   * @default ''
   */
  modalImportLabel?: string;

  /**
   * Default content to setup on import model open.
   * Could also be a function with a dynamic content return (must be a string).
   * @default ''
   * @example editor => editor.getHtml()
   */
  modalImportContent?: string | ((editor: Editor) => string);

  /**
   * Code viewer (eg. CodeMirror) options.
   * @default {}
   */
  importViewerOptions?: Record<string, any>;

  /**
   * Confirm text before clearing the canvas.
   * @default 'Are you sure you want to clear the canvas?'
   */
  textCleanCanvas?: string;

  /**
   * Show the Style Manager on component change.
   * @default true
   */
  showStylesOnChange?: boolean;

  /**
   * Load custom preset theme.
   * @default true
   */
  useCustomTheme?: boolean;
};

export type RequiredPluginOptions = Required<PluginOptions>;

const plugin: Plugin<PluginOptions> = (editor, opts: Partial<PluginOptions> = {}) => {
  const config: RequiredPluginOptions = {
    blocks: [
      'column1',
      'column2',
      'column3',
      'column3-7',
      'text',
      'link',
      'image',
      'video',
      'map'
    ],
    flexGrid: false,
    stylePrefix: 'gjs-',
    addBasicStyle: true,
    category: 'Basic',
    labelColumn1: '1 Column',
    labelColumn2: '2 Columns',
    labelColumn3: '3 Columns',
    labelColumn37: '2 Columns 3/7',
    labelText: 'Text',
    labelLink: 'Link',
    labelImage: 'Image',
    labelVideo: 'Video',
    labelMap: 'Map',
    rowHeight: 75,
    block: (blockId: string) => ({}), // Provide a default implementation for 'block'
    modalImportTitle: 'Import',
    modalImportButton: 'Import',
    modalImportLabel: '',
    modalImportContent: '',
    importViewerOptions: {},
    textCleanCanvas: 'Are you sure you want to clear the canvas?',
    showStylesOnChange: true,
    useCustomTheme: true,
    ...opts
  };

  if (config.useCustomTheme && typeof window !== 'undefined') {
    const primaryColor = '#463a3c';
    const secondaryColor = '#b9a5a6';
    const tertiaryColor = '#804f7b';
    const quaternaryColor = '#d97aa6';
    const prefix = 'gjs-';
    let cssString = '';

    [
      ['one', primaryColor],
      ['two', secondaryColor],
      ['three', tertiaryColor],
      ['four', quaternaryColor],
    ].forEach(([cnum, ccol]) => {
      cssString += `
        .${prefix}${cnum}-bg {
          background-color: ${ccol};
        }

        .${prefix}${cnum}-color {
          color: ${ccol};
        }

        .${prefix}${cnum}-color-h:hover {
          color: ${ccol};
        }
      `;
    });

    const style = document.createElement('style');
    style.innerText = cssString;
    document.head.appendChild(style);
  }

  // Load blocks
  blocks(editor, config);

  // Load commands
  commands(editor, config);

  // Load panels
  panels(editor, config);
}

export default plugin;
