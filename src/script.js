/* =====================================================================
   QuickBite: boilerplate
   Structure (add features only in section 6, so merges stay clean):
     1. DATA      schema + seed data + query helpers
     2. UTILS     money(), h() DOM helper
     3. STATE     shared state + subscribe
     4. ROUTER    registerView() / navigate()
     5. PANELS    registerPanel() for always-visible widgets (e.g. cart)
     6. FEATURES  one block per feature, each registers a view and/or panel
     7. START     boots the app
   ===================================================================== */
 
// ===== 1. DATA ========================================================
// Schema:
//   restaurants(id PK, name, cuisine, eta_min)
//   menu_items(id PK, restaurant_id FK -> restaurants.id, category, name, description, price_cents, available)
const DB = {
  restaurants: [
    { id: 1, name: "Maple Street Burgers", cuisine: "Burgers", eta_min: 25 },
    { id: 2, name: "Sakura Sushi", cuisine: "Japanese", eta_min: 35 },
    { id: 3, name: "Casa Pizza", cuisine: "Italian", eta_min: 30 },
  ],
  menu_items: [
    { id: 101, restaurant_id: 1, category: "Mains", name: "Classic Burger", description: "Beef patty, cheddar, lettuce, tomato", price_cents: 1099, available: true },
    { id: 102, restaurant_id: 1, category: "Sides", name: "Poutine", description: "Fries, cheese curds, gravy", price_cents: 799, available: true },
    { id: 103, restaurant_id: 1, category: "Drinks", name: "Milkshake", description: "Vanilla, chocolate, or strawberry", price_cents: 599, available: false },
    { id: 201, restaurant_id: 2, category: "Sushi", name: "Salmon Nigiri (2 pc)", description: "Fresh salmon over rice", price_cents: 699, available: true },
    { id: 202, restaurant_id: 2, category: "Sushi", name: "California Roll", description: "Crab, avocado, cucumber", price_cents: 899, available: true },
    { id: 203, restaurant_id: 2, category: "Soups", name: "Miso Soup", description: "Tofu, seaweed, green onion", price_cents: 399, available: true },
    { id: 301, restaurant_id: 3, category: "Pizza", name: "Margherita Pizza", description: "Tomato, mozzarella, basil", price_cents: 1399, available: true },
    { id: 302, restaurant_id: 3, category: "Salads", name: "Caesar Salad", description: "Romaine, parmesan, croutons", price_cents: 899, available: true },
    { id: 303, restaurant_id: 3, category: "Desserts", name: "Tiramisu", description: "Espresso-soaked ladyfingers, mascarpone", price_cents: 749, available: true },
  ],
};
 
const Data = {
  restaurants: () => DB.restaurants,
  restaurant: (id) => DB.restaurants.find((r) => r.id === id),
  menuFor: (restaurantId) => DB.menu_items.filter((m) => m.restaurant_id === restaurantId),
  menuItem: (id) => DB.menu_items.find((m) => m.id === id),
  menuByCategory: (restaurantId) => {
    const groups = {};
    Data.menuFor(restaurantId).forEach((m) => {
      (groups[m.category] = groups[m.category] || []).push(m);
    });
    return groups;   // { "Mains": [...], "Sides": [...] }
  },
};
 
// ===== 2. UTILS =======================================================
const money = (cents) => "$" + (cents / 100).toFixed(2);
 
// Tiny DOM helper: h("div", { class: "row", onclick: fn }, "text", childNode, ...)
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k.startsWith("on")) el[k] = v;
    else if (k === "class") el.className = v;
    else el.setAttribute(k, v);
  }
  children.flat().forEach((c) => {
    if (c == null || c === false) return;
    el.append(c instanceof Node ? c : document.createTextNode(c));
  });
  return el;
}
 
// ===== 3. STATE =======================================================
// Features may add their own keys (e.g. State.set({ cart: [] })).
const State = {
  data: { route: { name: "restaurants", params: {} } },
  listeners: [],
  get: (key) => State.data[key],
  set(patch) {
    Object.assign(State.data, patch);
    State.listeners.forEach((fn) => fn());
  },
  subscribe: (fn) => State.listeners.push(fn),
};
 
// ===== 4. ROUTER ======================================================
const views = {};
const registerView = (name, renderFn) => { views[name] = renderFn; };   // renderFn(params) -> Node
const navigate = (name, params = {}) => State.set({ route: { name, params } });
 
// ===== 5. PANELS ======================================================
const panels = [];
const registerPanel = (renderFn) => { panels.push(renderFn); };         // renderFn() -> Node | null
 
// ===== RENDER (core, rarely needs editing) ============================
function render() {
  const { name, params } = State.get("route");
  const view = views[name];
  const empty = Object.keys(views).length === 0;
  document.getElementById("app").replaceChildren(
    view ? view(params)
      : empty ? h("p", { class: "muted" }, "No features yet. Register a view in section 6 of script.js.")
      : h("p", { class: "note" }, `Unknown view: ${name}`)
  );
  document.getElementById("sidebar").replaceChildren(...panels.map((p) => p()).filter(Boolean));
}
 
// ===== 6. FEATURES ====================================================
// Template for a new feature:
//   registerView("myview", (params) => h("section", {}, ...));
//   registerPanel(() => h("div", { class: "panel" }, ...));
//   navigate("myview", { id: 1 });
 
