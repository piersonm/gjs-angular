import { initializeGrapesJS } from './config/grapesjsConfig';

declare global {
  interface Window {
    editor: any;
  }
}

window.onload = () => {
  window.editor = initializeGrapesJS('#gjs');
};