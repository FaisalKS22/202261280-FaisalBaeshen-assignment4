import { useEffect, useRef, useState } from 'react'

const STARTER_QUESTIONS = [
  'Who are you?',
  'What can you build?',
  'Show me your projects',
  'How do I contact you?',
]

const KNOWLEDGE = [
  {
    keys: ['who', 'about', 'yourself', 'name'],
    answer:
      "I'm Faisal Baeshen — a Computer Engineering student at King Fahd University of Petroleum and Minerals (KFUPM). I build modern web and mobile apps and enjoy turning ideas into code.",
  },
  {
    keys: ['skill', 'tech', 'stack', 'technolog', 'language', 'framework'],
    answer:
      'My main stack: React, Next.js, TypeScript, Tailwind on the web, and Flutter/Dart for mobile. I also work with Python, Firebase, Supabase, and PyTorch for AI experiments.',
    action: { label: 'See all skills', target: 'skills' },
  },
  {
    keys: ['project', 'work', 'build', 'portfolio', 'show'],
    answer:
      "I've built three featured projects: a Volunteer Work Unit web app (Next.js), Kashet — a camping reservations mobile app (Flutter), and RoboNexus — a robotics community app (Flutter + Supabase).",
    action: { label: 'Open Projects', target: 'projects' },
  },
  {
    keys: ['github', 'repo', 'code', 'open source'],
    answer:
      'My public repositories load live from the GitHub API in the GitHub section — sorted by stars and last updated.',
    action: { label: 'Open GitHub section', target: 'github-repos' },
  },
  {
    keys: ['contact', 'reach', 'email', 'message', 'hire'],
    answer:
      "Easiest way: scroll to the Contact section and send me a message — I read every one. You can also reach me on LinkedIn.",
    action: { label: 'Open Contact', target: 'contact' },
  },
  {
    keys: ['theme', 'dark', 'light', 'mode'],
    answer:
      'You can toggle dark / light theme from the navbar moon icon — or open the command palette with Ctrl+K and run "Switch theme". Your choice is saved across sessions.',
  },
  {
    keys: ['shortcut', 'keyboard', 'palette', 'cmd', 'ctrl', 'command'],
    answer:
      'Press Ctrl+K (or ⌘+K on Mac) to open the command palette. From there you can jump to any section, toggle theme, copy my email, or print the page as a PDF résumé.',
  },
  {
    keys: ['kfupm', 'university', 'study', 'school', 'student'],
    answer:
      "I study Computer Engineering at King Fahd University of Petroleum and Minerals (KFUPM) in Dhahran, Saudi Arabia.",
  },
  {
    keys: ['fun', 'fact', 'hobby', 'interest'],
    answer:
      'The Fun Fact section pulls a random useless-fact from a public API every time you click "New Fact" — try it!',
    action: { label: 'Open Fun Fact', target: 'fun-fact' },
  },
  {
    keys: ['ai', 'chatbot', 'assistant', 'how does this'],
    answer:
      "I'm a small rule-based assistant — no LLM call, no tracking. I match your message against keywords about Faisal's portfolio and respond instantly. Open-source and free to read in the source code.",
  },
]

const FALLBACK = {
  answer:
    "I can answer things about Faisal — try one of the suggestions, or ask about his projects, skills, GitHub, or how to contact him.",
}

function findReply(text) {
  const lower = text.toLowerCase()
  let best = null
  let bestScore = 0
  for (const item of KNOWLEDGE) {
    const score = item.keys.reduce((acc, k) => (lower.includes(k) ? acc + 1 : acc), 0)
    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }
  return bestScore > 0 ? best : FALLBACK
}

function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm Faisal's assistant 👋. Ask me about his projects, skills, or how to get in touch.",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typing, open])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const send = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = findReply(trimmed)
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: reply.answer, action: reply.action },
      ])
      setTyping(false)
    }, 450 + Math.random() * 350)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const handleAction = (target) => {
    const el = document.getElementById(target)
    if (el) {
      setOpen(false)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <button
        type="button"
        className={`chat-fab ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={open}
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="chat-window" role="dialog" aria-label="Portfolio assistant">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-avatar" aria-hidden="true">F</span>
              <div>
                <strong>Faisal's Assistant</strong>
                <span className="chat-status">
                  <span className="chat-dot" /> Online
                </span>
              </div>
            </div>
            <button
              className="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                <p>{msg.text}</p>
                {msg.action && (
                  <button
                    type="button"
                    className="chat-action"
                    onClick={() => handleAction(msg.action.target)}
                  >
                    {msg.action.label} →
                  </button>
                )}
              </div>
            ))}
            {typing && (
              <div className="chat-msg chat-msg-bot">
                <p className="chat-typing" aria-label="Assistant is typing">
                  <span></span><span></span><span></span>
                </p>
              </div>
            )}
          </div>

          {messages.length <= 2 && (
            <div className="chat-suggestions">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  className="chat-suggestion"
                  onClick={() => send(q)}
                  type="button"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Ask about projects, skills…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Type a message"
              maxLength={300}
            />
            <button
              type="submit"
              className="chat-send"
              aria-label="Send message"
              disabled={!input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatAssistant
