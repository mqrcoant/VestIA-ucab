(function () {
    var APP = window.VestiaApp;
    if (!APP) return;

    APP.profile = {
        getPreferences: function () {
            var prefs = localStorage.getItem("vestia_preferences");
            return prefs ? JSON.parse(prefs) : null;
        }
    };
})();
