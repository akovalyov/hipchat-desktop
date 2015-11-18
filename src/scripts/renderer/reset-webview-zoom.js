var Configstore = require('configstore');
var webframe = require('web-frame');
var ipc = require('ipc');

var conf = new Configstore('hipchat-desktop', {
    zoom: webframe.getZoomFactor()
});
webframe.setZoomFactor(conf.get('zoom'));

window.onload = function () {
    HC.AppDispatcher.register('server-data', function (data) {
        if ('message' in data) {
            console.log(JSON.stringify(data));
            ipc.send('message:received', 'Message received')
        }
    });
};