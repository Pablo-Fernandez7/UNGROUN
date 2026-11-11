
// ==============================
// SELECTOR DE TALLAS
// ==============================

const sizeButtons = document.querySelectorAll(".size-btn");

sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
        sizeButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");
    });
});


// ==============================
// DATOS DEL CARRITO
// ==============================

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function updateCartCount() {
    const counter = document.querySelector("#cart-count");

    if (counter) {
        counter.textContent = cartItems.length;
    }
}


// ==============================
// AÑADIR PRODUCTOS
// ==============================

const buyButton = document.querySelector(".buy-btn");
const cartMessage = document.querySelector("#cart-message");

if (buyButton) {
    buyButton.addEventListener("click", () => {

        const selectedSize = document.querySelector(".size-btn.selected");

        if (!selectedSize) {
            cartMessage.textContent = "Please select a size first.";
            cartMessage.style.color = "#ff5555";
            return;
        }

        const productName = document.querySelector(".product-info h1").textContent;
        const productPrice = parseFloat(
            document.querySelector(".product-info .price").textContent.replace("€", "")
        );
        const productImage = document.querySelector(".product-detail img").getAttribute("src");

        const product = {
            name: productName,
            size: selectedSize.textContent,
            price: productPrice,
            image: productImage
        };

        cartItems.push(product);

        saveCart();
        updateCartCount();

        cartMessage.textContent = "Added to cart! Size: " + product.size;
        cartMessage.style.color = "white";
    });
}


// ==============================
// MOSTRAR PRODUCTOS DEL CARRITO
// ==============================

const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");

function renderCart() {

    if (!cartList || !cartTotal) return;

    cartList.innerHTML = "";

    if (cartItems.length === 0) {
        cartList.innerHTML = '<p class="empty-cart">YOUR CART IS EMPTY.</p>';
    }

    cartItems.forEach((item, index) => {

        const productElement = document.createElement("div");

        productElement.className = "cart-item";

        productElement.innerHTML = `
            <div class="cart-product-info">

                <img
                    src="${item.image || 'images/camiseta.jpg'}"
                    alt="${item.name}"
                >

                <div>
                    <h3>${item.name}</h3>
                    <p>SIZE: ${item.size}</p>
                    <p class="cart-price">€${item.price.toFixed(2)}</p>
                </div>

            </div>

            <div class="cart-actions">
                <button data-action="duplicate" data-index="${index}">+</button>
                <button data-action="remove" data-index="${index}">REMOVE</button>
            </div>
        `;

        cartList.appendChild(productElement);
    });

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    cartTotal.textContent = "€" + total.toFixed(2);

    updateCartCount();
}


// ==============================
// DUPLICAR Y ELIMINAR PRODUCTOS
// ==============================

if (cartList) {

    cartList.addEventListener("click", (event) => {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const index = Number(button.dataset.index);

        if (button.dataset.action === "duplicate") {
            cartItems.push({...cartItems[index]});
        }

        if (button.dataset.action === "remove") {
            cartItems.splice(index, 1);
        }

        saveCart();
        renderCart();
    });
}


// ==============================
// INICIAR
// ==============================

updateCartCount();
renderCart();


// ==============================
// PLATFORM SELECTOR
// ==============================

const platformButton = document.querySelector("#platform-button");
const platformMenu = document.querySelector("#platform-menu");

const savedView = localStorage.getItem("platformView");

document.body.classList.toggle(
    "mobile-preview",
    savedView === "mobile"
);

if (platformButton && platformMenu) {

    platformButton.addEventListener("click", () => {
        platformMenu.classList.toggle("active");
    });

    platformMenu.addEventListener("click", (event) => {

        const selectedButton = event.target.closest("button[data-view]");

        if (!selectedButton) return;

        const selectedView = selectedButton.dataset.view;

        localStorage.setItem("platformView", selectedView);

        document.body.classList.toggle(
            "mobile-preview",
            selectedView === "mobile"
        );

        platformMenu.classList.remove("active");
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".platform-selector")) {
            platformMenu.classList.remove("active");
        }
    });
}


// ==============================
// BACK TO TOP
// ==============================

const backToTop = document.querySelector("#back-to-top");

if (backToTop) {

    window.addEventListener("scroll", () => {
        if (window.scrollY > 350) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

}


// ==============================
// PRODUCT SEARCH + CATEGORY FILTERS
// ==============================

const searchInput = document.querySelector("#product-search");
const products = document.querySelectorAll(".product");
const noResults = document.querySelector("#no-results");
const filterButtons = document.querySelectorAll(".filter-btn");

let selectedCategory = "all";

function filterProducts() {

    if (products.length === 0) return;

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    let visibleProducts = 0;

    products.forEach(product => {

        const productName = product.querySelector("h3").textContent.toLowerCase();
        const productCategory = product.dataset.category;

        const matchesSearch = productName.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            product.style.display = "";
            visibleProducts++;
        } else {
            product.style.display = "none";
        }

    });

    if (noResults) {
        noResults.style.display = visibleProducts === 0 ? "block" : "none";
    }

}


// BUSCADOR

if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}


// BOTONES DE CATEGORÍAS

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedCategory = button.dataset.category;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        filterProducts();

    });

});


// ==============================
// WISHLIST
// ==============================

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const wishlistButtons = document.querySelectorAll(".wishlist-btn");

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function updateWishlistButtons() {

    wishlistButtons.forEach(button => {

        const productName = button.dataset.product;
        const isFavorite = wishlist.includes(productName);

        button.classList.toggle("active", isFavorite);
        button.textContent = isFavorite ? "♥" : "♡";

    });

}

wishlistButtons.forEach(button => {

    button.addEventListener("click", () => {

        const productName = button.dataset.product;

        if (wishlist.includes(productName)) {

            wishlist = wishlist.filter(item => item !== productName);

        } else {

            wishlist.push(productName);

        }

        saveWishlist();
        updateWishlistButtons();

    });

});

updateWishlistButtons();

