# AI Usage Report — Assignment 4

This document is a transparent record of how I used AI tools during the build of this portfolio. The goal of the report is twofold: (1) to give an honest account of what AI did versus what I did, and (2) to show that I understand every line that ended up in the final code.

---

## 1. Tools Used & Use Cases

| Tool | Where I used it | Why |
|------|-----------------|-----|
| **Claude (Anthropic)** | Component scaffolding, refactoring, code review, documentation | Best at producing structured React code and explaining its own output when I pushed back |
| **GitHub Copilot** | Inline completion inside VS Code (CSS rules, JSX boilerplate, repetitive validation branches) | Fast, low-friction; great for the 80% of code that is "obvious" once you know what you want |
| **ChatGPT** | Quick "what's the idiomatic way to…" lookups | Used as a stack-overflow replacement for short questions |

I did **not** use AI tools for design decisions (colour palette, layout, copy), the personal content of the page (bio, projects), or the rubric mapping in this report. Those are all mine.

---

## 2. Concrete Examples (Use Cases)

### 2.1 — Code generation
- **Command palette (`CommandPalette.jsx`)**: I described the behaviour I wanted ("VS Code style ⌘K palette with arrow-key nav, fuzzy filter, and grouped commands") and asked Claude for an initial structure. The first draft used a Context provider, which I removed because the palette only needs the theme + toggle from `App.jsx`. I also rewrote the keyboard handler to live inside `useEffect` properly, so it doesn't leak listeners on hot-reload.
- **Chat assistant (`ChatAssistant.jsx`)**: Claude scaffolded the message-list component and the typing-indicator CSS animation. The keyword-matching logic, the knowledge base, and the "action button" feature that scrolls to a section — those are mine.

### 2.2 — Debugging
- The contact form's shake animation wasn't triggering on subsequent submits because React was re-using the same DOM node and the CSS animation didn't restart. Copilot suggested adding a key, but the cleaner fix (which I worked out with Claude) was to flip the error state in a `setTimeout` to force a class re-application.
- The intersection observer for the navbar's active-section highlight kept jumping when scrolling fast. I added `rootMargin: '-80px 0px -50% 0px'` after a Claude suggestion that explained _why_ that fixes it (it shrinks the trigger zone to the upper-middle of the viewport so only one section is "active" at a time).

### 2.3 — Code review
- I asked Claude to review my project explorer (`Projects.jsx`) for performance. It pointed out that I was recomputing the filtered list inside the JSX render and suggested wrapping the whole thing in `useMemo` keyed on `[activeFilter, searchQuery, sortBy, levelFilter]`. That single change is the reason the four filter controls feel instant even with the cards' fade-in transitions running.

### 2.4 — Documentation support
- This README and the technical documentation went through a "Claude pass" after I drafted them. I asked it to flag sections that were vague, missing context for a new reader, or claimed things the code didn't actually do. I rewrote everything Claude flagged.

### 2.5 — UI/UX suggestions
- The reading-progress bar and the print-as-PDF résumé mode were Claude suggestions when I asked _"what's a small but high-signal thing I can add to make this feel like a real product?"_ Both made it in, both were implemented from scratch by me after the suggestion.

---

## 3. Benefits

1. **Speed** — features like the command palette and chat assistant would have taken me a full day each to build from scratch with documentation lookups. With AI scaffolding, I had working drafts in 30–45 minutes and spent the rest of the time refining them.
2. **Pattern exposure** — Claude consistently used `useCallback`, `useMemo`, and `useRef` in places I would have reached for plain functions or DOM IDs. Reading those drafts taught me when each one is actually load-bearing.
3. **Better error handling** — left to my own habits I would have shipped happy-path-only code. Claude's first drafts of `GitHubRepos.jsx` and `FunFact.jsx` already included loading, error, and empty states; I kept all three patterns.
4. **Documentation discipline** — I almost never write a real README for course assignments. Having Claude turn my bullet-point notes into a full document made it painless enough that I actually finished one.

---

## 4. Challenges & Limitations

1. **AI doesn't see the project** — every prompt has to re-establish context. Suggestions sometimes referenced libraries I wasn't using (e.g. `framer-motion`, `cmdk`) and I had to either reject or re-implement in plain CSS.
2. **Over-engineering** — Copilot wanted to wrap simple state in `useReducer`; Claude proposed a context provider for the palette before I clarified the scope. I had to push back on both.
3. **Confident wrong answers** — Claude suggested `localStorage.getItem` returns `null` _or_ `undefined`. It only ever returns `null` or the stored string. Small thing, but a reminder to verify, not just trust.
4. **Style drift** — AI-generated code sometimes used Tailwind class names or styled-components patterns. I rewrote those into the project's plain-CSS-with-custom-properties convention.
5. **My responsibility, not the model's** — when something broke, the model couldn't run the dev server. The debugging loop (add `console.log`, check Network tab, isolate the failing render) was always mine.

---

## 5. Learning Outcomes

Concrete things I now understand better because of this build:

- **`useMemo` vs `useCallback`** — when each one actually matters (recomputing a derived value vs stabilising a function reference for a child component or effect dependency).
- **Intersection Observer** — why it's the right tool for scroll-spy and fade-ins, and how `threshold` and `rootMargin` interact.
- **Error boundaries** — that they only catch render-time errors, not async errors in event handlers, and that `getDerivedStateFromError` is the static method you actually need.
- **`prefers-reduced-motion`** — that this is a real OS-level user setting and that respecting it via a CSS media query is a five-line accessibility win.
- **CSS print stylesheets** — that you can ship a usable résumé from the same HTML by just hiding what doesn't belong and letting the browser reflow.
- **PWA basics** — what a manifest needs at minimum to mark a site as "installable".
- **How to brief an AI** — short, scoped prompts with a clear constraint ("plain CSS, no libraries; one component file") produce useable code; vague prompts produce drafts you have to throw away.

---

## 6. Responsible Use & Modifications

- **Read every line.** Nothing was committed without me reading it. If I couldn't explain what a line did, I rewrote it until I could.
- **No copy-pasted personal content.** The bio, project descriptions, skill list, and the chat assistant's knowledge base are all written by me.
- **Adapted to project conventions.** Every AI snippet that came in with Tailwind, styled-components, or a non-standard pattern was rewritten to use this project's plain-CSS + CSS-variable approach.
- **Verified with the running app.** Every AI-generated component was loaded in the browser, tested in dark and light themes, on desktop and at the 480 px breakpoint, before being marked "done".
- **Cited where I leaned heavily on it.** This document plus the README make it explicit that AI helped scaffold the command palette, the chat assistant, the error boundary, and parts of the documentation. The substance — what to build, why, and how it integrates — is mine.

---

## 7. Honest Self-Assessment

What AI is **good for** in this kind of project: scaffolding components with sensible defaults, suggesting accessibility patterns I'd otherwise miss, turning bullet notes into prose, and being a tireless code reviewer.

What AI is **bad for**: knowing what you actually want to build, debugging anything that depends on runtime state it can't see, and judging whether a feature is worth the complexity it adds. Those calls are mine.

I'm submitting this as my own work, with AI used as a tool the same way I use ESLint, the React docs, or Stack Overflow.
