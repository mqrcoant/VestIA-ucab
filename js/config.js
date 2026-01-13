window.VestiaApp = window.VestiaApp || {};

window.VestiaApp.config = {
	dummyBaseUrl: "https://dummyjson.com",
	productsPerPage: 9,
	searchDebounceMs: 500
};

window.VestiaApp.utils = {
	byId: function (id) {
		return document.getElementById(id);
	},
	formatPrice: function (p) {
		return "$" + (typeof p === "number" ? p.toFixed(2) : p);
	},
	toNumber: function (v, def) {
		var n = parseInt(v, 10);
		return isNaN(n) ? def : n;
	},
	debounce: function (func, wait) {
		var timeout;
		return function () {
			var context = this;
			var args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				func.apply(context, args);
			}, wait);
		};
	}
};

window.VestiaApp.constants = {
	colors: ["Negro", "Blanco", "Azul", "Beige", "Rojo", "Verde", "Rosa", "Gris"],
	sizes: ["XS", "S", "M", "L", "XL", "XXL"],
	occasions: ["Casual", "Formal", "Fiesta", "Deporte"],
	styles: ["Minimalista", "Boho", "Urbano", "Clásico", "Moderno"]
};