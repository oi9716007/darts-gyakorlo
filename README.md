# 🎯 Darts Practice

Responsive darts practice web app — plain HTML/CSS/JavaScript, no backend, no framework.

## Running locally

No installation needed: double-click `index.html` and it opens in any browser.
(If you later want a server, any static file server works, e.g. `npx serve` or `python -m http.server`.)

## Files

| File | Purpose |
|------|---------|
| `index.html` | All screens (main menu + 4 game modes), settings modals, language flags |
| `css/style.css` | Mobile-first design: sandy background, white bubble cards, big buttons |
| `js/i18n.js` | All UI strings and quiz sentences in 9 languages (EN, HU, DE, NL, ES, PL, SK, RO, SR) |
| `js/main.js` | Navigation, back buttons, language switching |
| `js/lock.js` | Access-code gate shown before the menu |
| `js/random-target.js` | Random Target game: random targets, configurable hit counts |
| `js/around-board.js` | Around the Board: classic board order, closing with D25 |
| `js/calculate.js` | Calculate quiz: 4-option questions, score, feedback |
| `js/questions.js` | 77 darts mental-math questions built from language-independent data |
| `js/battle.js` | War Against the Board: race to N points against the board, with match stats |

## Game modes

- **Random Target** — random simple (1–20), double (D1–D20), triple (T17–T20 only!) and D25 targets, each with its own configurable hit count; after a triple, the next 5 targets are never triples.
- **Around the Board** — the classic board order (20, 1, 18, 4, ...); per number: simple (3 checks needed) → double (1 check) → triple (17–20 only, 3 hits), closing with D25.
- **Calculate** — quiz in random order with instant green/red feedback and a running score.
- **War Against the Board** — set a 3-dart score to beat and the points needed to win; each round enter your score and tap whoever earned the point (you or the board). The end screen shows average, highest score, T20s, T19s and 180s.

## Ideas for extending

- New questions: add numeric data to `js/questions.js` and, if needed, new sentence templates to `js/i18n.js`.
- Save stats/history to `localStorage` (e.g. hit rate, best round).
- Difficulty levels for Around the Board (e.g. 5 checks needed on simple).
- Sound or vibration feedback on hits (`navigator.vibrate`).
- New game mode: the navigation in `main.js` and the screen structure are easy to extend with a new `<section class="screen">` plus its own JS module.
