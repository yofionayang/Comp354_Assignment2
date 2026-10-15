// ---------- DATABASE SCHEMA ----------
// Relational shape, kept as plain JS so every teammate can run it by opening index.html.
//   restaurants(id PK, name, cuisine, eta_min)
//   menu_items(id PK, restaurant_id FK -> restaurants.id, name, price_cents)
//   cart_items(menu_item_id FK -> menu_items.id, qty)   [stored in localStorage]
const SCHEMA = {
  restaurants: ["id", "name", "cuisine", "eta_min"],
  menu_items: ["id", "restaurant_id", "name", "price_cents"],
  cart_items: ["menu_item_id", "qty"],
};

// ---------- SEED DATA ----------
const DB = {
  restaurants: [
    { id: 1, name: "Maple Street Burgers", cuisine: "Burgers", eta_min: 25 },
    { id: 2, name: "Sakura Sushi", cuisine: "Japanese", eta_min: 35 },
    { id: 3, name: "Casa Pizza", cuisine: "Italian", eta_min: 30 },
  ],
  menu_items: [
    { id: 101, restaurant_id: 1, name: "Classic Burger", price_cents: 1099 },
    { id: 102, restaurant_id: 1, name: "Poutine", price_cents: 799 },
    { id: 103, restaurant_id: 1, name: "Milkshake", price_cents: 599 },
    { id: 201, restaurant_id: 2, name: "Salmon Nigiri (2 pc)", price_cents: 699 },
    { id: 202, restaurant_id: 2, name: "California Roll", price_cents: 899 },
    { id: 203, restaurant_id: 2, name: "Miso Soup", price_cents: 399 },
    { id: 301, restaurant_id: 3, name: "Margherita Pizza", price_cents: 1399 },
    { id: 302, restaurant_id: 3, name: "Caesar Salad", price_cents: 899 },
    { id: 303, restaurant_id: 3, name: "Tiramisu", price_cents: 749 },
  ],
};

// ---------- CART LOGIC (pure, easy to unit test) ----------
const Cart = {
  items: [], // [{ menu_item_id, qty }]
  add(id) {
    const line = this.items.find((i) => i.menu_item_id === id);
    line ? line.qty++ : this.items.push({ menu_item_id: id, qty: 1 });
  },
  change(id, delta) {
    const line = this.items.find((i) => i.menu_item_id === id);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) this.remove(id);
  },
  remove(id) {
    this.items = this.items.filter((i) => i.menu_item_id !== id);
  },
  total() {
    return this.items.reduce((sum, i) => sum + menuItem(i.menu_item_id).price_cents * i.qty, 0);
  },
  restaurantId() {
    return this.items.length ? menuItem(this.items[0].menu_item_id).restaurant_id : null;
  },
  save() {
    try { localStorage.setItem("quickbite_cart", JSON.stringify(this.items)); } catch (e) {}
  },
  load() {
    try { this.items = JSON.parse(localStorage.getItem("quickbite_cart")) || []; } catch (e) { this.items = []; }
  },
};

const menuItem = (id) => DB.menu_items.find((m) => m.id === id);
const restaurant = (id) => DB.restaurants.find((r) => r.id === id);
const money = (cents) => "$" + (cents / 100).toFixed(2);

// ---------- UI ----------
const browseEl = document.getElementById("browse");
const cartEl = document.getElementById("cart");
let currentRestaurant = null;
let notice = "";

function showRestaurants() {
  currentRestaurant = null;
  browseEl.innerHTML = "<h2>Restaurants</h2>";
  const list = document.createElement("div");
  list.className = "list";
  DB.restaurants.forEach((r) => {
    const b = document.createElement("button");
    b.className = "row restaurant";
    b.innerHTML = `<span><strong>${r.name}</strong><small>${r.cuisine}</small></span><small>${r.eta_min} min</small>`;
    b.onclick = () => showMenu(r.id);
    list.appendChild(b);
  });
  browseEl.appendChild(list);
}

function showMenu(restaurantId) {
  currentRestaurant = restaurantId;
  const r = restaurant(restaurantId);
  browseEl.innerHTML = `<button class="back">Back to restaurants</button><h2>${r.name}</h2>`;
  browseEl.querySelector(".back").onclick = showRestaurants;
  const list = document.createElement("div");
  list.className = "list";
  DB.menu_items.filter((m) => m.restaurant_id === restaurantId).forEach((m) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${m.name}<small>${money(m.price_cents)}</small></span><button class="primary">Add to cart</button>`;
    row.querySelector("button").onclick = () => addToCart(m.id);
    list.appendChild(row);
  });
  browseEl.appendChild(list);
}

function addToCart(id) {
  const rid = Cart.restaurantId();
  if (rid && rid !== menuItem(id).restaurant_id) {
    notice = `Your cart has items from ${restaurant(rid).name}. Clear it to order from a different restaurant.`;
  } else {
    notice = "";
    Cart.add(id);
    Cart.save();
  }
  renderCart();
}

function renderCart() {
  if (!Cart.items.length) {
    cartEl.innerHTML = `<p class="empty">Your cart is empty. Pick a restaurant and add a dish.</p>` +
      (notice ? `<p class="note">${notice}</p>` : "");
    return;
  }
  cartEl.innerHTML = `<p class="empty">From ${restaurant(Cart.restaurantId()).name}</p>`;
  const list = document.createElement("div");
  list.className = "list";
  Cart.items.forEach((i) => {
    const m = menuItem(i.menu_item_id);
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span>${m.name}<small>${money(m.price_cents * i.qty)}</small></span>
      <span class="qty"><button aria-label="Decrease">-</button><span>${i.qty}</span><button aria-label="Increase">+</button></span>`;
    const [minus, plus] = row.querySelectorAll("button");
    minus.onclick = () => update(i.menu_item_id, -1);
    plus.onclick = () => update(i.menu_item_id, 1);
    list.appendChild(row);
  });
  cartEl.appendChild(list);
  cartEl.insertAdjacentHTML("beforeend", `<div class="total"><span>Total</span><span>${money(Cart.total())}</span></div>`);
  if (notice) cartEl.insertAdjacentHTML("beforeend", `<p class="note">${notice}</p>`);
  const clear = document.createElement("button");
  clear.textContent = "Clear cart";
  clear.style.marginTop = "12px";
  clear.onclick = () => { Cart.items = []; notice = ""; Cart.save(); renderCart(); };
  cartEl.appendChild(clear);
}

function update(id, delta) {
  Cart.change(id, delta);
  Cart.save();
  renderCart();
}

// ---------- START ----------
Cart.load();
showRestaurants();
renderCart();
