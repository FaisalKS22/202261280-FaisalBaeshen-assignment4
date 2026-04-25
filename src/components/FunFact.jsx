import { useState, useEffect, useCallback, useRef } from 'react'

function FunFact() {
  const [fact, setFact] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const sectionRef = useRef(null)

  const fetchFunFact = useCallback(async () => {
    setLoading(true)
    setError(false)
    setFact('')

    try {
      const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setFact(data.text)
      setAnimKey((prev) => prev + 1)
    } catch (err) {
      console.error('Failed to fetch fun fact:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFunFact()
  }, [fetchFunFact])

  // Scroll fade-in
  useEffect(() => {
    const fadeElements = sectionRef.current?.querySelectorAll('.fade-in')
    if (!fadeElements) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    fadeElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="fun-fact" className="section fun-fact-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Fun Fact</h2>
        <p className="section-subtitle">Learn something new today!</p>

        <div className="fun-fact-card fade-in" id="fun-fact-card">
          <div className="fun-fact-content" id="fun-fact-content">
            {loading && (
              <p className="fun-fact-loading" id="fun-fact-loading">
                <span className="spinner"></span> Loading a fun fact…
              </p>
            )}
            {!loading && fact && (
              <p key={animKey} className="fun-fact-text" id="fun-fact-text">
                {fact}
              </p>
            )}
            {!loading && error && (
              <p className="fun-fact-error" id="fun-fact-error">
                ⚠️ Couldn't load a fun fact right now. Please try again later.
              </p>
            )}
          </div>
          <button className="btn btn-primary fun-fact-btn" id="new-fact-btn" onClick={fetchFunFact}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            New Fact
          </button>
        </div>
      </div>
    </section>
  )
}

export default FunFact
