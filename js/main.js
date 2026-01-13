(function () {
    var APP = window.VestiaApp;
    if (!APP) return;

    var dom = {};

    function cacheDom() {
        dom.prefsToggle = APP.utils.byId("prefs-toggle");
        dom.prefsSidebar = APP.utils.byId("prefs-sidebar");
        dom.prefsOverlay = APP.utils.byId("prefs-overlay");
        dom.prefsClose = APP.utils.byId("prefs-close");
    }

    function setPrefsOpen(isOpen) {
        if (!dom.prefsSidebar || !dom.prefsOverlay) {
            return;
        }
        dom.prefsSidebar.classList.toggle("is-open", isOpen);
        dom.prefsOverlay.classList.toggle("is-open", isOpen);
        dom.prefsSidebar.classList.toggle("d-none", !isOpen);
        dom.prefsOverlay.classList.toggle("d-none", !isOpen);
        if (dom.prefsToggle) {
            dom.prefsToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
    }

    function handlePrefsToggle(event) {
        var isClick = event.type === "click";
        var isKey = event.type === "keydown" && (event.key === "Enter" || event.key === " " || event.key === "Spacebar");
        if (!isClick && !isKey) {
            return;
        }
        var isOpen = dom.prefsSidebar && dom.prefsSidebar.classList.contains("is-open");
        setPrefsOpen(!isOpen);
    }

    function handlePrefsClose(event) {
        var isClick = event.type === "click";
        var isKey = event.type === "keydown" && (event.key === "Enter" || event.key === " " || event.key === "Spacebar");
        if (!isClick && !isKey) {
            return;
        }
        setPrefsOpen(false);
    }

    function initPrefsSidebar() {
        cacheDom();
        if (dom.prefsToggle) {
            dom.prefsToggle.addEventListener("click", handlePrefsToggle);
            dom.prefsToggle.addEventListener("keydown", handlePrefsToggle);
        }
        if (dom.prefsClose) {
            dom.prefsClose.addEventListener("click", handlePrefsClose);
            dom.prefsClose.addEventListener("keydown", handlePrefsClose);
        }
        if (dom.prefsOverlay) {
            dom.prefsOverlay.addEventListener("click", handlePrefsClose);
        }
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                setPrefsOpen(false);
            }
        });
    }

    function init() {
        initPrefsSidebar();
        if (APP.filters && APP.filters.init) {
            APP.filters.init();
        }
        if (APP.profile && APP.profile.init) {
            APP.profile.init();
        }
        if (APP.cart && APP.cart.init) {
            APP.cart.init();
        }
        if (APP.products && APP.products.init) {
            APP.products.init();
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();
