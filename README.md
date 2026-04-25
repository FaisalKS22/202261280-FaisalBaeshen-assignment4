# Faisal Baeshen — Personal Portfolio (Assignment 4)

A polished, production-ready personal portfolio web application built with **React 19** and **Vite 8**. This is the final assignment in the series — it ties together everything learned across the course into one shippable product: responsive UI, real API integrations, accessibility, and a few innovative touches (a ⌘K command palette, an in-page chat assistant, a print-as-PDF résumé mode, and a hidden easter egg).

> **Live demo:** _add your GitHub Pages / Netlify / Vercel URL here once deployed._

---

## Table of Contents

- [Highlights](#highlights)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Run Locally](#run-locally)
- [Project Structure](#project-structure)
- [Features in Detail](#features-in-detail)
- [Innovation: What Makes It Stand Out](#innovation-what-makes-it-stand-out)
- [Accessibility & Performance](#accessibility--performance)
- [Deployment](#deployment)
- [AI Tools Used](#ai-tools-used)
- [Author](#author)
- [License](#license)

---

## Highlights

- **Real API integration** — pulls live data from the GitHub REST API and a public Useless Facts API, both with full loading / error / empty states.
- **Dark + light theme** with system-preference detection, smooth transitions, and `localStorage` persistence.
- **Project explorer** — search, multi-tag filter, difficulty filter, and four sort orders, all combined via `useMemo`.
- **⌘K command palette** — Linear / VS Code style quick-launcher with keyboard navigation, fuzzy-style filtering, and twelve commands.
- **In-page AI-style chat assistant** — a friendly bot that answers questions about my work, with typing indicator and quick-action buttons.
- **Print-as-PDF résumé mode** — hit `Print` (or use the command palette) and the page collapses into a clean one-column résumé.
- **Reading-progress bar**, scroll-to-top button, scroll-spy navigation, and intersection-observer fade-ins.
- **Konami code easter egg** 🎉 — try `↑↑↓↓←→←→ B A` anywhere on the page.
- **Production-grade**: error boundary, semantic HTML, ARIA labels, keyboard focus rings, skip-link, `prefers-reduced-motion` support, PWA manifest, OG tags, structured data.

---

## Screenshots

> Add screenshots to `presentation/` and link them here once captured. Suggested:
> - Hero (dark + light)
> - Projects with filters active
> - Command palette open
> - Chat assistant open
> - Mobile view

---

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Hand-written CSS with CSS Custom Properties (no UI library) |
| State | React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) |
| Data | GitHub REST API, Useless Facts API |
| Persistence | `localStorage` (theme + visitor name) |
| Tooling | ESLint, Vite dev server / preview |
| Deployment | GitHub Pages via GitHub Actions (`static.yml`) |

---

## Run Locally

### Prerequisites
- **Node.js** 18 or newer ([download](https://nodejs.org))
- **npm** (ships with Node) — or use pnpm / yarn if you prefer

### Steps

```bash
# 1 — clone the repository
git clone https://github.com/<your-username>/202261280-FaisalBaeshen-assignment4.git
cd 202261280-FaisalBaeshen-assignment4

# 2 — install dependencies
npm install

# 3 — start the development server
npm run dev
```

The dev server runs at **`http://localhost:5173/`**.

### Other scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start Vite dev server with hot-reload |
| `npm run build` | Type-check + produce production bundle in `dist/` |
| `npm run preview` | Serve the production build locally for verification |
| `npm run lint` | Run ESLint over the project |

> **Note about base path:** [`vite.config.js`](./vite.config.js) sets `base: '/'` for `dev` and `'/202261280-Faisal_Baeshen-Assig1/'` for `build`. This is so local development is served at `/` while the production build deploys cleanly to GitHub Pages at the project subpath.

---

## Project Structure

```
202261280-FaisalBaeshen-assignment4/
├── index.html                  # SEO meta, OG tags, favicon, manifest, skip-link
├── package.json
├── vite.config.js              # Conditional base path (dev vs build)
├── eslint.config.js
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   └── fonts/                  # Saudi Arabic font for the hero watermark
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Composition root, theme + visitor state
│   ├── index.css               # All styles (CSS variables + responsive + print)
│   ├── assets/                 # Images
│   └── components/
│       ├── Navbar.jsx          # Sticky nav, scroll-spy, mobile menu, ⌘K trigger
│       ├── Hero.jsx            # Greeting, cycling tagline, visitor timer, CTAs
│       ├── Projects.jsx        # Search + filter + sort + difficulty
│       ├── GitHubRepos.jsx     # Live GitHub API + stats summary card
│       ├── Skills.jsx          # Skill badge grid
│       ├── FunFact.jsx         # Random fact API with refresh
│       ├── Contact.jsx         # Validated form with toast notifications
│       ├── Footer.jsx          # Footer + social links
│       ├── ScrollToTop.jsx     # Floating return-to-top button
│       ├── ReadingProgress.jsx # Top-of-page scroll progress bar
│       ├── CommandPalette.jsx  # ⌘K / Ctrl+K command palette
│       ├── ChatAssistant.jsx   # Floating chat bot widget
│       ├── KonamiEgg.jsx       # Hidden easter egg
│       └── ErrorBoundary.jsx   # Graceful failure handling
├── docs/
│   ├── ai-usage-report.md      # How AI tools were used
│   └── technical-documentation.md
├── presentation/               # Slides + demo video (added during submission)
└── README.md
```

---

## Features in Detail

### GitHub Repos (live API)
Fetches `https://api.github.com/users/Faisal-M2/repos`, sorts by stars then updated date, and renders each repo with description, language (with GitHub-style colour dot), star/fork counts, last-updated date, and fork badge. A summary strip aggregates total repos, total stars, total forks, and top language. Includes loading spinner, retry-on-error, and empty state.

### Project Explorer
- **Search** across title, description, and tags.
- **Tag filter** chips (All, Next.js, Flutter, React, Python).
- **Difficulty filter** dropdown (All / Beginner / Advanced).
- **Sort** by Newest, Oldest, Name A→Z, Name Z→A.
- All four controls are combined inside one `useMemo`, so re-renders are cheap and only happen when their inputs change.

### Contact Form
Manual client-side validation:
- **Name** ≥ 2 characters
- **Email** must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Message** ≥ 10 characters

On error: red border, shake animation, inline message, and a toast that announces via `role="alert" aria-live="polite"`. On success: clears the form and shows a success toast.

### Theme System
Initial theme = stored value → else system preference (`prefers-color-scheme`) → else dark. The toggle persists to `localStorage` and updates the `<meta name="theme-color">` so the browser chrome (mobile address bar) follows the theme.

---

## Innovation: What Makes It Stand Out

1. **⌘K Command Palette** — keyboard-first navigation. Up/Down to move, Enter to run, Esc to close. Includes "copy email", "print as PDF", section jumps, theme toggle, and external links.
2. **AI-style Chat Assistant** — a small rule-based bot in the corner answers visitor questions about my projects, skills, contact info, and how the site works. Includes typing indicator, suggested starter questions, and contextual action buttons that scroll the page.
3. **Print-as-PDF résumé mode** — the entire page reflows into a clean black-on-white résumé with all interactive widgets hidden, link URLs expanded, and project cards laid out vertically. No separate PDF file required.
4. **Reading-progress bar** at the top of the page, animated via `requestAnimationFrame` for smooth, non-janky scroll feedback.
5. **Visitor timer + visitor name** — the hero greets returning visitors by name and shows their session length live in the stats bar.
6. **Konami easter egg** — `↑↑↓↓←→←→ B A` triggers a confetti animation and a "you found it" card.

---

## Accessibility & Performance

### Accessibility
- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Skip-to-main-content link (visible on focus)
- ARIA labels on every icon button, `aria-expanded` on the mobile menu, `aria-modal` on the command palette
- Keyboard focus rings (`:focus-visible`)
- Toast notifications announced via `aria-live="polite"`
- `prefers-reduced-motion` honoured — animations and transitions disabled for users who request it
- Image `alt` text on every photo and screenshot

### Performance
- Production build is **~72 kB gzipped JS + ~7 kB gzipped CSS**.
- `useMemo` on filter/sort and `useCallback` on theme handlers prevent wasted re-renders.
- Project images use `loading="lazy"` and `decoding="async"`.
- `IntersectionObserver` (instead of scroll listeners) drives fade-ins and active-section highlighting.
- `requestAnimationFrame`-throttled scroll listener for the reading-progress bar.
- Vite production build does code-splitting, tree-shaking, and asset hashing.

### Compatibility
- Tested in latest Chrome, Edge, Firefox, and Safari.
- Responsive breakpoints at 1024 px, 768 px, and 480 px.
- Works as an installable PWA (manifest + theme-colour).

---

## Deployment

The build is deployed to GitHub Pages via the workflow at [`static.yml`](./static.yml):

1. Push to `main`.
2. The workflow runs `npm ci && npm run build`.
3. The contents of `dist/` are uploaded as a Pages artifact.
4. Pages publishes to your `<username>.github.io/<repo-name>/` URL.

You can also deploy elsewhere with zero config:

```bash
npm run build
# then upload the dist/ folder to Netlify, Vercel, Cloudflare Pages, etc.
```

---

## AI Tools Used

This project was built with the assistance of:
- **Claude (Anthropic)** — for component scaffolding, refactor reviews, and documentation.
- **GitHub Copilot** — for inline completion of repetitive patterns (CSS, JSX, validation).

Every AI suggestion was read, edited, and tested before being committed. A full breakdown — including specific prompts, what was kept, what was rewritten, and what I learned — lives in **[`docs/ai-usage-report.md`](./docs/ai-usage-report.md)**.

A deeper dive into the architecture, data flow, and design decisions is in **[`docs/technical-documentation.md`](./docs/technical-documentation.md)**.

---

## Author

**Faisal Baeshen** — Computer Engineering student at **King Fahd University of Petroleum and Minerals (KFUPM)**.

- GitHub: [@Faisal-M2](https://github.com/Faisal-M2)
- LinkedIn: [faisal-baeshen](https://www.linkedin.com/in/faisal-baeshen/)
- Email: faisal.baeshen@kfupm.edu.sa

---

## License

This repository is the author's coursework portfolio and is shared publicly for grading and demonstration. You are welcome to read, learn from, and reference the code; please do not copy it as-is for an academic submission.
