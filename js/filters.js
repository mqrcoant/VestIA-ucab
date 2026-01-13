(function () {
    var APP = window.VestiaApp;
    if (!APP) return;

    window.aplicarFiltroExterno = function (filters) {
        console.log("Aplicando filtros externos:", filters);
    };

    APP.filters = {};
})();
