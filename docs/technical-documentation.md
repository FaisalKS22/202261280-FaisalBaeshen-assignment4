# Technical Documentation

This document explains the architecture, data flow, and design decisions behind the portfolio. The goal is that another developer can pick the project up cold and understand both **what** the code does and **why** it does it that way.

---

## 1. Overview

The portfolio is a **client-side single-page application** built with React 19 and bundled by Vite 8. There is no backend — everything that looks dynamic (GitHub repos, fun facts) is fetched directly from public APIs in the user's browser, and everything that persists between sessions (theme, visitor name) lives in `localStorage`.

```
┌─────────────────────┐
│   Browser tab       │
│                     │
│  ┌───────────────┐  │
│  │  React app    │  │
│  │  (Vite build) │  │  ──── HTTPS ───▶  api.github.com
│  │               │  │  ──── HTTPS ───▶  uselessfacts.jsph.pl
│  │               │  │
│  │  localStorage │  │
│  │   theme       │  │
│  │   visitor     │  │
│  └───────────────┘  │
└─────────────────────┘
```

---

## 2. Tech Stack — Why Each Choice

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **React 19** | Hooks-only, no class components needed except `ErrorBoundary` (because that API requires a class). Strict mode catches double-effect issues during development. |
| Build tool | **Vite 8** | Sub-second cold starts, native ES modules in dev, Rollup-based production build with tree-shaking and asset hashing. |
| Styling | **Plain CSS + custom properties** | No Tailwind / styled-components. Smaller bundle, full control, and CSS variables make the theme system trivial. |
| State | **React hooks only** | The app's state is small enough that Redux / Zustand would be over-engineering. Theme + visitor name are lifted to `App.jsx`; everything else is local to its component. |
| Persistence | **`localStorage`** | Theme + visitor name. No PII, no consent banner needed. |
| Routing | **None** | Single page with hash anchors. Routing would add complexity without benefit. |
| Linting | **ESLint flat config** with the React Hooks plugin | Catches missing dependency arrays and the most common hook misuse. |

---

## 3. Project Structure

```
src/
├── main.jsx                    React entry point — mounts <App /> in StrictMode
├── App.jsx                     Composition root, owns theme + visitor state
├── index.css                   All styles (responsive + print + reduced-motion)
├── assets/                     Static images
└── components/
    ├── ErrorBoundary.jsx       Class component — catches render errors, shows fallback
    ├── ReadingProgress.jsx     rAF-throttled top-of-page scroll bar
    ├── Navbar.jsx              Sticky nav, IntersectionObserver scroll-spy, mobile menu, ⌘K trigger
    ├── Hero.jsx                Greeting (time-of-day), cycling tagline, visitor timer
    ├── Projects.jsx            Search + tag + level + sort, all combined in useMemo
    ├── GitHubRepos.jsx         GitHub REST API + aggregated stats
    ├── Skills.jsx              Skill-badge grid with stagger animation
    ├── FunFact.jsx             Useless Facts API with refresh
    ├── Contact.jsx             Validated form + toast notifications
    ├── Footer.jsx              Footer with social links
    ├── ScrollToTop.jsx         Floating button, appears after 400 px scroll
    ├── CommandPalette.jsx      ⌘K / Ctrl+K modal command launcher
    ├── ChatAssistant.jsx       Floating chat bot with rule-based replies
    └── KonamiEgg.jsx           Hidden ↑↑↓↓←→←→ B A easter egg
```

---

## 4. Data Flow

### 4.1 Theme

```
[ App.jsx getInitialTheme() ]
        │
        ├── 1. Read localStorage 'portfolio-theme'
        ├── 2. Else read prefers-color-scheme
        └── 3. Else default 'dark'
                  │
                  ▼
         [ useState theme ]
                  │
   ┌──────────────┼──────────────┐
   ▼              ▼              ▼
data-theme    Persist to     Update
attribute     localStorage   <meta theme-color>
   │
   ▼
CSS variables in :root[data-theme=...] re-bind
   │
   ▼
Every component re-paints with new tokens
```

