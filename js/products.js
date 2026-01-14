(function () {
	var APP = window.VestiaApp;
	if (!APP) return;

	var state = {
		baseProducts: [],
		filteredProducts: [],
		categories: [],
		currentPage: 1,
		apiAvailable: true,
		lastQuery: "",
		lastCategory: "",
		activeFilters: null,
		isLoading: false
	};

	var dom = {};

	function cacheDom() {
		dom.grid = APP.utils.byId("product-grid");
		dom.pagination = APP.utils.byId("catalog-pagination");
		dom.status = APP.utils.byId("catalog-status");
		dom.searchInput = APP.utils.byId("search-input");
		dom.searchForm = APP.utils.byId("search-form");
		dom.categorySelect = APP.utils.byId("category-select");
		dom.colorSelect = APP.utils.byId("color-select");
		dom.sizeSelect = APP.utils.byId("size-select");
		dom.occasionSelect = APP.utils.byId("occasion-select");
		dom.styleSelect = APP.utils.byId("style-select");
	}

	function setStatus(message) {
		if (dom.status) dom.status.textContent = message || "";
	}

	function setLoading(loading) {
		state.isLoading = loading;
		if (dom.grid) {
			if (loading) {
				dom.grid.innerHTML = createLoadingCards();
			}
		}
	}

	function createLoadingCards() {
		var html = "";
		for (var i = 0; i < 6; i++) {
			html += `
				<li class="col-12 col-sm-6 col-lg-4 mb-4">
					<div class="card h-100">
						<div class="placeholder-glow">
							<div class="placeholder col-12" style="height: 200px; background: #e9ecef;"></div>
						</div>
						<div class="card-body">
							<div class="placeholder-glow">
								<span class="placeholder col-7"></span>
								<span class="placeholder col-4"></span>
								<span class="placeholder col-6"></span>
							</div>
						</div>
					</div>
				</li>`;
		}
		return html;
	}

	function deriveAttributes(product) {
		var c = APP.constants;
		return {
			colors: [c.colors[product.id % c.colors.length]],
			sizes: [c.sizes[product.id % c.sizes.length]],
			occasion: c.occasions[product.id % c.occasions.length],
			style: c.styles[product.id % c.styles.length]
		};
	}

	function fetchJson(url) {
		return fetch(url).then(function (response) {
			if (!response.ok) throw new Error("Network error");
			return response.json();
		});
	}

	function getAllowedCategories() {
		var allowed = APP.config.clothingCategories || [];
		return Array.isArray(allowed) ? allowed : [];
	}

	function isAllowedCategory(category, allowed) {
		if (!allowed || !allowed.length) {
			return true;
		}
		return allowed.indexOf(category) !== -1;
	}

	function filterAllowedProducts(list, allowed) {
		if (!allowed || !allowed.length) {
			return list;
		}
		return list.filter(function (product) {
			return isAllowedCategory(product.category, allowed);
		});
	}

	function fetchBaseProducts(query, category) {
		var baseUrl = APP.config.dummyBaseUrl;
		var allowed = getAllowedCategories();
		var hasAllowed = allowed.length > 0;
		var fetchPromise;

		if (category && hasAllowed && allowed.indexOf(category) === -1) {
			return Promise.resolve([]);
		}

		if (!query && !category && hasAllowed) {
			var requests = allowed.map(function (slug) {
				return fetchJson(baseUrl + "/products/category/" + encodeURIComponent(slug));
			});
			fetchPromise = Promise.all(requests).then(function (results) {
				var list = [];
				results.forEach(function (data) {
					list = list.concat(data.products || []);
				});
				return list;
			});
		} else {
			var url = baseUrl + "/products?limit=100";

			if (query) {
				url = baseUrl + "/products/search?q=" + encodeURIComponent(query);
			} else if (category) {
				url = baseUrl + "/products/category/" + encodeURIComponent(category);
			}

			fetchPromise = fetchJson(url).then(function (data) {
				return data.products || [];
			});
		}

		return fetchPromise
			.then(function (list) {
				var filtered = filterAllowedProducts(list, allowed);
				state.apiAvailable = true;
				return filtered.map(function (p) {
					p.meta = deriveAttributes(p);
					return p;
				});
			})
			.catch(function (error) {
				console.error("Error fetching products:", error);
				state.apiAvailable = false;
				return [];
			});
	}


	function fetchCategories() {
		return fetchJson(APP.config.dummyBaseUrl + "/products/categories")
			.then(function (categories) {
				var allowed = getAllowedCategories();
				var list = categories || [];
				if (allowed.length) {
					list = list.filter(function (cat) {
						var slug = cat.slug || cat;
						return allowed.indexOf(slug) !== -1;
					});
				}
				state.categories = list;
				if (APP.filters && APP.filters.setCategories) {
					APP.filters.setCategories(state.categories);
				} else {
					populateCategorySelect();
				}
			})
			.catch(function (error) {
				console.error("Error fetching categories:", error);
			});
	}


	function populateCategorySelect() {
		if (!dom.categorySelect) return;

		dom.categorySelect.innerHTML = '<option value="">Todas</option>';
		state.categories.forEach(function (cat) {
			var option = document.createElement("option");
			option.value = cat.slug || cat;
			option.textContent = cat.name || cat;
			dom.categorySelect.appendChild(option);
		});
	}

	function normalizeFilters(filters) {
		var source = filters || {};
		return {
			query: typeof source.query === "string" ? source.query : "",
			category: source.category || "",
			color: source.color || "",
			size: source.size || "",
			occasion: source.occasion || "",
			style: source.style || "",
			priceMin: typeof source.priceMin === "number" ? source.priceMin : 0,
			priceMax: APP.utils.toNumber(source.priceMax, APP.constants.priceMaxDefault)
		};
	}

	function getActiveFilters(filters) {
		if (filters) {
			return normalizeFilters(filters);
		}
		if (state.activeFilters) {
			return state.activeFilters;
		}
		if (APP.filters && APP.filters.state) {
			return normalizeFilters(APP.filters.state);
		}
		return normalizeFilters({});
	}

	function applyLocalFilters(products, filters) {
		var query = filters.query ? String(filters.query).toLowerCase().trim() : "";
		return products.filter(function (product) {
			if (query) {
				var haystack = ((product.title || "") + " " + (product.description || "")).toLowerCase();
				if (haystack.indexOf(query) == -1) return false;
			}
			if (filters.category && product.category !== filters.category) return false;
			if (filters.color && product.meta.colors.indexOf(filters.color) === -1) return false;
			if (filters.size && product.meta.sizes.indexOf(filters.size) === -1) return false;
			if (filters.occasion && product.meta.occasion !== filters.occasion) return false;
			if (filters.style && product.meta.style !== filters.style) return false;
			if (typeof filters.priceMin === "number" && product.price < filters.priceMin) return false;
			if (typeof filters.priceMax === "number" && product.price > filters.priceMax) return false;
			return true;
		});
	}

	function paginate(list) {
		var perPage = APP.config.productsPerPage;
		var start = (state.currentPage - 1) * perPage;
		return list.slice(start, start + perPage);
	}

	function createProductCard(product) {
		var item = document.createElement("li");
		item.className = "col-12 col-sm-6 col-lg-4 mb-4";

		var description = product.description || "";
		var shortDesc = description.length > 80 ? description.substring(0, 80) + "..." : description;

		item.innerHTML = `
			<div class="card h-100 shadow-sm">
				<img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" loading="lazy">
				<div class="card-body d-flex flex-column">
					<h3 class="h5 card-title">${product.title}</h3>
					<p class="text-muted small mb-2">${shortDesc}</p>
					<p class="fw-bold fs-5 text-primary mb-3">${APP.utils.formatPrice(product.price)}</p>
					<div class="mb-3">
						<span class="badge bg-light text-dark border me-1">${product.meta.colors[0]}</span>
						<span class="badge bg-light text-dark border me-1">${product.meta.style}</span>
						<span class="badge bg-light text-dark border">${product.meta.sizes[0]}</span>
					</div>
					<button class="btn btn-outline-dark mt-auto js-add-to-cart" data-id="${product.id}">
						<i class="fa-solid fa-cart-plus me-1"></i>
						Agregar al carrito
					</button>
				</div>
			</div>`;
		return item;
	}

	function createRecommendationCard(product) {
		var item = document.createElement("li");
		item.className = "col-12 mb-3";

		var description = product.description || "";
		var shortDesc = description.length > 80 ? description.substring(0, 80) + "..." : description;

		item.innerHTML = `
			<div class="card h-100 shadow-sm">
				<img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" loading="lazy">
				<div class="card-body d-flex flex-column">
					<h3 class="h6 card-title">${product.title}</h3>
					<p class="text-muted small mb-2">${shortDesc}</p>
					<p class="fw-bold text-primary mb-3">${APP.utils.formatPrice(product.price)}</p>
					<button class="btn btn-outline-dark btn-sm mt-auto js-add-to-cart" data-id="${product.id}">
						<i class="fa-solid fa-cart-plus me-1"></i>
						Agregar al carrito
					</button>
				</div>
			</div>`;
		return item;
	}

	function renderProducts(list) {
		if (!dom.grid) return;
		dom.grid.innerHTML = "";

		if (list.length === 0) {
			dom.grid.innerHTML = `
				<div class="col-12 text-center py-5">
					<i class="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
					<p class="text-muted">No se encontraron productos</p>
				</div>`;
			return;
		}

		list.forEach(function (p) {
			dom.grid.appendChild(createProductCard(p));
		});
	}

	function renderRecommendations(container, items) {
		if (!container) {
			return;
		}
		container.innerHTML = "";

		if (!items || !items.length) {
			var empty = document.createElement("li");
			empty.className = "text-muted";
			empty.textContent = "No hay recomendaciones disponibles.";
			container.appendChild(empty);
			return;
		}

		items.forEach(function (p) {
			container.appendChild(createRecommendationCard(p));
		});
	}

	function renderPagination(totalItems) {
		if (!dom.pagination) return;
		dom.pagination.innerHTML = "";

		var totalPages = Math.ceil(totalItems / APP.config.productsPerPage) || 1;

		if (totalPages <= 1) return;

		for (var i = 1; i <= totalPages; i++) {
			var li = document.createElement("li");
			li.className = "page-item" + (i === state.currentPage ? " active" : "");
			li.innerHTML = `<span class="page-link" role="button" tabindex="0" data-page="${i}">${i}</span>`;
			dom.pagination.appendChild(li);
		}
	}

	function updateCatalog(filters, resetPage) {
		var activeFilters = getActiveFilters(filters);
		state.activeFilters = activeFilters;
		state.filteredProducts = applyLocalFilters(state.baseProducts, activeFilters);
		if (resetPage) state.currentPage = 1;

		var paginatedProducts = paginate(state.filteredProducts);
		renderProducts(paginatedProducts);
		renderPagination(state.filteredProducts.length);
		setStatus(state.filteredProducts.length + " productos encontrados");
	}

	function getFilteredProducts() {
		return state.filteredProducts.slice();
	}

	function refreshCatalog(options) {
		var opts = options || {};
		var filters = opts.filters || getActiveFilters();
		setLoading(true);
		setStatus("Cargando productos...");

		return fetchBaseProducts(opts.query, opts.category)
			.then(function (products) {
				state.baseProducts = products;
				state.lastQuery = opts.query || "";
				state.lastCategory = opts.category || "";
				if (APP.cart && APP.cart.setCatalogAvailable) {
					APP.cart.setCatalogAvailable(state.apiAvailable);
				}
				setLoading(false);
				updateCatalog(filters, opts.resetPage);
			})
			.catch(function (error) {
				setLoading(false);
				setStatus("Error al cargar productos. Intenta de nuevo.");
				console.error("Error refreshing catalog:", error);
			});
	}

	function syncWithFilters(filters, options) {
		var opts = options || {};
		var nextQuery = filters && typeof filters.query === "string" ? filters.query.trim() : "";
		var nextCategory = filters && typeof filters.category === "string" ? filters.category : "";
		var shouldFetch = !state.baseProducts.length || nextQuery !== state.lastQuery || nextCategory !== state.lastCategory;
		if (shouldFetch) {
			return refreshCatalog({
				query: nextQuery,
				category: nextCategory,
				resetPage: opts.resetPage,
				filters: filters
			});
		}
		updateCatalog(filters, opts.resetPage);
		return Promise.resolve();
	}

	function handleSearch(e) {
		e.preventDefault();
		var query = dom.searchInput ? dom.searchInput.value.trim() : "";
		refreshCatalog({ query: query, resetPage: true });
	}

	function handleCategoryChange() {
		var category = dom.categorySelect ? dom.categorySelect.value : "";
		if (category) {
			refreshCatalog({ category: category, resetPage: true });
		} else {
			refreshCatalog({ resetPage: true });
		}
	}

	function initEvents() {
		if (!APP.filters) {
			if (dom.searchForm) {
				dom.searchForm.addEventListener("submit", handleSearch);
			}

			if (dom.categorySelect) {
				dom.categorySelect.addEventListener("change", handleCategoryChange);
			}
		}

		if (dom.grid) {
			dom.grid.addEventListener("click", handleAddToCart);
		}

		if (dom.pagination) {
			dom.pagination.addEventListener("click", function (e) {
				if (e.target.classList.contains("page-link")) {
					state.currentPage = parseInt(e.target.getAttribute("data-page"));
					updateCatalog();
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			});
		}
	}

	function populateFilterSelects() {
		var c = APP.constants;

		if (dom.colorSelect) {
			c.colors.forEach(function (color) {
				var option = document.createElement("option");
				option.value = color;
				option.textContent = color;
				dom.colorSelect.appendChild(option);
			});
		}

		if (dom.sizeSelect) {
			c.sizes.forEach(function (size) {
				var option = document.createElement("option");
				option.value = size;
				option.textContent = size;
				dom.sizeSelect.appendChild(option);
			});
		}

		if (dom.occasionSelect) {
			c.occasions.forEach(function (occasion) {
				var option = document.createElement("option");
				option.value = occasion;
				option.textContent = occasion;
				dom.occasionSelect.appendChild(option);
			});
		}

		if (dom.styleSelect) {
			c.styles.forEach(function (style) {
				var option = document.createElement("option");
				option.value = style;
				option.textContent = style;
				dom.styleSelect.appendChild(option);
			});
		}
	}

	function getProductById(id) {
		return state.baseProducts.find(function (p) {
			return p.id === parseInt(id);
		});
	}

	function handleAddToCart(event) {
		var trigger = event.target.closest(".js-add-to-cart");
		if (!trigger) {
			return;
		}
		var id = trigger.getAttribute("data-id");
		var product = getProductById(id);
		if (!product || !APP.cart || !APP.cart.addItem) {
			return;
		}
		APP.cart.addItem(product);
	}

	function init() {
		cacheDom();
		if (!APP.filters) {
			populateFilterSelects();
		}
		initEvents();

		fetchCategories().then(function () {
			refreshCatalog({ resetPage: true });
		});
	}

	APP.products = {
		init: init,
		refreshCatalog: refreshCatalog,
		syncWithFilters: syncWithFilters,
		updateCatalog: updateCatalog,
		getFilteredProducts: getFilteredProducts,
		renderRecommendations: renderRecommendations,
		getProductById: getProductById,
		state: state
	};

})();
