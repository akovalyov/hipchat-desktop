var webview = document.getElementById('webview');
var indicator = document.getElementsByClassName('loading-message')[0];
var webframe = require('web-frame');
var ipc = require('electron').ipcRenderer;
var initial = true;

var loadstop = function () {
    indicator.style.display = 'none';
};
webview.addEventListener('did-start-loading', function () {
    if (true === initial) {
        indicator.style.display = 'flex';
    }
});
webview.addEventListener('did-stop-loading', loadstop);

ipc.on('zoom:encrease', function () {
    webframe.setZoomLevel((webframe.getZoomLevel() + 1) / 2);
});
ipc.on('zoom:decrease', function () {
    webframe.setZoomLevel((webframe.getZoomLevel() - 1) / 2);
});
ipc.on('zoom:reset', function () {
    webframe.setZoomLevel(0);
});

webview.addEventListener('console-message', function (e) {
    console.log('Guest page logged a message:', e.message);
});

webview.addEventListener('new-window', function (e) {
    var external = new RegExp('^((f|ht)tps?:)?//(?!' + 'hipchat.com'+ ')');
    //open external links in browser but keep the same app for video/audio calls
    if(!external.test(e.url)) {
        require('shell').openExternal(e.url);
    }
});
