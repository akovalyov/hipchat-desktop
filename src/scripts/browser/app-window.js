import shell from 'shell';

import BrowserWindow from 'browser-window';
import EventEmitter from 'events';
import path from 'path';

class AppWindow extends EventEmitter {

  /**
   * Create a browser window based off of some default settings.
   *
   * @param {Object} options
   */
  constructor(options) {
    super();

    const defaults = {
      width: 1024,
      height: 768,
      icon: path.resolve(__dirname, '..', '..', 'images', 'tray.png'), //leaving it as tray icon @todo icon resolver
      'web-preferences': {
        'webaudio': true,
        'web-security': false,
        'use-content-size': true,
        'subpixel-font-scaling': true,
        'direct-write': true,
        'plugins': true
      }
    };

    this.settings = Object.assign(defaults, options);
    this.window = this.createBrowserWindow(this.settings);
  }

  /**
   * Create a BrowserWindow with the given settings.
   *
   * @param {Object} settings
   * @return {BrowserWindow}
   */
  createBrowserWindow(settings) {
    const browserWindow = new BrowserWindow(settings);

    // Open urls in an external browser
    browserWindow.webContents.on('new-window', function(event, url) {
      event.preventDefault();
      shell.openExternal(url);
    });

    browserWindow.on('minimize', function(event){
      event.preventDefault();
      this.hide();
    });

    return browserWindow;
  }

  /**
   * Load the target url inside the window.
   *
   * @param {String} targetUrl
   */
  loadUrl(targetUrl) {
    this.window.loadUrl(targetUrl);
  }

  /**
   * Make the window visible and focus it.
   */
  show() {
    this.window.show();
  }

  /**
   * Minimize to tray on close.
   */
  close() {
    this.window.close();
  }

  focus() {
    this.window.focus();
  }

  hide() {
    this.window.hide();
  }
}

export default AppWindow;
