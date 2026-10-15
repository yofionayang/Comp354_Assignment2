# Wireframe: Cart (T-23, issue #34)

Owner: Daniel Tehrani. Covers PBI #4 (view and update the cart) and the display side of PBI #3.
Implementation task that builds on this: T-25 (#36). It depends on the cart state and logic from T-19 / T-20 / T-21 / T-24.

## Where it lives

The app boilerplate renders always-visible widgets in `#sidebar` via `registerPanel()`, and the README sprint goal
says customers "build and adjust a cart". This wireframe therefore draws the cart as a **sidebar panel** that is
visible next to the menu, rather than a separate full page. If the team prefers a dedicated cart view, the same
content works inside `registerView("cart", ...)`; only the container changes.

## Layout: cart with items

```
+------------------------------------+
|  Your cart                         |   <- h2
|  Maple Street Burgers              |   <- restaurant (one-restaurant rule)
|  ----------------------------------|
|  Classic Burger                    |
|  $10.99 each                       |
|  [ - ]  2  [ + ]        $21.98  [x]|   <- qty stepper, line total, remove
|  ----------------------------------|
|  Poutine                           |
|  $7.99 each                        |
|  [ - ]  1  [ + ]         $7.99  [x]|
|  ----------------------------------|
|  Total                      $29.97 |   <- bold
|                                    |
|  [ Continue ]   (disabled: needs   |
|                  PBI-05/06, later) |
+------------------------------------+
```

## Layout: empty cart

```
+------------------------------------+
|  Your cart                         |
|                                    |
|   Your cart is empty.              |   <- muted, role="status"
|   Add something from the menu.     |
+------------------------------------+
```

## Elements and behaviour

| Element | Behaviour | Acceptance criterion it satisfies |
|---|---|---|
| Item name, unit price, quantity, line total | Shown for every cart line | #4: cart displays selected items, quantities, and prices |
| `[ + ]` | Increases quantity by 1 | #4: customers can increase quantities |
| `[ - ]` | Decreases quantity by 1; at quantity 1 the button is disabled (minimum is 1, see T-24) and removal is done with `[x]` | #4: customers can decrease quantities; T-24 "quantity rules (min 1)" |
| `[x]` remove | Removes the line from the cart | T-25 "remove item" |
| Total | Recomputed on every change, formatted with `money()` | #4: total price updates correctly when quantities change |
| Restaurant name under the heading | Shows which restaurant the cart belongs to | T-19 one-restaurant rule: makes the rule visible to the customer |
| Empty cart message | Shown when the cart has no lines | Defensive state |
| `Continue` button | Disabled placeholder only; checkout and pickup time belong to PBI #5 and #6, which are not in this sprint | Out of scope, listed so nobody builds it early |

## Notes for implementers

- Reuse `.panel`, `.row`, `.btn`, `.muted` from `src/index.html`; the cart panel is a `.panel` inside `#sidebar`.
- All money values go through `money()`; the cart stores `{ itemId, quantity }`, so unit price and name come from `Data.menuItem(itemId)` at render time. Do not copy prices into the cart.
- The quantity buttons need accessible names, e.g. `aria-label="Increase quantity of Classic Burger"`.
- When the cart panel is empty and the layout shows only the main column, note that `.layout:has(#sidebar:empty)` hides the sidebar entirely. The cart panel should always return a node (empty-state panel), never `null`, if the team wants the sidebar to stay visible.

## Open questions for the team

1. Panel or separate view (see "Where it lives")? Default in this wireframe: panel.
2. What happens when a customer taps `Add` on an item from a second restaurant? The current cart logic on `feature/pbi-04` shows a browser `alert()`. An inline `.note` message in the cart panel would be more consistent with the rest of the UI. Needs a decision from Yu (T-19 owner).
