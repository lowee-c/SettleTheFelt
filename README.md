# Settle the Felt - Poker Settlement Calculator

A small, no-backend web app that settles a home poker game: track buy-ins and
rebuys, enter cash-outs, and get back the **minimum number of payments**
needed to even the table.

Everything runs client-side. There's no server, no database, and no account —
game data is kept in your browser's Local Storage so it survives a refresh,
and never leaves your device.

## Features

- Add/remove any number of players, edit names, buy-ins, and rebuys at any time
- Each player gets a distinct, consistent chip-badge color, generated
  deterministically from their player ID so it stays the same across screens
- Enter each player's final cash-out with quick-add buttons (+5¢, +10¢, +50¢,
  +$1) alongside manual entry, and get instant validation
- Catches the classic "the math doesn't add up" mistake before you settle up:
  total cash-outs are checked against total buy-ins, with the exact
  discrepancy shown
- Computes the minimum number of transfers to settle the table (a greedy
  largest-balance match, the standard approach to this "minimum cash flow"
  problem)
- Copy the results as text, export to CSV, or print a clean summary
- Auto-saves the current game to Local Storage and restores it on reload,
  with a confirmation dialog before clearing
- Felt/Day theme toggle (grouped with "New Game" in the top-right corner),
  fully responsive, keyboard-accessible

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Vite](https://vite.dev/) for tooling and bundling
- [Tailwind CSS](https://tailwindcss.com/) for styling
- No routing library, no state library, no backend — just React state
  persisted to `localStorage`

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm (bundled with Node)

### Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

This starts Vite's dev server (by default at `http://localhost:5173`) with
hot module reloading. Open that URL in your browser to see the app live —
edits to files in `src/` update instantly without a manual refresh.

### Build for production

```bash
npm run build
```

This runs a type check (`tsc -b`) and then bundles the app into `dist/`.
You can preview the production build locally with:

```bash
npm run preview
```

This is the closest local equivalent to what GitHub Pages will actually
serve, so it's worth checking before pushing.

## Deploying to GitHub Pages

This project is preconfigured for GitHub Pages and needs no changes to ship:

- `vite.config.ts` sets `base: './'`, so the built app references its own
  assets with **relative paths**. That works out of the box for a GitHub
  Pages *project* site (`https://<user>.github.io/<repo>/`), a GitHub Pages
  *user/org* site, or any sub-path — no repository name to hard-code, no
  broken assets.
- `.github/workflows/deploy.yml` builds the app and deploys `dist/` to
  GitHub Pages automatically on every push to `main`, using GitHub's official
  `actions/upload-pages-artifact` and `actions/deploy-pages` actions.

### One-time setup on GitHub

1. Push this repository to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push (or re-run) the workflow on `main`. Once it finishes, your site will
   be live at the URL shown on the Pages settings screen (and in the
   workflow's deployment summary). First run usually takes 1–2 minutes.

No further configuration is required — every subsequent push to `main`
re-builds and re-deploys automatically via the **Actions** tab.

### Deploying manually (optional)

If you'd rather not use the included Actions workflow, you can build locally
and push the `dist/` folder to a `gh-pages` branch with any tool of your
choice (e.g. the `gh-pages` npm package), or upload `dist/` to any other
static host — the relative `base` path means it isn't locked to GitHub Pages.

## Any-image assets (logo, favicon)

If you swap in a custom logo or favicon:

- Put image files in `public/` (e.g. `public/logo.png`, `public/favicon.svg`)
  — anything in `public/` is copied to the build output as-is.
- Reference them with Vite's base URL instead of a hardcoded leading slash,
  so the path still resolves correctly once deployed to a GitHub Pages
  sub-path:
  ```tsx
  <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Settle the Felt" />
  ```
  A hardcoded `src="/logo.png"` will 404 on a project Pages site, since it
  looks for the file at the domain root rather than under `/<repo>/`.
- Browsers cache favicons aggressively — after replacing `favicon.svg`, do a
  hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`) or reopen the tab if the old
  icon still shows.

## Project structure

```
public/
  favicon.svg       Tab icon
src/
  components/       UI building blocks (screens, table, transfer list, chip badge, header…)
  hooks/            useLocalStorage, useTheme
  utils/            currency formatting, settlement algorithm, CSV/text export,
                     id generation, per-player badge colors
  types.ts          shared TypeScript types
  App.tsx           screen state, player state, wiring
  main.tsx          React entry point
  index.css         theme tokens (CSS variables) + Tailwind
.github/workflows/deploy.yml   GitHub Pages CI/CD
```

## How the settlement works

1. Each player's **total buy-in** is their initial buy-in plus every rebuy.
2. Each player's **net result** is `cash-out − total buy-in`.
3. Before settling, the app checks that total cash-outs equal total buy-ins.
   If they don't, it shows the exact difference and blocks settlement until
   it's fixed (someone's cash-out count is off).
4. Players with a positive net are sorted as creditors, players with a
   negative net as debtors, both largest-first. The app repeatedly matches
   the biggest debtor to the biggest creditor for the largest amount both
   can cover, which produces a minimal (or near-minimal) set of transfers —
   at most `players − 1` payments, often fewer.

All money is converted to integer cents internally before this math runs, to
avoid floating-point rounding errors. This is also why the quick-add buttons
on the cash-out screen (+5¢, +10¢, +50¢, +$1) work off cents rather than
decimal dollars — repeated clicks land on exact amounts instead of drifting.

## Credits

Developed by **lowee-c**.

## License

MIT — do whatever you'd like with it.