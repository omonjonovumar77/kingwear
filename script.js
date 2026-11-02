const products = [
  {
    id: 1,
    name: "KING WEAR Hudi",
    price: 299000,
    image: "./rasm/2.jpg",
    category: "Kiyim",
    description: "Qulay va zamonaviy qora hudi.",
    tag: "TOP"
  },
  {
    id: 2,
    name: "KING WEAR Futbolka",
    price: 179000,
    image: "./rasm/3.jpg",
    category: "Kiyim",
    description: "Har kun uchun zamonaviy futbolka.",
    tag: "YANGI"
  },
  {
    id: 3,
    name: "KING WEAR Svitshot",
    price: 249000,
    image: "./rasm/4.jpg",
    category: "Kiyim",
    description: "Minimalistik dizayn va qulaylik.",
    tag: "TOP"
  },
  {
    id: 4,
    name: "KING WEAR Kurtka",
    price: 499000,
    image: "./rasm/5.jpg",
    category: "Kiyim",
    description: "Sovuq kunlar uchun zamonaviy kurtka.",
    tag: "PREMIUM"
  },
  {
    id: 5,
    name: "KING WEAR Shalvar",
    price: 199000,
    image: "./rasm/6.jpg",
    category: "Kiyim",
    description: "Kundalik kiyish uchun qulay shalvar.",
    tag: ""
  },
  {
    id: 6,
    name: "KING WEAR Kepka",
    price: 129000,
    image: "./rasm/7.jpg",
    category: "Aksessuar",
    description: "Uslubingni to'ldiruvchi kepka.",
    tag: "TOP"
  },
  {
    id: 7,
    name: "KING WEAR Ryukzak",
    price: 249000,
    image: "./rasm/8.jpg",
    category: "Aksessuar",
    description: "Kundalik foydalanish uchun ryukzak.",
    tag: ""
  },
  {
    id: 8,
    name: "KING WEAR Krossovka",
    price: 399000,
    image: "./rasm/9.jpg",
    category: "Oyoq kiyim",
    description: "Zamonaviy va sportcha ko'rinish.",
    tag: "YANGI"
  }
];

let cart = [];
let selectedCategory = "Barchasi";
let toastTimer;

// DOM Elements
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("search");
const headerSearch = document.getElementById("headerSearch");
const clearHeaderSearch = document.getElementById("clearHeaderSearch");
const resetSearchBtn = document.getElementById("resetSearchBtn");
const cartItems = document.getElementById("cartItems");
const countElement = document.getElementById("count");
const totalElement = document.getElementById("total");
const emptyMessage = document.getElementById("emptyMessage");
const toast = document.getElementById("toast");

// Cart Drawer Elements
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const drawerItems = document.getElementById("drawerItems");
const drawerTotal = document.getElementById("drawerTotal");
const drawerBadge = document.getElementById("drawerBadge");
const closeDrawer = document.getElementById("closeDrawer");
const continueShopping = document.getElementById("continueShopping");
const drawerClear = document.getElementById("drawerClear");
const drawerCheckout = document.getElementById("drawerCheckout");

// Checkout Modal Elements
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutSummary = document.getElementById("checkoutSummary");
const checkoutForm = document.getElementById("checkoutForm");

