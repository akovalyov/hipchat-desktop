var Configstore = require('configstore');
var webframe = require('web-frame');
var ipc = require('electron').ipcRenderer;

var conf = new Configstore('hipchat-desktop', {
    zoom: webframe.getZoomFactor()
});
webframe.setZoomFactor(conf.get('zoom'));

window.onload = function () {
    if (typeof HC !== 'undefined') {
        HC.AppDispatcher.register('server-data', function (data) {
            if ('message' in data) {
                console.log(JSON.stringify(data));
                ipc.send('message:received', 'Message received')
            }
        });
    }
};