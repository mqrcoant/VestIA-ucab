(function () {
	var APP = window.VestiaApp = window.VestiaApp || {};

	APP.config = {
		dummyBaseUrl: "https://dummyjson.com",
		productsPerPage: 9,
		searchDebounceMs: 250,
		clothingCategories: ["mens-shirts", "mens-shoes", "tops", "womens-dresses", "womens-shoes"],
		geminiApiKey: "AIzaSyBzQaGzfBEXKywuLD3mG1YgF14TyEHILZQ", // No exponer en producción
		geminiModel: "gemini-2.5-flash",
		geminiBaseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
		storageKeys: {
			cart: "vestia_cart",
			prefs: "vestia_prefs",
			chat: "vestia_chat"
		}
	};

	APP.constants = {
		colors: ["Negro", "Blanco", "Rojo", "Azul", "Verde", "Beige", "Marron"],
		sizes: ["XS", "S", "M", "L", "XL"],
		occasions: ["Formal", "Casual", "Deportivo", "Fiesta", "Trabajo"],
		styles: ["Clasico", "Minimal", "Urbano", "Bohemio", "Deportivo"],
		priceMaxDefault: 500
	};

	APP.assistant = {
		name: "Lia"
	};

	function byId(id) {
		return document.getElementById(id);
	}

	function qs(selector, root) {
		return (root || document).querySelector(selector);
	}

	function qsa(selector, root) {
		return (root || document).querySelectorAll(selector);
	}

	function toNumber(value, fallback) {
		var parsed = Number(value);
		return Number.isNaN(parsed) ? fallback : parsed;
	}

	function formatPrice(value) {
		return "$" + value.toFixed(2);
	}

	function debounce(fn, delay) {
		var timer;
		return function () {
			var context = this;
			var args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context, args);
			}, delay);
		};
	}

	function notify(title, text, icon) {
		if (window.Swal) {
			window.Swal.fire({
				title: title,
				text: text,
				icon: icon || "info",
				confirmButtonColor: "#1f1b16"
			});
			return;
		}
		alert(title + " - " + text);
	}

	APP.utils = {
		byId: byId,
		qs: qs,
		qsa: qsa,
		toNumber: toNumber,
		formatPrice: formatPrice,
		debounce: debounce,
		notify: notify
	};
})();