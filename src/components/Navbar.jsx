import { useState, useEffect, useRef } from 'react'

function Navbar({ theme, toggleTheme, commandPalette }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const navMenuRef = useRef(null)

  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#github-repos', label: 'GitHub' },
    { href: '#skills', label: 'Skills' },
    { href: '#fun-fact', label: 'Fun Facts' },
    { href: '#contact', label: 'Contact' },
  ]

  const handleToggle = () => setMenuOpen((prev) => !prev)
  const handleLinkClick = () => setMenuOpen(false)

  useEffect(() => {
    const sections = document.querySelectorAll('section[id], header[id]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('id'))
          }
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <nav
      id="navbar"
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <div className="nav-container">
        <a href="#" className="nav-logo" aria-label="Faisal — home">
          F<span className="accent">.</span>
        </a>

        <button
          id="nav-toggle"
          className={`nav-toggle ${menuOpen ? 'active' : ''}`}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={handleToggle}
        >
          <span className="hamburger"></span>
        </button>

        <ul
          id="nav-menu"
          className={`nav-menu ${menuOpen ? 'open' : ''}`}
          ref={navMenuRef}
        >
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`nav-link ${activeSection === href.slice(1) ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                {label}
              </a>
            </li>
          ))}
          <li className="nav-cmdk">{commandPalette}</li>
          <li>
            <button
              id="theme-toggle"
              className="theme-toggle"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              onClick={toggleTheme}
            >
              <span id="theme-icon" aria-hidden="true">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