function money(price) {
  return price.toLocaleString("uz-UZ") + " so'm";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Drawer Boshqaruvi
function openCartDrawer() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Checkout Modal Boshqaruvi
function openCheckoutModal() {
  closeCartDrawer();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  checkoutSummary.innerHTML = `
    ${cart.map(item => `
      <div class="checkout-summary-row">
        <span>${item.name} (${item.quantity} dona)</span>
        <span>${money(item.price * item.quantity)}</span>
      </div>
    `).join("")}
    <div class="checkout-summary-total">
      <span>Jami to'lov:</span>
      <span>${money(total)}</span>
    </div>
  `;

  checkoutOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  checkoutOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function renderProducts() {
  const query = (searchInput.value || (headerSearch ? headerSearch.value : "") || "").trim().toLowerCase();

  const filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "Barchasi" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  productsGrid.innerHTML = filtered.map(product => `
    <article class="product" id="product-${product.id}">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
        ${product.tag
          ? `<span class="product-tag">${product.tag}</span>`
          : ""}
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${money(product.price)}</p>
        <button class="add-button" data-add="${product.id}">
          <i class="fa-solid fa-cart-plus"></i> Savatchaga qo'shish
        </button>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = filtered.length > 0;
}

// =========================================================
// Qidiruv Boshqaruvi (Header va Kolleksiya bo'limi)
// =========================================================
function handleHeaderSearch() {
  const val = headerSearch.value;
  if (searchInput) searchInput.value = val;
  if (clearHeaderSearch) clearHeaderSearch.hidden = !val;
  renderProducts();
}

function handleSectionSearch() {
  const val = searchInput.value;
  if (headerSearch) {
    headerSearch.value = val;
    if (clearHeaderSearch) clearHeaderSearch.hidden = !val;
  }
  renderProducts();
}

function clearSearch() {
  if (headerSearch) {
    headerSearch.value = "";
    if (clearHeaderSearch) clearHeaderSearch.hidden = true;
  }
  if (searchInput) {
    searchInput.value = "";
  }
  renderProducts();
}

if (headerSearch) {
  headerSearch.addEventListener("input", handleHeaderSearch);
  headerSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    }
  });
}

if (clearHeaderSearch) {
  clearHeaderSearch.addEventListener("click", () => {
    clearSearch();
    headerSearch.focus();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", handleSectionSearch);
}

if (resetSearchBtn) {
  resetSearchBtn.addEventListener("click", () => {
    clearSearch();
    selectedCategory = "Barchasi";
    document.querySelectorAll(".category").forEach(cat => {
      cat.classList.toggle("active", cat.dataset.category === "Barchasi");
    });
    renderProducts();
  });
}

function addToCart(id) {
  const item = cart.find(product => product.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      ...products.find(product => product.id === id),
      quantity: 1
    });
  }

  renderCart();
  // Mahsulot qo'shilganda savatcha oynasi darhol ochilib, ichida ko'rinadi
  openCartDrawer();
  showToast("Mahsulot savatchaga qo'shildi!");
}

function changeQuantity(id, change) {
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(product => product.id !== id);
  renderCart();
  showToast("Mahsulot savatchadan o'chirildi.");
}

function renderCart() {
  const count = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  // 1. Sahifadagi asosiy savatcha (#cartItems)
  if (cartItems) {
    cartItems.innerHTML = cart.length
      ? cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">

          <div>
            <h3>${item.name}</h3>
            <p>${money(item.price * item.quantity)}</p>
          </div>

          <div class="quantity">
            <button data-minus="${item.id}" aria-label="Kamaytirish"><i class="fa-solid fa-minus"></i></button>
            <span>${item.quantity}</span>
            <button data-plus="${item.id}" aria-label="Ko'paytirish"><i class="fa-solid fa-plus"></i></button>
          </div>

          <button class="remove-button"
            data-remove="${item.id}" aria-label="O'chirish"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `).join("")
      : `<div class="cart-empty">
          <i class="fa-solid fa-bag-shopping empty-cart-icon"></i>
          <p>Savatcha hozircha bo'sh.<br>O'zingga yoqqan mahsulotni tanla!</p>
        </div>`;
  }

  // 2. Yon tomondan ochiladigan savatcha paneli (#drawerItems)
  if (drawerItems) {
    drawerItems.innerHTML = cart.length
      ? cart.map(item => `
        <div class="drawer-item">
          <div class="drawer-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="drawer-item-info">
            <h4>${item.name}</h4>
            <span class="drawer-item-price">${money(item.price * item.quantity)}</span>
          </div>
          <div class="drawer-item-controls">
            <div class="drawer-item-qty">
              <button data-minus="${item.id}" aria-label="Kamaytirish"><i class="fa-solid fa-minus"></i></button>
              <span>${item.quantity}</span>
              <button data-plus="${item.id}" aria-label="Ko'paytirish"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="drawer-item-remove" data-remove="${item.id}" title="O'chirish">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `).join("")
      : `<div class="drawer-empty">
          <i class="fa-solid fa-bag-shopping"></i>
          <p>Savatchangiz hozircha bo'sh.<br>O'zingizga yoqqan kiyimni tanlang!</p>
          <button class="gold-button" id="startShoppingBtn" style="padding: 10px 18px; font-size: 11px; margin-top: 5px;">
            Kolleksiyaga o'tish
          </button>
        </div>`;
  }

  // Sonlar va summalar
  countElement.textContent = count;
  totalElement.textContent = money(total);

  if (drawerBadge) drawerBadge.textContent = count;
  if (drawerTotal) drawerTotal.textContent = money(total);
}

// Mahsulotlarni savatchaga qo'shish
productsGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

// Sahifadagi savatchani boshqarish
cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.plus) {
    changeQuantity(Number(button.dataset.plus), 1);
  } else if (button.dataset.minus) {
    changeQuantity(Number(button.dataset.minus), -1);
  } else if (button.dataset.remove) {
    removeFromCart(Number(button.dataset.remove));
  }
});

