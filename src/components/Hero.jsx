import { useState, useEffect, useCallback } from 'react'
import avatarImg from '../assets/WhatsApp Image 2026-02-14 at 9.59.59 PM (1).jpeg'

const phrases = ['Aspiring Web Developer', 'Tech Enthusiast', 'AI Specialist']

function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning! ☀️'
  if (hour >= 12 && hour < 17) return 'Good afternoon! 🌤️'
  if (hour >= 17 && hour < 21) return 'Good evening! 🌅'
  return 'Hello, night owl! 🌙'
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function Hero({ visitorName, onNamePrompt }) {
  const [greeting] = useState(getGreeting)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [timeOnSite, setTimeOnSite] = useState(0)

  // Visitor timer — counts seconds on site
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnSite(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Cycling tagline animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true)
      setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length)
        setFadeOut(false)
      }, 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header id="about" className="hero">
      {/* Large watermark text behind everything */}
      <span className="hero-watermark" aria-hidden="true">فيصل باعشن</span>

      <div className="hero-inner">
        {/* Left: Text content */}
        <div className="hero-content">
          <p className="greeting" id="greeting">
            {visitorName ? `Hey ${visitorName}! ${greeting}` : greeting}
          </p>
          {!visitorName && (
            <button className="visitor-name-btn" onClick={onNamePrompt}>
              Tell me your name
            </button>
          )}
          <h1 className="hero-title">
            I'm <span className="accent">Faisal Baeshen</span>
          </h1>
          <p className="hero-tagline">
            <span className={`cycle-text ${fadeOut ? 'fade-out' : ''}`} id="cycle-text">
              {phrases[phraseIndex]}
            </span>
          </p>
          <p className="hero-description">
            I'm a King Fahd University of Petroleum and Minerals student passionate about building clean, user-friendly
            web experiences. I enjoy turning ideas into reality through code and
            learning new technologies.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">Say Hello</a>
            <a href="#projects" className="btn btn-outline">View My Work</a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => window.print()}
              aria-label="Print or save portfolio as PDF résumé"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print / PDF
            </button>
          </div>
        </div>

        {/* Right: Large image */}
        <div className="hero-image-wrapper">
          <img src={avatarImg} alt="Faisal Baeshen" className="avatar-img" />
        </div>
      </div>

      {/* Vertical social icons (right side) */}
      <div className="hero-social">
        <a href="https://github.com/Faisal-M2" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.1.79-.25.79-.56
            0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.38-3.87-1.38-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72
            .08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26
            .73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46
            .11-3.05 0 0 .97-.31 3.18 1.19a10.93 10.93 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19
            .63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36
            .79 1.06.79 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.55A11.52 11.52 0 0 0 23.5
            12C23.5 5.65 18.35.5 12 .5z" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/faisal-baeshen/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24
            5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76
            s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6
            c0-3.37-4-3.12-4 0v5.6h-3v-10h3v1.77c1.4-2.59 7-2.78 7 2.48v5.75z" />
          </svg>
        </a>
        <a href="mailto:faisal.baeshen@kfupm.edu.sa" aria-label="Email">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </a>
      </div>

      {/* Stats bar at bottom */}
      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number">3+</span>
          <span className="stat-label">Projects Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">5+</span>
          <span className="stat-label">Technologies</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">2+</span>
          <span className="stat-label">Years Learning</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{formatTime(timeOnSite)}</span>
          <span className="stat-label">Time on Site</span>
        </div>
      </div>
    </header>
  )
}

export default Hero
