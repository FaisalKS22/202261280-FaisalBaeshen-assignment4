import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

function CommandPalette({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const commands = useMemo(
    () => [
      { id: 'go-about', group: 'Navigate', label: 'Go to About', hint: 'Hero section', icon: '🏠', run: () => scrollTo('about') },
      { id: 'go-projects', group: 'Navigate', label: 'Go to Projects', hint: 'My work', icon: '💼', run: () => scrollTo('projects') },
      { id: 'go-github', group: 'Navigate', label: 'Go to GitHub Repos', hint: 'Live API', icon: '🐙', run: () => scrollTo('github-repos') },
      { id: 'go-skills', group: 'Navigate', label: 'Go to Skills', hint: 'Tech stack', icon: '🛠️', run: () => scrollTo('skills') },
      { id: 'go-fun', group: 'Navigate', label: 'Go to Fun Fact', hint: 'Random fact', icon: '🎲', run: () => scrollTo('fun-fact') },
      { id: 'go-contact', group: 'Navigate', label: 'Go to Contact', hint: 'Get in touch', icon: '✉️', run: () => scrollTo('contact') },
      {
        id: 'theme-toggle',
        group: 'Actions',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        hint: 'Toggle color scheme',
        icon: theme === 'dark' ? '☀️' : '🌙',
        run: () => toggleTheme(),
      },
      { id: 'top', group: 'Actions', label: 'Scroll to top', hint: 'Back to start', icon: '⬆️', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      { id: 'print', group: 'Actions', label: 'Print / Save as PDF', hint: 'Resume mode', icon: '🖨️', run: () => window.print() },
      { id: 'github', group: 'Links', label: 'Open GitHub profile', hint: '@Faisal-M2', icon: '🔗', run: () => window.open('https://github.com/Faisal-M2', '_blank', 'noopener,noreferrer') },
      { id: 'linkedin', group: 'Links', label: 'Open LinkedIn profile', hint: 'faisal-baeshen', icon: '🔗', run: () => window.open('https://www.linkedin.com/in/faisal-baeshen/', '_blank', 'noopener,noreferrer') },
      { id: 'copy-email', group: 'Links', label: 'Copy email address', hint: 'To clipboard', icon: '📋', run: () => copyEmail() },
    ],
    [theme, toggleTheme]
  )

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function copyEmail() {
    const email = 'faisal.baeshen@kfupm.edu.sa'
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).catch(() => {})
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    )
  }, [commands, query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
  }, [])

  const runCommand = useCallback(
    (cmd) => {
      if (!cmd) return
      close()
      setTimeout(() => cmd.run(), 60)
    },
    [close]
  )

  useEffect(() => {
    const onKeyDown = (e) => {
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen((prev) => !prev)
        return
      }
      if (!open) return
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(filtered.length - 1, i + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(0, i - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        runCommand(filtered[activeIndex])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, filtered, activeIndex, close, runCommand])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!listRef.current) return
    const item = listRef.current.querySelector(`[data-index="${activeIndex}"]`)
    if (item) item.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  return (
    <>
      <button
        type="button"
        className="cmdk-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        title="Open command palette (Ctrl+K)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Quick search</span>
        <kbd>Ctrl K</kbd>
      </button>

      {open && (
        <div className="cmdk-overlay" onClick={close} role="presentation">
          <div
            className="cmdk-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cmdk-input-row">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                className="cmdk-input"
                type="text"
                placeholder="Type a command or search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search commands"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="cmdk-esc">Esc</kbd>
            </div>

            <div className="cmdk-list" ref={listRef} role="listbox">
              {filtered.length === 0 && (
                <div className="cmdk-empty">No matching commands.</div>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  data-index={i}
                  className={`cmdk-item ${i === activeIndex ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => runCommand(cmd)}
                  role="option"
                  aria-selected={i === activeIndex}
                >
                  <span className="cmdk-item-icon" aria-hidden="true">{cmd.icon}</span>
                  <span className="cmdk-item-label">{cmd.label}</span>
                  <span className="cmdk-item-hint">{cmd.hint}</span>
                </button>
              ))}
            </div>

            <div className="cmdk-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>Esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CommandPalette
