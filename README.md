# 🎯 Darts Practice

Responsive darts practice web app — plain HTML/CSS/JavaScript, no backend, no framework.

## Running locally

No installation needed: double-click `index.html` and it opens in any browser.
(If you later want a server, any static file server works, e.g. `npx serve` or `python -m http.server`.)

## Files

| File | Purpose |
|------|---------|
| `index.html` | All screens (main menu + 3 game modes) and the settings modal |
| `css/style.css` | Mobile-first design: sandy background, white bubble cards, big buttons |
| `js/main.js` | Navigation between the main menu and the games, back buttons |
| `js/random-target.js` | Random Target game: random targets, configurable hit counts |
| `js/around-board.js` | Around the Board: classic board order, closing with D25 |
| `js/calculate.js` | Calculate quiz: 4-option questions, score, feedback |
| `js/questions.js` | 77 darts mental-math questions (subtraction, checkouts, doubles, rounding, endgame) |

## Game modes

- **Random Target** — random simple (1–20, 25), double (D1–D20, D25/Bull) and triple (T17–T20 only!) targets; after the configured number of hits a new target is drawn automatically.
- **Around the Board** — the classic board order (20, 1, 18, 4, ...); per number: simple (3 checks needed) → double (1 check) → triple (17–20 only, 3 hits), closing with D25.
- **Calculate** — quiz in random order with instant green/red feedback and a running score.

## Ideas for extending

- New questions: just add items to the array in `js/questions.js` (`q`, `correct`, `wrong`).
- Save stats/history to `localStorage` (e.g. hit rate, best round).
- Difficulty levels for Around the Board (e.g. 5 checks needed on simple).
- Sound or vibration feedback on hits (`navigator.vibrate`).
- New game mode: the navigation in `main.js` and the screen structure are easy to extend with a new `<section class="screen">` plus its own JS module.
