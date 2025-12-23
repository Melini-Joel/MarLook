// ===== CONFIGURACIÓN FIREBASE =====
const firebaseConfig = {
  apiKey: "AIzaSyBNIcGa1ns81g9wbdTaO_pokngT6BNu330",
  authDomain: "marlook-bc5aa.firebaseapp.com",
  projectId: "marlook-bc5aa",
  storageBucket: "marlook-bc5aa.firebasestorage.app",
  messagingSenderId: "442377080004",
  appId: "1:442377080004:web:55b1de3ee9a79a5f140d91"
};



console.log("Firebase inicializado");

// ===== FIN CONFIGURACIÓN FIREBASE =====

let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

const productListEl = document.getElementById("product-list");

async function loadProductsFromFirebase() {
  try {
    console.log("Cargando productos...");
    const snapshot = await db.collection("productos").get();
    
    products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("Productos cargados:", products);
    renderProducts();
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderProducts() {
  productListEl.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-price">$${p.price}</p>
        <div class="product-bottom">
          <button class="btn btn-secondary btn-add" data-id="${p.id}">Agregar</button>
        </div>
      </div>
    `;
    productListEl.appendChild(card);
  });
}

loadProductsFromFirebase();

// ===== CARRITO =====
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalQty;
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Tu carrito está vacío.</p>";
    cartTotalEl.textContent = "0";
    updateCartCount();
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <div>
        <button class="btn btn-secondary btn-dec" data-id="${item.id}">-</button>
        <button class="btn btn-secondary btn-inc" data-id="${item.id}">+</button>
        <button class="btn btn-secondary btn-remove" data-id="${item.id}">✕</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = total;
  updateCartCount();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  renderCart();
}

productListEl.addEventListener("click", e => {
  if (e.target.classList.contains("btn-add")) {
    const id = e.target.dataset.id;
    addToCart(id);
  }
});

cartItemsEl.addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (!id) return;

  const itemIndex = cart.findIndex(i => i.id === id);
  if (itemIndex === -1) return;

  if (e.target.classList.contains("btn-inc")) {
    cart[itemIndex].quantity += 1;
  } else if (e.target.classList.contains("btn-dec")) {
    cart[itemIndex].quantity -= 1;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
  } else if (e.target.classList.contains("btn-remove")) {
    cart.splice(itemIndex, 1);
  }
  saveCart();
  renderCart();
});

// ===== MODALES =====
const cartModal = document.getElementById("cart-modal");
const authModal = document.getElementById("auth-modal");
const btnCart = document.getElementById("btn-cart");
const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");

btnCart.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  renderCart();
});

document.querySelectorAll(".close").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.close;
    document.getElementById(target).classList.add("hidden");
  });
});

window.addEventListener("click", e => {
  if (e.target === cartModal) cartModal.classList.add("hidden");
  if (e.target === authModal) authModal.classList.add("hidden");
});

// ===== TABS =====
const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

tabLogin.classList.add("active");
tabRegister.classList.remove("active");
loginForm.classList.add("active");
registerForm.classList.remove("active");

btnLogin.addEventListener("click", () => {
  authModal.classList.remove("hidden");
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
});

tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
});

tabRegister.addEventListener("click", () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
});

// ===== AUTENTICACIÓN =====
function getUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

registerForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim().toLowerCase();
  const password = document.getElementById("register-password").value;

  if (!name || !email || !password) {
    alert("Completá todos los campos.");
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    alert("Ya existe una cuenta con ese email.");
    return;
  }

  users.push({ name, email, password });
  saveUsers(users);

  currentUser = { name, email };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  updateAuthUI();
  registerForm.reset();
  authModal.classList.add("hidden");
  alert(`¡Bienvenida ${name}! Tu cuenta fue creada correctamente.`);
});

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Credenciales inválidas.");
    return;
  }

  currentUser = { name: user.name, email: user.email };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  updateAuthUI();
  loginForm.reset();
  authModal.classList.add("hidden");
  alert(`¡Bienvenida ${user.name}!`);
});

function updateAuthUI() {
  if (currentUser) {
    btnLogin.classList.add("hidden");
    btnLogout.classList.remove("hidden");
    btnLogout.textContent = `Cerrar sesión (${currentUser.name})`;
  } else {
    btnLogin.classList.remove("hidden");
    btnLogout.classList.add("hidden");
  }
}

btnLogout.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateAuthUI();
  alert("Sesión cerrada.");
});

// ===== CHECKOUT =====
const btnCheckout = document.getElementById("btn-checkout");
btnCheckout.addEventListener("click", () => {
  if (!currentUser) {
    alert("Tenés que iniciar sesión para finalizar la compra.");
    cartModal.classList.add("hidden");
    authModal.classList.remove("hidden");
    return;
  }
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  alert(`¡Gracias por tu compra, ${currentUser.name}! Pronto te contactaremos con los detalles de envío.`);
  cart = [];
  saveCart();
  renderCart();
  cartModal.classList.add("hidden");
});

// Inicializar
updateCartCount();
renderCart();
updateAuthUI();
