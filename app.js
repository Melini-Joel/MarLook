import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNIcGa1ns81g9wbdTaO_pokngT6BNu330",
  authDomain: "marlook-bc5aa.firebaseapp.com",
  projectId: "marlook-bc5aa",
  storageBucket: "marlook-bc5aa.firebasestorage.app",
  messagingSenderId: "442377080004",
  appId: "1:442377080004:web:55b1de3ee9a79a5f140d91"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productList = document.getElementById("product-list");

const cargarProductos = async () => {
  const querySnapshot = await getDocs(collection(db, "productos"));

  productList.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const producto = doc.data();

    productList.innerHTML += `
  <div class="product-card">
    <img src="${producto.image}" alt="${producto.name}">
    <h3>${producto.name}</h3>
    <p>$${producto.price}</p>
    <button class="btn btn-primary"
  onclick="agregarAlCarrito({
    id: '${doc.id}',
    nombre: '${producto.name}',
    precio: ${producto.price},
    imagen: '${producto.image}'
  })">
  Agregar al carrito
</button>
  </div>
`;
  });
};

cargarProductos();

// ===== CARRITO =====

let carrito = [];

window.agregarAlCarrito = (producto) => {
  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.quantity += 1;
  } else {
    carrito.push({ ...producto, quantity: 1 });
  }

  actualizarCarrito();
};
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

const actualizarCarrito = () => {
  cartItems.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    cartCount.textContent = "0";
    cartTotal.textContent = "0";
    return;
  }

  carrito.forEach((prod) => {
    total += prod.precio * prod.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${prod.imagen}" alt="${prod.nombre}" width="50">
        <div style="flex:1">
          <p>${prod.nombre}</p>
          <p>$${prod.precio} x ${prod.quantity}</p>
        </div>
        <div class="cart-actions">
          <button class="btn btn-secondary" onclick="sumarProducto('${prod.id}')">+</button>
          <button class="btn btn-secondary" onclick="restarProducto('${prod.id}')">-</button>
          <button class="btn btn-secondary" onclick="eliminarProducto('${prod.id}')">✕</button>
        </div>
      </div>
    `;
  });

  cartCount.textContent = carrito.reduce((acc, p) => acc + p.quantity, 0);
  cartTotal.textContent = total;
};
window.sumarProducto = (id) => {
  const prod = carrito.find(p => p.id === id);
  if (prod) {
    prod.quantity += 1;
    actualizarCarrito();
  }
};

window.restarProducto = (id) => {
  const prod = carrito.find(p => p.id === id);
  if (!prod) return;

  prod.quantity -= 1;
  if (prod.quantity <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }

  actualizarCarrito();
};

window.eliminarProducto = (id) => {
  carrito = carrito.filter(p => p.id !== id);
  actualizarCarrito();
};
// ===== MODAL CARRITO =====

const btnCart = document.getElementById("btn-cart");
const cartModal = document.getElementById("cart-modal");

// Abrir carrito
btnCart.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
});

// Cerrar carrito (X)
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.close).classList.add("hidden");
  });
});

/*
// Productos locales (edita o añade más objetos según necesites)
let products = [
  { id: 'p1', name: 'Calzas cortas', price: 15000, image: 'img/img1.jpeg' },
  { id: 'p2', name: 'Remerones', price: 12000, image: 'img/img2.jpeg' },
  { id: 'p3', name: 'Vestido batik', price: 25000, image: 'img/img3.jpeg' },
  { id: 'p4', name: 'Remeras deportivas', price: 15000, image: 'img/img4.jpeg' },
  { id: 'p5', name: 'Calzas levanta gluteos', price: 13000, image: 'img/img5.jpeg' },
  { id: 'p6', name: 'Calzas cortas', price: 15000, image: 'img/img6.jpeg' },
  { id: 'p3', name: 'Calzas cortas', price: 15000, image: 'img/img7.jpeg' },
  { id: 'p3', name: 'Calzas cortas', price: 15000, image: 'img/img8.jpeg' },
  { id: 'p3', name: 'Calzas cortas', price: 15000, image: 'img/img9.jpeg' },
];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

const productListEl = document.getElementById("product-list");

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

// Productos locales ya definidos arriba; no se usa Firebase.
// Renderizar productos al inicio
renderProducts();
*/
/*




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
*/