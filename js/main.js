(function () {
    var APP = window.VestiaApp;
    if (!APP) return;

    function init() {
        if (APP.products && APP.products.init) {
            APP.products.init();
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();