The toggle handler is wrapped in `useCallback` so it can be passed to `Navbar` and `CommandPalette` without forcing them to re-render every time `App` does.

### 4.2 GitHub Repos

```
useEffect (mount)
     │
     ▼
fetch /users/Faisal-M2/repos
     │           │           │
   resolve     reject      timeout (browser-controlled)
     │           │
     ▼           ▼
sort + setRepos  setError(true)
     │
     ▼
useMemo aggregates stats { totalRepos, totalStars, totalForks, topLang }
     │
     ▼
Render: stats strip + repo grid (or loading / error / empty state)
```

### 4.3 Project Explorer

Four pieces of state — `searchQuery`, `activeFilter`, `levelFilter`, `sortBy` — feed a single `useMemo` that returns the visible list. The dependency array is `[activeFilter, searchQuery, sortBy, levelFilter]`, so the filter+sort pipeline only runs when one of those four actually changes; pure scrolling or hover does not retrigger it.

### 4.4 Contact Form

State: `formData`, `errors`, `toast`. Submit handler validates locally (no network call), updates `errors`, and shows a toast for 4 s via `setTimeout`. The toast lives in the same form so it can be styled inside the grid.

> **Why no backend?** Email-sending requires either (a) a hosted backend or (b) a third-party service like EmailJS / Formspree. Neither was in scope for the assignment. The form demonstrates client-side validation, which is what the rubric asks for.

---

## 5. Innovative Features — How They Work

### 5.1 Command Palette (`CommandPalette.jsx`)

A modal `<dialog>`-pattern component that listens for `Ctrl+K` / `⌘K` at the window level via a `useEffect` keydown handler. Commands are an array of `{ id, group, label, hint, icon, run }` objects; `run` is a closure that does the work (scroll to a section, toggle theme, copy email, open external URL, print).

Filtering is a substring match on `label + hint + group`. Arrow keys move `activeIndex`; Enter calls `runCommand(filtered[activeIndex])`; Escape closes. The active item is scrolled into view via `scrollIntoView({ block: 'nearest' })` so long lists stay usable.

Why it matters: it makes the entire site keyboard-navigable without depending on browser scroll behaviour.

### 5.2 Chat Assistant (`ChatAssistant.jsx`)

A floating action button that opens a chat window. Replies come from a local `KNOWLEDGE` array — each entry has a list of `keys` (substrings to match), an `answer`, and an optional `action: { label, target }`. The matcher counts how many keys appear in the user's message and returns the highest-scoring entry, falling back to a friendly default.

A 450–800 ms randomised delay before the bot reply, plus a typing indicator (three CSS-animated dots), makes it _feel_ conversational without any actual LLM call. **No data leaves the browser.**

The optional `action` button on a reply scrolls the page to a specific section — turning the bot into a contextual mini-navigator.

### 5.3 Print-as-PDF Résumé (`@media print` rules in `index.css`)

A dedicated `@media print` block:
- Resets the colour palette to high-contrast black on white.
- Hides every interactive widget (navbar, FABs, command palette, chat, fun-fact, contact, footer, etc.).
- Reflows hero into a single column with the avatar floated right.
- Expands link URLs inline using `a[href^="http"]::after { content: " (" attr(href) ")"; }` so the printed page is self-contained.

The "Print / PDF" button in the hero (and the same command in the palette) just calls `window.print()`. Modern browsers offer "Save as PDF" in the print dialog.

### 5.4 Reading Progress (`ReadingProgress.jsx`)

A 3 px coloured bar at the very top of the viewport. The scroll listener is throttled with `requestAnimationFrame` so it updates at most once per frame, regardless of how fast the user scrolls.

### 5.5 Konami Egg (`KonamiEgg.jsx`)

Maintains a rolling buffer of the last 10 keypresses; when it matches `↑↑↓↓←→←→ B A`, it shows a centred card and 32 confetti pieces falling from the top. Self-clears after 5 s.

---

