(function () {
    var APP = window.VestiaApp;
    if (!APP) return;

    var dom = {};

    function cacheDom() {
        dom.prefsToggle = APP.utils.byId("prefs-toggle");
        dom.prefsSidebar = APP.utils.byId("prefs-sidebar");
        dom.prefsOverlay = APP.utils.byId("prefs-overlay");
        dom.prefsClose = APP.utils.byId("prefs-close");
        dom.navToggle = APP.utils.byId("nav-toggle");
        dom.navLinks = APP.utils.byId("nav-links");
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

    function isActivationEvent(event) {
        var isClick = event.type === "click";
        var isKey = event.type === "keydown" && (event.key === "Enter" || event.key === " " || event.key === "Spacebar");
        return isClick || isKey;
    }

    function handlePrefsToggle(event) {
        if (!isActivationEvent(event)) {
            return;
        }
        var isOpen = dom.prefsSidebar && dom.prefsSidebar.classList.contains("is-open");
        setPrefsOpen(!isOpen);
    }

    function handlePrefsClose(event) {
        if (!isActivationEvent(event)) {
            return;
        }
        setPrefsOpen(false);
    }

    function handleEscape(event) {
        if (event.key === "Escape") {
            setPrefsOpen(false);
            setNavOpen(false);
        }
    }

    function setNavOpen(isOpen) {
        if (!dom.navLinks) {
            return;
        }
        dom.navLinks.classList.toggle("is-open", isOpen);
        if (dom.navToggle) {
            dom.navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
    }

    function handleNavToggle(event) {
        if (!isActivationEvent(event)) {
            return;
        }
        var isOpen = dom.navLinks && dom.navLinks.classList.contains("is-open");
        setNavOpen(!isOpen);
    }

    function handleNavLink(event) {
        if (!isActivationEvent(event)) {
            return;
        }
        var link = event.target.closest(".js-nav-link");
        if (!link) {
            return;
        }
        var targetId = link.getAttribute("data-target");
        var section = APP.utils.byId(targetId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
        setNavOpen(false);
    }

    function initNavbar() {
        cacheDom();
        if (dom.navToggle) {
            dom.navToggle.addEventListener("click", handleNavToggle);
            dom.navToggle.addEventListener("keydown", handleNavToggle);
        }
        if (dom.navLinks) {
            dom.navLinks.addEventListener("click", handleNavLink);
            dom.navLinks.addEventListener("keydown", handleNavLink);
        }
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
        document.addEventListener("keydown", handleEscape);
    }

    function init() {
        initPrefsSidebar();
        initNavbar();
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
        if (APP.chatbot && APP.chatbot.init) {
            APP.chatbot.init();
        }
        if (APP.image && APP.image.init) {
            APP.image.init();
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();
