(function () {
	var APP = window.VestiaApp;
	if (!APP) {
		return;
	}

	class Cart {
		constructor() {
			this.items = [];
			this.catalogAvailable = true;
		}

		load() {
			var stored = localStorage.getItem(APP.config.storageKeys.cart);
			if (!stored) {
				this.items = [];
				return;
			}
			try {
				this.items = JSON.parse(stored) || [];
			} catch (error) {
				this.items = [];
			}
		}

		save() {
			localStorage.setItem(APP.config.storageKeys.cart, JSON.stringify(this.items));
		}

		addItem(product) {
			var existing = this.items.find(function (item) {
				return item.id === product.id;
			});
			if (existing) {
				existing.quantity += 1;
			} else {
				this.items.push({
					id: product.id,
					title: product.title,
					price: product.price,
					thumbnail: product.thumbnail,
					quantity: 1
				});
			}
			this.save();
			this.render();
			APP.utils.notify("Carrito", "Producto agregado correctamente.", "success");
		}

		updateQuantity(id, quantity) {
			var item = this.items.find(function (entry) {
				return entry.id === id;
			});
			if (!item) {
				return;
			}
			item.quantity = Math.max(1, quantity);
			this.save();
			this.render();
		}

		removeItem(id) {
			this.items = this.items.filter(function (entry) {
				return entry.id !== id;
			});
			this.save();
			this.render();
		}

		clear() {
			this.items = [];
			this.save();
			this.render();
		}

		getTotal() {
			return this.items.reduce(function (total, entry) {
				return total + entry.price * entry.quantity;
			}, 0);
		}

		setCatalogAvailable(isAvailable) {
			this.catalogAvailable = isAvailable;
			this.render();
		}

		render() {
			ensureCheckoutButton();
			if (!this.catalogAvailable) {
				renderEmpty("Catalogo no disponible. El carrito esta vacio.");
				setStatus("Revisa la conexion para ver tu carrito.");
				return;
			}

			if (!this.items.length) {
				renderEmpty("Tu carrito esta vacio.");
				setStatus("Agrega productos desde el catalogo.");
				return;
			}

			if (dom.empty) {
				dom.empty.textContent = "";
			}
			setStatus("");
			renderItems(this.items);
			renderTotal(this.getTotal());
			updateCheckoutState();
		}
	}

	var dom = {};
	var cart = new Cart();

	function cacheDom() {
		dom.items = APP.utils.byId("cart-items");
		dom.empty = APP.utils.byId("cart-empty");
		dom.total = APP.utils.byId("cart-total");
		dom.status = APP.utils.byId("cart-status");
		dom.checkout = APP.utils.byId("cart-checkout");
		dom.summary = dom.total ? dom.total.parentElement : null;
	}

	function setStatus(message) {
		if (dom.status) {
			dom.status.textContent = message || "";
		}
	}

	function renderEmpty(message) {
		if (dom.items) {
			dom.items.innerHTML = "";
		}
		if (dom.empty) {
			dom.empty.textContent = message;
		}
		if (dom.total) {
			dom.total.textContent = "Total: " + APP.utils.formatPrice(0);
		}
		updateCheckoutState();
	}

	function ensureCheckoutButton() {
		if (!dom.summary && dom.total) {
			dom.summary = dom.total.parentElement;
		}
		if (dom.checkout || !dom.summary) {
			return;
		}
		var button = document.createElement("button");
		button.type = "button";
		button.id = "cart-checkout";
		button.className = "btn btn-dark w-100 mt-3";
		button.textContent = "Comprar";
		dom.summary.appendChild(button);
		dom.checkout = button;
	}

	function createActionSpan(label, action, id) {
		var span = document.createElement("span");
		span.className = "btn btn-outline-secondary btn-sm";
		span.textContent = label;
		span.setAttribute("role", "button");
		span.setAttribute("tabindex", "0");
		span.setAttribute("data-action", action);
		span.setAttribute("data-id", id);
		return span;
	}

	function renderItems(items) {
		if (!dom.items) {
			return;
		}
		dom.items.innerHTML = "";
		items.forEach(function (entry) {
			var item = document.createElement("li");
			item.className = "list-group-item";

			var wrapper = document.createElement("section");
			wrapper.className = "d-flex flex-column flex-md-row gap-3 align-items-start";

			var image = document.createElement("img");
			image.src = entry.thumbnail;
			image.alt = entry.title;
			image.className = "img-fluid";
			image.loading = "lazy";
			wrapper.appendChild(image);

			var details = document.createElement("section");
			var title = document.createElement("p");
			title.className = "fw-bold mb-1";
			title.textContent = entry.title;
			details.appendChild(title);

			var price = document.createElement("p");
			price.className = "text-muted mb-2";
			price.textContent = "Unitario: " + APP.utils.formatPrice(entry.price);
			details.appendChild(price);

			var controls = document.createElement("section");
			controls.className = "d-flex flex-column flex-sm-row gap-2 align-items-start";

			var quantityRow = document.createElement("section");
			quantityRow.className = "d-flex align-items-center gap-2";

			var minus = createActionSpan("-", "decrease", entry.id);
			var plus = createActionSpan("+", "increase", entry.id);

			var quantity = document.createElement("input");
			quantity.type = "number";
			quantity.min = "1";
			quantity.value = entry.quantity;
			quantity.className = "form-control";
			quantity.setAttribute("data-action", "input");
			quantity.setAttribute("data-id", entry.id);

			quantityRow.appendChild(minus);
			quantityRow.appendChild(quantity);
			quantityRow.appendChild(plus);
			controls.appendChild(quantityRow);

			var remove = createActionSpan("Eliminar", "remove", entry.id);
			remove.className = "btn btn-outline-danger btn-sm";
			controls.appendChild(remove);

			details.appendChild(controls);
			wrapper.appendChild(details);

			item.appendChild(wrapper);
			dom.items.appendChild(item);
		});
	}

	function renderTotal(total) {
		if (dom.total) {
			dom.total.textContent = "Total: " + APP.utils.formatPrice(total);
		}
	}

	function updateCheckoutState() {
		if (!dom.checkout) {
			return;
		}
		var disabled = !cart.items.length || !cart.catalogAvailable;
		dom.checkout.disabled = disabled;
		dom.checkout.setAttribute("aria-disabled", disabled ? "true" : "false");
	}

	function performAction(action, id) {
		var entry = cart.items.find(function (item) {
			return item.id === id;
		});
		if (action === "increase" && entry) {
			cart.updateQuantity(id, entry.quantity + 1);
		} else if (action === "decrease" && entry) {
			cart.updateQuantity(id, entry.quantity - 1);
		} else if (action === "remove") {
			cart.removeItem(id);
		}
	}

	function handleCartClick(event) {
		var target = event.target;
		var action = target.getAttribute("data-action");
		if (!action || action === "input") {
			return;
		}
		var id = APP.utils.toNumber(target.getAttribute("data-id"), 0);
		if (!id) {
			return;
		}
		performAction(action, id);
	}

	function handleCartKeydown(event) {
		var target = event.target;
		var action = target.getAttribute("data-action");
		if (!action) {
			return;
		}
		if (action === "input" && event.key !== "Enter") {
			return;
		}
		if (action !== "input" && event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") {
			return;
		}
		event.preventDefault();
		var id = APP.utils.toNumber(target.getAttribute("data-id"), 0);
		if (!id) {
			return;
		}
		if (action === "input") {
			var quantity = APP.utils.toNumber(target.value, 1);
			cart.updateQuantity(id, quantity);
			return;
		}
		performAction(action, id);
	}

	function handleQuantityChange(event) {
		var target = event.target;
		if (target.getAttribute("data-action") !== "input") {
			return;
		}
		var id = APP.utils.toNumber(target.getAttribute("data-id"), 0);
		if (!id) {
			return;
		}
		var quantity = APP.utils.toNumber(target.value, 1);
		cart.updateQuantity(id, quantity);
	}

	function requestCheckoutConfirmation(total) {
		var message = "Vas a comprar por " + APP.utils.formatPrice(total) + ". Deseas continuar?";
		if (window.Swal && window.Swal.fire) {
			return window.Swal.fire({
				title: "Confirmar compra",
				text: message,
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "Comprar",
				cancelButtonText: "Cancelar",
				confirmButtonColor: "#1f1b16"
			}).then(function (result) {
				return result.isConfirmed;
			});
		}
		return Promise.resolve(window.confirm(message));
	}

	function handleCheckout(event) {
		event.preventDefault();
		if (!cart.items.length) {
			setStatus("Tu carrito esta vacio.");
			APP.utils.notify("Carrito", "Agrega productos antes de comprar.", "info");
			return;
		}
		if (!cart.catalogAvailable) {
			setStatus("Catalogo no disponible para comprar.");
			APP.utils.notify("Carrito", "Revisa la conexion del catalogo.", "warning");
			return;
		}
		var total = cart.getTotal();
		requestCheckoutConfirmation(total).then(function (confirmed) {
			if (!confirmed) {
				setStatus("Compra cancelada.");
				return;
			}
			cart.clear();
			setStatus("Compra realizada. Gracias por tu pedido.");
			APP.utils.notify("Compra confirmada", "Recibimos tu pedido.", "success");
		});
	}

	function initEvents() {
		if (dom.items) {
			dom.items.addEventListener("click", handleCartClick);
			dom.items.addEventListener("keydown", handleCartKeydown);
			dom.items.addEventListener("change", handleQuantityChange);
		}
		if (dom.checkout) {
			dom.checkout.addEventListener("click", handleCheckout);
		}
	}

	function init() {
		cacheDom();
		ensureCheckoutButton();
		cart.load();
		cart.render();
		initEvents();
	}

	APP.cart = {
		init: init,
		addItem: function (product) {
			cart.addItem(product);
		},
		setCatalogAvailable: function (isAvailable) {
			cart.setCatalogAvailable(isAvailable);
		},
		render: function () {
			cart.render();
		}
	};
})();
