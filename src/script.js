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
//   menu_items(id PK, restaurant_id FK -> restaurants.id, name, price_cents)
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

const Data = {
  restaurants: () => DB.restaurants,
  restaurant: (id) => DB.restaurants.find((r) => r.id === id),
  menuFor: (restaurantId) => DB.menu_items.filter((m) => m.restaurant_id === restaurantId),
  menuItem: (id) => DB.menu_items.find((m) => m.id === id),
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
registerView("restaurants", () =>
  h("section", {},
    h("h2", {}, "Restaurants"),
    h("div", { class: "list" },
      Data.restaurants().map((r) =>
        h("div", { class: "row" },   // TODO (menu feature): make clickable -> navigate("menu", { id: r.id })
          h("span", {}, h("strong", {}, r.name), h("small", {}, r.cuisine)),
          h("small", {}, `${r.eta_min} min`)
        )
      )
    )
  )
);

// -- Feature: menu (not built yet) ------------------------------------
// registerView("menu", ({ id }) => ...);

// -- Feature: cart (not built yet) ------------------------------------
// State.set({ cart: [] });
// registerPanel(() => ...);

// ===== 7. START =======================================================
if (typeof document !== "undefined") {
  State.subscribe(render);
  render();
}

// Lets Node tests import the logic: require("./script.js")
if (typeof module !== "undefined") module.exports = { DB, Data, State, money };
