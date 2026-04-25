import { useEffect, useState } from 'react'

const SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

function KonamiEgg() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let buffer = []
    const onKeyDown = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      buffer.push(key)
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length)
      const matches = SEQUENCE.every((k, i) => buffer[i] === k)
      if (buffer.length === SEQUENCE.length && matches) {
        setActive(true)
        buffer = []
        setTimeout(() => setActive(false), 5000)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!active) return null

  return (
    <div className="konami-overlay" role="status" aria-live="polite">
      <div className="konami-card">
        <span className="konami-emoji" aria-hidden="true">🎉</span>
        <h2>You found the secret!</h2>
        <p>Konami code activated. Thanks for being curious.</p>
      </div>
      {Array.from({ length: 32 }).map((_, i) => (
        <span
          key={i}
          className="konami-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.6}s`,
            background: ['#A2D5C6', '#CFFFE2', '#3a8f7a', '#f1e05a', '#f05138'][i % 5],
          }}
        />
      ))}
    </div>
  )
}

export default KonamiEgg
