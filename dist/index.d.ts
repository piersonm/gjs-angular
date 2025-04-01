import { Editor, Plugin } from 'grapesjs';

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
declare const plugin: Plugin<PluginOptions>;

export {
	plugin as default,
};

export {};
