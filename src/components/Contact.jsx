import { useState, useCallback } from 'react'

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({ name: '', email: '', message: '' })
  const [toast, setToast] = useState({ message: '', type: '' })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error on input
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const showToast = useCallback((message, type) => {
    setToast({ message, type })
    setTimeout(() => {
      setToast({ message: '', type: '' })
    }, 4000)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    let isValid = true
    const newErrors = { name: '', email: '', message: '' }

    // Name validation
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your name (at least 2 characters).'
      isValid = false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.'
      isValid = false
    }

    // Message validation
    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.'
      isValid = false
    }

    setErrors(newErrors)

    // Remove shake after animation
    setTimeout(() => {
      setErrors((prev) => ({ ...prev }))
    }, 400)

    if (isValid) {
      showToast('✅ Message sent successfully!', 'toast-success')
      setFormData({ name: '', email: '', message: '' })
      setErrors({ name: '', email: '', message: '' })
    } else {
      showToast('⚠️ Please fix the errors above.', 'toast-error')
    }
  }

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title">Contact</h2>
        <p className="section-subtitle">Feel free to reach out!</p>

        <form id="contact-form" className="contact-form" noValidate onSubmit={handleSubmit}>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <span className={`error-msg ${errors.name ? 'shake' : ''}`} id="name-error">
              {errors.name}
            </span>
          </div>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <span className={`error-msg ${errors.email ? 'shake' : ''}`} id="email-error">
              {errors.email}
            </span>
          </div>

          <div className={`form-group full-width ${errors.message ? 'has-error' : ''}`}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Write your message…"
              required
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
            />
            <span className={`error-msg ${errors.message ? 'shake' : ''}`} id="message-error">
              {errors.message}
            </span>
          </div>

          <button type="submit" className="btn btn-primary" id="submit-btn">
            <span id="submit-text">Send Message</span>
          </button>

          {/* Toast notification */}
          <div
            className={`toast ${toast.type} ${toast.message ? 'toast-show' : ''}`}
            id="form-toast"
            role="alert"
            aria-live="polite"
          >
            {toast.message}
          </div>
        </form>
      </div>
    </section>
  )
}

export default Contact