// -- Feature: restaurant list -----------------------------------------
// Empty-state wording is provisional; final copy is being settled in T-09 (#20).
const EMPTY_RESTAURANTS_MESSAGE = "No restaurants are available right now. Please check back soon.";
 
registerView("restaurants", () => {
  if (Data.restaurants().length === 0) {
    return h("section", {},
      h("h2", {}, "Restaurants"),
      h("p", { class: "empty-state", role: "status" }, EMPTY_RESTAURANTS_MESSAGE)
    );
  }
  return h("section", {},
    h("h2", {}, "Restaurants"),
    h("div", { class: "list" },
      Data.restaurants().map((r) =>
        // Integration fix: clicking a restaurant opens its menu
        h("div", { class: "row", style: "cursor:pointer", onclick: () => navigate("menu", { id: r.id }) },
          h("span", {}, h("strong", {}, r.name), h("small", {}, r.cuisine)),
          h("small", {}, `${r.eta_min} min`)
        )
      )
    )
  );
});
 
// -- Feature: menu ----------------------------------------------------
registerView("menu", ({ id }) => {
  const restaurant = Data.restaurant(Number(id));
  if (!restaurant) {
    return h("div", {},
      h("p", { class: "note" }, "Restaurant not found."),
      h("button", { class: "btn", onclick: () => navigate("restaurants") }, "Back to restaurants"));
  }
 
  const groups = Data.menuByCategory(restaurant.id);
  const categories = Object.keys(groups);
 
  return h("section", {},
    h("button", { class: "btn", onclick: () => navigate("restaurants") }, "← Back to restaurants"),
    h("h2", {}, restaurant.name),
    h("p", { class: "muted" }, `${restaurant.cuisine} · about ${restaurant.eta_min} min`),
    categories.length === 0
      ? h("p", { class: "muted" }, "This restaurant has no menu items yet.")
      : categories.map((cat) =>
          h("div", {},
            h("h3", { class: "menu-category" }, cat),
            h("div", { class: "list" }, groups[cat].map(menuItemRow)))));
});
 
function menuItemRow(item) {
  return h("div", { class: "row menu-item" + (item.available ? "" : " unavailable") },
    h("div", {},
      h("span", { class: "name" }, item.name),
      h("small", {}, item.description),
      item.available ? null : h("span", { class: "badge-unavailable" }, "Unavailable")),
    // Integration fix: price plus an Add button (hidden for unavailable items)
    h("div", {},
      h("span", { class: "price" }, money(item.price_cents)),
      item.available
        ? h("button", { class: "btn primary", style: "margin-left:10px", onclick: () => addToCart(item.id) }, "Add")
        : null));
}
 
 
// -- Feature: cart (PBI-04: Add items to cart) -------------------------
 
// Create an empty cart when the app starts
State.set({ cart: [] });
 
// Function to add a menu item to the cart
function addToCart(itemId) {
  // Find the item from the menu
  const item = Data.menuItem(itemId);
 
  // PBI-11: unavailable items cannot be added (also rejects unknown items)
  if (!item || !item.available) {
    return false;
  }
 
  const cart = State.get("cart");
 
  // Check if the cart already has items from another restaurant
  if (cart.length > 0) {
    const firstItem = Data.menuItem(cart[0].itemId);
 
    if (firstItem.restaurant_id !== item.restaurant_id) {
      if (typeof alert !== "undefined") {
        alert("You can only order from one restaurant at a time.");
      }
      return false;
    }
  }
 
  // Check if the item is already in the cart
  const existingItem = cart.find((c) => c.itemId === itemId);
 
  let updatedCart;
 
  if (existingItem) {
    // Increase quantity when the item is already in the cart
    updatedCart = cart.map((c) =>
      c.itemId === itemId
        ? { ...c, quantity: c.quantity + 1 }
        : c
    );
  } else {
    // Add a new item with quantity 1
    updatedCart = [...cart, { itemId: itemId, quantity: 1 }];
  }
 
  // Save the updated cart
  State.set({ cart: updatedCart });
 
  return true;
}
 
// Remove one item (all of its quantity) from the cart
function removeFromCart(itemId) {
  State.set({ cart: State.get("cart").filter((c) => c.itemId !== itemId) });
}
 
// Empty the whole cart
function clearCart() {
  State.set({ cart: [] });
}
 
// Cart panel: shows items with a Remove button each, plus Clear cart
registerPanel(() => {
  const cart = State.get("cart");
  return h("div", { class: "panel" },
    h("h2", {}, "Your order"),
    cart.length === 0
      ? h("p", { class: "muted" }, "Your cart is empty.")
      : [
          ...cart.map((c) => {
            const it = Data.menuItem(c.itemId);
            return h("div", { class: "row" },
              h("span", {}, `${it.name} × ${c.quantity}`),
              h("span", {},
                money(it.price_cents * c.quantity),
                h("button", { class: "btn", style: "margin-left:10px", onclick: () => removeFromCart(c.itemId) }, "Remove")));
          }),
          h("button", { class: "btn", style: "margin-top:10px", onclick: clearCart }, "Clear cart"),
        ]);
});
 
 
// ===== 7. START =======================================================
if (typeof document !== "undefined") {
  State.subscribe(render);
  render();
}
 
// Lets Node tests import the logic: require("./script.js")
if (typeof module !== "undefined") module.exports = { DB, Data, State, money, addToCart, removeFromCart, clearCart };
