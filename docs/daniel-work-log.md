# Work log: Daniel Tehrani (branch `feature/pbi-05`)

Date: 2026-10-15. Baseline: `origin/main` at `3729a55` (after PR #46 cart logic and PR #47 menu were merged).
Work was first built on `233d648` and then rebased onto `3729a55`; the rebase had no conflicts.

Rule applied: only build on what is already on `main`. Nothing here copies or re-implements work that is not merged.

## Status of my assigned issues (assignee `Danny-Desperado`)

| Issue | Task | Status | Why |
|---|---|---|---|
| #23 | T-12 Restaurant list page UI with empty state | **Done** | Builds on Mark's list on `main` |
| #25 | T-14 Wireframe menu page | **Done** | `docs/wireframes/menu-page.md` |
| #34 | T-23 Wireframe cart page | **Done** | `docs/wireframes/cart-page.md` |
| #19 | T-08 Verify all four can run from `main` | **Partly done** | Run guide and headless check done (`docs/run-from-main.md`); the four sign-off rows need each member |
| #27 | T-16 Menu page UI | **Done by Evan** | PR #47 implements the menu view, category grouping, prices and "Unavailable" badge. Suggest closing T-16 or reassigning any leftover polish |
| #36 | T-25 Cart page UI | **Not started, partly unblocked** | `State.cart` and `addToCart` are now on `main` (PR #46). Still missing: decrease/remove and min-quantity-1 rules and line/order totals (T-24, #35, Yu), and the `Add` button (T-21, #32, Mark). The cart wireframe is ready |

Not touched: PBI #5 (select a pickup time) and everything outside Sprint 1's goal. The branch is named `pbi-05` but none of my
sprint tasks belong to that PBI.

## Code changes

`src/script.js`, restaurant-list feature block only:
- Added `EMPTY_RESTAURANTS_MESSAGE` and an early return in the `restaurants` view: if `Data.restaurants()` is empty, the view shows the "Restaurants" heading plus a `<p class="empty-state" role="status">` message instead of an empty list.
- The wording is **provisional**. T-09 (#20, Yu) is meant to settle empty-list wording; changing the constant is a one-line edit.
- Behaviour with data is unchanged: same rows, same markup, same classes.
- Mark's `TODO (menu feature): make clickable` comment is intentionally left in place for T-17 (#28).

`src/index.html`:
- Added one `.empty-state` rule under `/* -- restaurant list -- */`.

No changes to the data layer, State, router, menu code, cart code, the exports line, or the README.

## Merge notes for others

- **Mark (T-17, list -> menu navigation):** the row element line (`h("div", { class: "row" }, ...`) is untouched. My edits are the lines above and below the row markup (the view now has a block body: `registerView("restaurants", () => { ... });`).
- **Mark (T-21, Add button):** the menu wireframe proposes a disabled `Add` button for unavailable items; see `docs/wireframes/menu-page.md`.
- **Yu (T-24, T-09):** please confirm the empty-list message wording (T-09), and note the cart wireframe's open question about replacing the one-restaurant `alert()` with an inline message.

## How it was verified

Headless run in jsdom (Node 22) against the real `src/index.html` and `src/script.js` after the rebase; 16 checks, all passing:
boots with no script errors; 3 seeded restaurants render with names; no empty state when data exists; with the restaurant
list emptied, the message shows with `role="status"`, no rows render, heading stays, no errors; `require("./src/script.js")`
still exports `DB`, `Data`, `State`, `money`; the merged menu view renders 3 items with the unavailable badge for restaurant 1;
`addToCart` adds with quantity 1 and increments.
Unmodified `origin/main` (`3729a55`) was also loaded headlessly: 0 errors, 3 restaurant rows, no sidebar content.
The check script is a throwaway and is not committed; Evan's testing tasks (T-13/T-18/T-22/T-26) own the real test suite.
Not checked: visual appearance in a real browser, and dark mode. Worth a quick look when someone runs the app.

## Housekeeping I noticed (not changed)

- #21 (T-10, wireframe home/restaurant list) is assigned to `mySecondFavouriteHub` but its body says Owner: Daniel Tehrani. I left it alone and did not do it. Same kind of mismatch on #31 (T-20: assignee Mark, owner Yu) and #37 (T-26: assignee Mark, owner Evan). Worth one pass to align assignee and owner.
- Issues #11 and #12 are both "T-01" (duplicate); #11 has no assignee.
