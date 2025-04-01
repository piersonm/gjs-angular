import grapesjs from 'grapesjs';
import 'grapesjs-plugin-export';
import 'grapesjs-blocks-basic';


export const initializeGrapesJS = (containerId: string, additionalOptions = {}) => {
  return grapesjs.init({
    container: containerId,
    plugins: ['grapesjs-plugin-export', 'grapesjs-blocks-basic', 'grapesjs-preset-webpage'],
    pluginsOpts: {
      'grapesjs-plugin-export': {
        addExportBtn: true,
        btnLabel: 'Export',
      },
      'grapesjs-blocks-basic': {
        // Add any options for the basic blocks plugin here
      },
        'grapesjs-preset-webpage': {
            // Add any options for the webpage preset here
        },
    },
    // Default configurations
    fromElement: true,
    height: '100%',
    width: 'auto',
    storageManager: {
      type: 'local', // Example: Use local storage
      autosave: true,
      autoload: true,
    },
    panels: {
        defaults: [
            {
              id: 'basic-actions',
              buttons: [
                {
                  id: 'alert-button',
                  className: 'btn-alert',
                //   label: 'Alert',
                  command: () => alert('Button clicked!'),
                },
              ],
            },
          ], // Panels can be customized here
    },
    ...additionalOptions, // Allow overriding default options
  });
};