## 6. Performance

| Technique | Where | Effect |
|-----------|-------|--------|
| `useMemo` | Project filter pipeline + GitHub stats aggregation | Avoids recomputing on unrelated re-renders |
| `useCallback` | Theme toggle, visitor-name handler, chat send | Stabilises function identity for child components and effect deps |
| `IntersectionObserver` | Scroll-spy (Navbar) + fade-ins (Projects, Skills, FunFact, GitHubRepos) | No `scroll` event handler needed — observer runs off the main thread |
| `requestAnimationFrame` | Reading progress bar | Caps update rate to display refresh |
| `loading="lazy"` + `decoding="async"` | Project images | Defers off-screen decode and download |
| Vite production build | `npm run build` | Tree-shaking, code-splitting, minification, content-hashed filenames |

**Production bundle:** ~237 kB JS / ~72 kB gzipped, ~34 kB CSS / ~7 kB gzipped.

---

## 7. Accessibility

- **Landmarks:** `<header>` (hero), `<nav>`, `<main>`, `<section>` per page area, `<footer>`.
- **Skip link** at the top of the body (visible only on focus) jumps straight to `#about`.
- **Focus rings** on every interactive element via `:focus-visible`.
- **ARIA:** `aria-label` on every icon-only button, `aria-expanded` on the mobile menu, `aria-modal="true"` on the command palette, `role="alert" aria-live="polite"` on toasts, `role="progressbar"` with `aria-valuenow` on the reading bar.
- **Reduced motion:** the `@media (prefers-reduced-motion: reduce)` block disables all animations and transitions, sets fade-ins to fully visible, and removes the konami confetti.
- **Semantic HTML form:** every input has a `<label>`, error messages are linked via `aria-live`, the submit button is a real `<button type="submit">`.

---

## 8. Error Handling

| Layer | Strategy |
|-------|----------|
| Render-time errors | `<ErrorBoundary>` wraps the entire app, shows a friendly card + the error toString + a reload button. |
| Network errors (GitHub, Useless Facts) | Try/catch in `useEffect`; UI flips to an error state with an icon, message, and retry button. |
| Form errors | Per-field error message + red border + shake animation + accessible toast. |
| Bad localStorage values | `getInitialTheme()` validates against a whitelist (`'dark' | 'light'`) before using the value. |
| JS disabled | `<noscript>` block in `index.html` shows a polite "please enable JavaScript" message. |

---

## 9. Browser & Device Support

Tested in:
- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)

Responsive breakpoints:
- **≤ 1024 px** — tablet adjustments (smaller hero image, tighter spacing).
- **≤ 768 px** — mobile (hamburger menu, hero stacks vertically, single-column grids, hides desktop-only widgets).
- **≤ 480 px** — small phones (further shrinks hero typography and stat tiles).

---

## 10. Build & Deployment

```bash
npm install                  # one-off
npm run dev                  # local dev at http://localhost:5173/
npm run build                # production bundle in dist/
npm run preview              # preview the built bundle locally
npm run lint                 # ESLint
```

Production deployment is via GitHub Pages, driven by [`static.yml`](../static.yml). The workflow runs on push to `main`, builds the project, and publishes the `dist/` folder as a Pages artifact.

The Vite config uses a conditional base path so dev (`npm run dev`) serves at `/` while production (`npm run build`) outputs assets pointing to the GitHub Pages subpath.

---

## 11. What I'd Add Next

- **EmailJS / Formspree** integration so the contact form actually sends.
- **Visual regression tests** (Playwright + screenshot diffing) for the print-mode and dark/light themes.
- **Real LLM-backed chat** by swapping the rule-based matcher for a small Claude / OpenAI call, gated behind an environment-variable API key.
- **i18n** — the hero already supports an Arabic watermark; full bilingual support (Arabic + English) is a natural next step.
- **Image optimisation pass** — the project screenshots in `src/assets/` are PNGs in the 600–800 kB range; converting to AVIF/WebP would shave ~1.5 MB off first load.
