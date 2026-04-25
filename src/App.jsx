import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import GitHubRepos from './components/GitHubRepos'
import Skills from './components/Skills'
import FunFact from './components/FunFact'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import ReadingProgress from './components/ReadingProgress'
import CommandPalette from './components/CommandPalette'
import ChatAssistant from './components/ChatAssistant'
import KonamiEgg from './components/KonamiEgg'

function getInitialTheme() {
  const stored = localStorage.getItem('portfolio-theme')
  if (stored === 'dark' || stored === 'light') return stored
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return 'dark'
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  const [visitorName, setVisitorName] = useState(() => {
    return localStorage.getItem('portfolio-visitor') || ''
  })

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('portfolio-theme', next)
      return next
    })
  }, [])

  const handleNamePrompt = useCallback(() => {
    const name = prompt('What is your name?')
    if (name && name.trim()) {
      const trimmed = name.trim().slice(0, 32)
      setVisitorName(trimmed)
      localStorage.setItem('portfolio-visitor', trimmed)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]:not([media])')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#f5f9f7')
  }, [theme])

  return (
    <ErrorBoundary>
      <ReadingProgress />
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        commandPalette={<CommandPalette theme={theme} toggleTheme={toggleTheme} />}
      />
      <main id="main-content">
        <Hero visitorName={visitorName} onNamePrompt={handleNamePrompt} />
        <Projects />
        <GitHubRepos />
        <Skills />
        <FunFact />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <ChatAssistant />
      <KonamiEgg />
    </ErrorBoundary>
  )
}

export default App
