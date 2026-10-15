# Wireframe: Menu page (T-14, issue #25)

Owner: Daniel Tehrani. Covers PBI #2 (view a restaurant's menu) and the Add-to-Cart entry point from PBI #3.

Status against `main` (commit `3729a55`): Evan's PR #47 already implements the menu view this wireframe describes
(restaurant header, back button, category headings, item name/description/price, "Unavailable" badge, empty and
not-found states), so T-16 (#27) is effectively done. What this wireframe adds on top of `main` is the **`Add` button**
(T-21, #32, Mark) and the disabled state for unavailable items. List -> menu navigation is T-17 (#28, Mark).

## Layout

Reached from the restaurant list (list -> menu navigation is T-17, #28). The cart panel sits in the
existing `#sidebar` on the right, so the menu does not need its own cart UI.

```
+----------------------------------------------------------------------------+
| QuickBite  Order from local restaurants                                    |
+----------------------------------------------------------------------------+
|                                                          +----------------+|
|  [< Back to restaurants]                                 |  CART (panel)  ||
|                                                          |  see           ||
|  Maple Street Burgers            <- restaurant name (h2) |  cart-page.md  ||
|  Burgers - about 25 min          <- cuisine + eta (muted)|                ||
|                                                          |                ||
|  MAINS                           <- category heading     |                ||
|  +----------------------------------------------------+  |                ||
|  | Classic Burger                      $10.99  [ Add ] |  |                ||
|  | Beef patty, cheddar, lettuce, tomato                |  |                ||
|  +----------------------------------------------------+  |                ||
|                                                          |                ||
|  SIDES                                                   |                ||
|  +----------------------------------------------------+  |                ||
|  | Poutine                             $7.99   [ Add ] |  |                ||
|  | Fries, cheese curds, gravy                          |  |                ||
|  +----------------------------------------------------+  |                ||
|                                                          |                ||
|  DRINKS                                                  |                ||
|  +----------------------------------------------------+  |                ||
|  | Milkshake  (UNAVAILABLE)            $5.99   [ --- ] |  |  <- greyed    ||
|  | Vanilla, chocolate, or strawberry                   |  |     out, Add  ||
|  +----------------------------------------------------+  |     disabled  ||
|                                                          +----------------+|
+----------------------------------------------------------------------------+
```

## Elements

| Element | Behaviour | Acceptance criterion it satisfies |
|---|---|---|
| Restaurant name (h2) + cuisine/eta line | Always shown at the top of the menu | #2: customers can clearly identify which restaurant the menu belongs to |
| Back button | Returns to the restaurant list | #1: selecting a restaurant leads to its menu (and back) |
| Category heading | Items grouped by category (T-15 supplies the grouping) | Task wording for T-16 |
| Item row: name, description, price | Price formatted with `money()` | #2: each available item shows its name and price |
| `Add` button | Calls the cart's add action (T-20/T-21) | #3: available menu items have an Add to Cart option |
| Unavailable item | Dimmed, "Unavailable" badge, `Add` disabled | #3: only *available* items offer Add; T-16 "unavailable marker" |
| Empty menu | Muted message: "This restaurant has no menu items yet." | Defensive state, mirrors the restaurant-list empty state |
| Unknown restaurant id | Note "Restaurant not found." plus a back button | Defensive state |

## Notes for implementers

- Use the existing design tokens and classes in `src/index.html` (`.row`, `.list`, `.btn`, `.btn.primary`, `.muted`, `.note`). No new colours.
- The `Add` button should be a real `<button>` (keyboard and screen-reader friendly), with `disabled` set for unavailable items rather than only styled.
- Price is right-aligned and does not wrap.

## Open questions for the team

1. Should an unavailable item hide the `Add` button or show it disabled? The wireframe shows it disabled so the layout does not jump; issue #40 ("System prevents unavailable items from being added to the cart") will need the rule enforced in cart logic as well, not just in the UI.
2. The data fields this relies on (`category`, `description`, `available`) are on `main` as of PR #47. Unavailable items currently show a badge but no button at all; the wireframe proposes a disabled `Add` button so the row layout stays stable. Mark (T-21) and Evan can confirm.
