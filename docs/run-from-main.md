# Running QuickBite from `main` (T-08, issue #19)

Purpose: confirm that every team member can run the app from `main`. This supports the acceptance criteria of
issue #39 ("Set up the project and database"). Owner: Daniel Tehrani.

## How to run

There is no build step and no install step. The app is plain HTML, CSS and JavaScript in `src/`.

```bash
git clone https://github.com/yofionayang/comp354_assignment2
cd comp354_assignment2
git checkout main
git pull
```

Then use either option:

1. Open `src/index.html` directly in a browser (double-click it, or `open src/index.html` on macOS), or
2. Serve it locally: `cd src && python3 -m http.server 8000`, then visit <http://localhost:8000>.

Node 18 or newer is only needed if you want to `require("./src/script.js")` from a test; it is not needed to run the app.

## What you should see on `main` today

- Header "QuickBite - Order from local restaurants".
- A "Restaurants" list with 3 rows: Maple Street Burgers (Burgers, 25 min), Sakura Sushi (Japanese, 35 min), Casa Pizza (Italian, 30 min).
- No sidebar (there is no cart panel yet; the layout hides an empty sidebar by design).
- Rows are not clickable yet (list -> menu navigation is T-17), so the menu view that exists in the code (PR #47) cannot be reached by clicking. Cart logic (`addToCart`, PR #46) also exists but has no button or UI yet.
- Browser console shows no errors.

These expectations are for `main` at commit `3729a55`. If `main` has moved on, expect more; the sign-off below only requires that the app loads and shows the 3 restaurants without console errors.

The seed data lives in memory at the top of `src/script.js` (`DB`), so it "loads" every time the page loads.
There is no separate database command.

## Automated check already done

On 2026-10-15 the unmodified `origin/main` (commit `3729a55`) was loaded headlessly in jsdom (Node 22):
0 script errors, 3 restaurant rows rendered, no sidebar content, no buttons in the main view.
(The earlier baseline `233d648` gave the same result for the restaurant list.)

This only shows the code boots. It does not replace each person running it on their own machine, which is what the
acceptance criterion asks for, so please tick your own row below.

## Sign-off (each member edits only their own row, in their own PR or commit)

| Member | GitHub | OS and browser | Ran from `main` (date) | Saw 3 restaurants, no console errors |
|---|---|---|---|---|
| Daniel Tehrani | Danny-Desperado | | | |
| Mark Rudko | mySecondFavouriteHub | | | |
| Yu Par Aung | yofionayang | | | |
| Evan Champagne | Evan-Champagne | | | |

## Gaps against issue #39

- "The application runs locally from the main branch using the README instructions": the README currently contains only the Sprint Goal. This file has the instructions; suggest Mark links to it when he updates the README in T-27 (#38).
- "The database schema and seed data load with one command": the data is an in-memory JS object, so there is no command. The team should decide whether that satisfies the criterion or whether the wording of #39 should be changed.