// Yon tomondagi savatcha panelini (Drawer) boshqarish
drawerItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.id === "startShoppingBtn") {
    closeCartDrawer();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (button.dataset.plus) {
    changeQuantity(Number(button.dataset.plus), 1);
  } else if (button.dataset.minus) {
    changeQuantity(Number(button.dataset.minus), -1);
  } else if (button.dataset.remove) {
    removeFromCart(Number(button.dataset.remove));
  }
});

// Kategoriyalar
document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach(category => {
    category.classList.toggle("active", category === button);
  });

  renderProducts();
});

// Sahifadagi savatchani tozalash
document.getElementById("clearCart").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Savatcha allaqachon bo'sh.");
    return;
  }

  cart = [];
  renderCart();
  showToast("Savatcha tozalandi.");
});

// Drawer savatchani tozalash
drawerClear.addEventListener("click", () => {
  if (!cart.length) {
    showToast("Savatcha allaqachon bo'sh.");
    return;
  }

  cart = [];
  renderCart();
  showToast("Savatcha tozalandi.");
});

// Headerdagi savatcha tugmasi bosilganda oynani ochish
document.getElementById("cartToggle").addEventListener("click", () => {
  openCartDrawer();
});

// Drawerni yopish tugmalari
closeDrawer.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);
continueShopping.addEventListener("click", closeCartDrawer);

// Buyurtma berish tugmalari (Sahifa va Drawer)
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Avval savatchaga mahsulot qo'shing.");
    return;
  }
  openCheckoutModal();
});

drawerCheckout.addEventListener("click", () => {
  if (!cart.length) {
    showToast("Avval savatchaga mahsulot qo'shing.");
    return;
  }
  openCheckoutModal();
});

// Checkout modalni yopish
closeCheckout.addEventListener("click", closeCheckoutModal);
checkoutOverlay.addEventListener("click", event => {
  if (event.target === checkoutOverlay) {
    closeCheckoutModal();
  }
});

// Buyurtma formasini yuborish
checkoutForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("custName").value.trim();
  const orderId = Math.floor(10000 + Math.random() * 90000);

  closeCheckoutModal();
  cart = [];
  renderCart();
  showToast(`Rahmat, ${name}! Buyurtmangiz (#KW-${orderId}) qabul qilindi.`);
  checkoutForm.reset();
});

// Esc tugmasi bosilganda oynalarni yopish
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCartDrawer();
    closeCheckoutModal();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
