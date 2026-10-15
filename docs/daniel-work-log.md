# Work log: Daniel Tehrani (branch `feature/pbi-05`)

Date: 2026-10-15. Baseline: `origin/main` at `233d648` ("create and add list of restaurants to browse").
This branch was fast-forwarded to that commit before any work, so the only code it builds on is what is merged to `main`.

Rule applied: only build on what is already on `main`. Work that exists only on other people's unmerged
branches (`feature/pbi-03-restaurant-menu`, `feature/pbi-04`) was not copied, re-implemented, or depended on.

## Status of my assigned issues (assignee `Danny-Desperado`)

| Issue | Task | Status | Why |
|---|---|---|---|
| #23 | T-12 Restaurant list page UI with empty state | **Done** | Builds directly on Mark's list on `main` |
| #25 | T-14 Wireframe menu page | **Done** | `docs/wireframes/menu-page.md` |
| #34 | T-23 Wireframe cart page | **Done** | `docs/wireframes/cart-page.md` |
| #19 | T-08 Verify all four can run from `main` | **Partly done** | Run guide and headless check done (`docs/run-from-main.md`); the four sign-off rows need each member |
| #27 | T-16 Menu page UI | **Not started: already on Evan's branch** | Evan implemented the menu view, CSS and data fields on `feature/pbi-03-restaurant-menu` (unmerged). Doing it again here would duplicate and conflict. Suggest we reassign or close T-16 once his PR merges, or I review/polish after the merge |
| #36 | T-25 Cart page UI | **Blocked** | Needs cart state and logic (T-19/T-20/T-21/T-24), which exist only as an unmerged first pass on `feature/pbi-04`. Wireframe (T-23) is ready so this can start right after that merges |

Not touched: PBI #5 (select a pickup time) and everything else outside Sprint 1's goal (browse, menu, cart). The
branch is named `pbi-05` but none of my sprint tasks belong to that PBI.

## Code changes

`src/script.js`, restaurant-list feature block only:
- Added `EMPTY_RESTAURANTS_MESSAGE` and an early return in the `restaurants` view: if `Data.restaurants()` is empty, the view shows the "Restaurants" heading plus a `<p class="empty-state" role="status">` message instead of an empty list.
- The wording is **provisional**. T-09 (#20, Yu) is meant to settle empty-list wording; changing the constant is a one-line edit.
- Behaviour with data is unchanged: same rows, same markup, same classes.
- Mark's `TODO (menu feature): make clickable` comment is intentionally left in place for T-17 (#28).

`src/index.html`:
- Added one `.empty-state` rule under `/* -- restaurant list -- */`.

No changes to the data layer, State, router, exports line, README, or any cart/menu code.

## Merge notes for others

- **Mark (T-17, list -> menu navigation):** the row element line (`h("div", { class: "row" }, ...`) is untouched. My edits are the lines above and below the row markup (the view now has a block body: `registerView("restaurants", () => { ... });`). Expect a trivial textual merge if you edit the row line; the closing `);` became `);` + `});`.
- **Evan / Yu:** nothing here touches `Data`, `DB`, `State` or the `module.exports` line, so your branches should not conflict with this one on those lines. Both of your branches edit `script.js` and `index.html` near the menu/cart blocks; mine only edits the restaurant-list blocks.
- **Yu (T-09):** please confirm or replace the empty-list message wording.

## How it was verified

Headless run in jsdom (Node 22) against the real `src/index.html` and `src/script.js`; 10 checks, all passing:
boots with no script errors; 3 seeded restaurants render with names; no empty state when data exists; with the
restaurant list emptied, the message shows with `role="status"`, no rows render, heading stays, no errors; and
`require("./src/script.js")` still exports `DB`, `Data`, `State`, `money`.
The check script is a throwaway and is not committed; Evan's testing tasks (T-13/T-18/T-22/T-26) own the real test suite.
Not checked: visual appearance in a real browser, and dark mode. Worth a quick look when someone runs the app.

## Housekeeping I noticed (not changed)

- #21 (T-10, wireframe home/restaurant list) is assigned to `mySecondFavouriteHub` but its body says Owner: Daniel Tehrani. I left it alone and did not do it. Same kind of mismatch on #31 (T-20: assignee Mark, owner Yu) and #37 (T-26: assignee Mark, owner Evan). Worth one pass to align assignee and owner.
- Issues #11 and #12 are both "T-01" (duplicate); #11 has no assignee.
