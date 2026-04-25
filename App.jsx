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

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'dark'
  })

  const [visitorName, setVisitorName] = useState(() => {
    return localStorage.getItem('portfolio-visitor') || ''
  })

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('portfolio-theme', next)
      return next
    })
  }, [])

  const handleNamePrompt = useCallback(() => {
    const name = prompt('What is your name?')
    if (name && name.trim()) {
      const trimmed = name.trim()
      setVisitorName(trimmed)
      localStorage.setItem('portfolio-visitor', trimmed)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero visitorName={visitorName} onNamePrompt={handleNamePrompt} />
      <Projects />
      <GitHubRepos />
      <Skills />
      <FunFact />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default App
