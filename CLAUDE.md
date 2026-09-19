# Portfolio site — CLAUDE.md

Personal portfolio for Vivek Suryavanshi (Senior GenAI Engineer / Agentic AI Architect), deployed via GitHub Pages at `vivek-suryavanshi.github.io`.

## Stack — keep it this way

Plain HTML/CSS/JS. No frameworks, no build step, no npm dependencies. The only external resource is the Google Fonts CDN link in `index.html`. This is a stated selling point of the site itself (see the footer credit line) — do not introduce a framework, bundler, or JS library without the user explicitly asking for one.

Three files: `index.html`, `style.css`, `script.js`. Badge images live in `assets/badges/`.

## Dev server

Run via `.claude/launch.json`, config name `"portfolio"`: `python3 -m http.server 8090 --directory portfolio`.

**Known gotcha:** the browser preview tab aggressively caches CSS/JS/images by URL. After editing `style.css`, `script.js`, or any file under `assets/`, a plain reload often serves stale content. Verify with a temporary cache-busting query param (`style.css?v=debug1`, `script.js?v=debug1`, or per-image `?v=debug1` for images specifically — image caching is separate from CSS/JS caching and needs its own bust), confirm the fix, then **always strip the `?v=` param back out before considering the change done.** Never leave a cache-buster in committed code.

When verifying: prefer cheap `getComputedStyle(...)` / `naturalWidth` / class-list checks over screenshots for simple property changes. Reach for an actual screenshot only for genuine visual/layout confirmation, and plan the resize/zoom/scroll before the first screenshot rather than iterating toward a usable framing.

## Git workflow — this is how the user works, keep following it

- **Every change gets its own branch**, created off `main`. Never edit directly on `main`.
- The user reviews changes locally (via the dev server) before anything is finalized.
- When the user says "merge," that means: commit the branch, `git checkout main`, `git merge <branch>` — locally only.
- **Claude never pushes to GitHub, never touches GitHub Pages settings, never runs `git push`.** The user always pushes from their own terminal. If asked to "push," give the command; don't run it.
- Commit messages should explain *why*, not just *what* — this repo's history is written that way (see `git log`).
- `backup-light-theme` is a permanent snapshot branch of the site's pre-dark-mode state, pushed to GitHub. Don't delete it.

## Design system

Single source of truth: the `:root` custom properties in `style.css`. Dark theme, amber-driven:

- `--bg` / `--surface` / `--ink` / `--ink-soft` / `--ink-faint` — base dark palette, cream text.
- `--accent` / `--amber` (same value, `#f5a623`) — the *only* accent color used for emphasis across the whole site (headings, buttons, nav underline, section tags). Several older variable names (`--highlight`, `--pop`, `--accent-2`) are historical aliases that all resolve to the same amber — don't reintroduce a second competing accent hue.
- `--think` (`#7aa8ff`, blue) / `--act` (`#f5a623`, amber) / `--verify` (`#6bd48a`, green) — reserved specifically for the hero code panel's think/act/verify phase coloring. Don't reuse these three colors elsewhere (e.g. a status dot elsewhere on the page) — they carry specific meaning in that one component.

**Heading convention:** every section heading has exactly one word wrapped in `<span class="highlight">`, rendered in plain amber text with no background/box (`.highlight { color: var(--amber); }` — deliberately no gradient-underline fill, that was tried and removed). Keep new headings consistent with this: one emphasized word, plain color, no box.

**Badges** (`assets/badges/`): must be genuine transparent PNGs (real alpha channel, not a flattened white background) — flattened ones need a `.cert-badge` white-plate CSS workaround that was deliberately removed once all 9 badges got real transparent exports. If a new certification badge is added and only a non-transparent version is available, ask the user for a proper transparent export (Credly, vendor site) rather than reintroducing the white-plate hack. New badge images should be auto-cropped to their content bounding box (see git history for the PIL script) so they render at a consistent visual size against badges from other vendors — sources vary wildly in how much transparent padding they ship with.

## Content accuracy

Hero stats, the Experience section headline, and the About paragraph all restate figures from the resume (14+ years, 4+ years in agentic AI, etc.) — keep these in sync if the underlying facts change, and avoid restating the same number a third time in a new section without checking it's not already covered elsewhere on the page.

## Sun intro animation (`script.js`)

Plays on **every page load**, including a plain refresh — not gated by `sessionStorage` (that was tried first and rejected: `sessionStorage` persists across refreshes in the same tab, so it only ever played once, which wasn't the intent). Gated purely by a `localStorage` counter (`vsIntroVisitCount`), capped at 3 total plays per browser, then stops permanently. The inline guard script in `<head>` (which prevents a hero flash before the intro decides whether to play) must stay in sync with this same counter logic if the play-limit logic ever changes.

## Working style notes

- The user gives rapid, small, iterative feedback (e.g. "make it bigger," "no, less") — expect many small follow-up requests per feature rather than one large spec up front.
- Prototype risky/structural changes (new animations, layout directions) in a sandbox (e.g. the visualize/mockup tool) before touching real site files — this was underused earlier in the project's history and is the better default for anything non-trivial.
- Give honest, direct design opinions when asked "does this look better" or "what's your honest opinion" — the user explicitly wants critique, not just agreement.
