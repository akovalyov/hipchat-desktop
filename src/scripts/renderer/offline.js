var onlineStatus = function () {
    var message = navigator.onLine ? 'Connection restored. We will reload the page' : 'Seems that you are offline. Please, check your internet connection';
    var notify = new Notification(message);
    if (navigator.onLine) {
        window.location.reload();
    }
};

window.addEventListener('online', onlineStatus);
window.addEventListener('offline', onlineStatus);
if (!navigator.onLine) {
    onlineStatus();
}
