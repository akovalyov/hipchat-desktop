import {app, BrowserWindow} from 'electron';
import path from 'path';
import shell from 'shell';

import EventEmitter from 'events';

import AppMenu from './app-menu';
import AppWindow from './app-window';
import AppTray from './app-tray';

import Updater from './updater';

class Application extends EventEmitter {

  /**
   * Load components and create the main window.
   *
   * @param {Object} manifest
   * @param {Object} options
   */
  constructor(manifest, options) {
    super();

    this.manifest = manifest;
    this.options = options;
    this.forceQuit = false;

    // Create and set the default menu
    this.menu = this.createMenu();
    this.menu.makeDefault();

    // Create and show the main window
    this.mainWindow = new AppWindow();
    this.mainWindow.loadUrl(`file://${path.resolve(__dirname, '..', '..', 'html', 'index.html')}`);
    this.tray = this.createTray();

    // Quit the app when all the windows are closed, except for darwin
    app.on('window-all-closed', function() {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
    app.on('before-quit', function (e) {
      // Handle menu-item or keyboard shortcut quit here
      if(!global.application.forceQuit){
        e.preventDefault();
        global.application.mainWindow.hide();
      }
    });
    this.app = app;
  }

  /**
   * Create an app menu and set listeners.
   *
   * @return {AppMenu}
   */
  createMenu() {
    const menu = new AppMenu();

    return this.assignEvents(menu);
  }
  createTray() {
    const tray = new AppTray(this.manifest);

    return this.assignEvents(tray);
  }

  toggleVisibility() {
    if (this.mainWindow) {
      var isVisible = this.mainWindow.window.isVisible();

      if (isVisible) {
        this.mainWindow.hide();
      } else {
        this.mainWindow.show();
      }
    } else {
      logger.debug('Browser window visibility toggling requested but browser window as not found');
    }
  }
  onTrayClicked() {
    this.toggleVisibility();
  }

  markTrayNeedsAtention() {
    if (this.mainWindow.window.isFocused()) {
      return;
    }
    var image = 'tray-attention.png';
    this.tray.tray.setImage(path.resolve(__dirname, '..', '..', 'images', image));
  }
  markTrayClear() {
    var image = 'tray.png';
    this.tray.tray.setImage(path.resolve(__dirname, '..', '..', 'images', image));
  }

  quit(){
    this.forceQuit = true;
    console.log('force quitting');
    this.app.quit();
  }
  assignEvents(menu) {
    // Handle application events
    menu.on('application:quit', function(){
        global.application.quit();
    });
    menu.on('application:focus', function() {
      global.application.mainWindow.show();
    });
    menu.on('application:show-settings', function() {});

    menu.on('application:open-url', function(menuItem) {
      shell.openExternal(menuItem.url);
    });

    menu.on('application:check-for-update', () => {
      Updater.checkAndPrompt(this.manifest, true)
        .then(function(willUpdate) {
          if (willUpdate) {
            app.quit();
          }
        })
        .catch(::console.error);
    });
    menu.on('application:encrease-zoom', function() {
      global.application.mainWindow.window.webContents.send('zoom:encrease');
    });
    menu.on('application:decrease-zoom', function() {
      global.application.mainWindow.window.webContents.send('zoom:decrease');
    });
    menu.on('application:reset-zoom', function() {
      global.application.mainWindow.window.webContents.send('zoom:reset');
    });
    // Handle window events
    menu.on('window:reload', function() {
      BrowserWindow.getFocusedWindow().reload();
    });

    menu.on('window:toggle-full-screen', function() {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
    });

    menu.on('window:toggle-dev-tools', function() {
      BrowserWindow.getFocusedWindow().toggleDevTools();
    });

    return menu;
  }
}

export default Application;
