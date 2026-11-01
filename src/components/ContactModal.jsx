import { useEffect, useState } from 'react'

export default function ContactModal({ isOpen, onClose, labels, calendlyUrl }) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isClosing, setIsClosing] = useState(false)
  const [copiedField, setCopiedField] = useState(null)

  const email = 'antonynegdas@gmail.com'
  const phoneDisplay = '79 98813-4644'
  const whatsappUrl = 'https://wa.me/5579988134644'

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender) {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 240)
      return () => clearTimeout(timer)
    }
  }, [isOpen, shouldRender])

  useEffect(() => {
    if (!shouldRender) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shouldRender, onClose])

  const handleCopy = async (e, value, key) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(key)
      setTimeout(() => {
        setCopiedField((curr) => (curr === key ? null : curr))
      }, 2000)
    } catch {
      // Clipboard fallback ignored safely
    }
  }

  if (!shouldRender) return null

  return (
    <div
      className={`contact-modal-backdrop ${isClosing ? 'is-closing' : 'is-open'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className={`contact-modal-card ${isClosing ? 'is-closing' : 'is-open'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contact-modal-topbar">
          <span className="eyebrow">
            <span className="status-dot" />
            {labels.kicker}
          </span>
          <button
            type="button"
            className="contact-modal-close"
            onClick={onClose}
            aria-label={labels.close}
          >
            ✕
          </button>
        </div>

        <div className="contact-modal-header">
          <h3 id="contact-modal-title">{labels.title}</h3>
          <p>{labels.subtitle}</p>
        </div>

        <div className="contact-channels">
          {/* 1. Calendly */}
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-channel-item contact-stagger-1 is-featured"
          >
            <div className="contact-channel-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <circle cx="12" cy="15.5" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="contact-channel-body">
              <span className="contact-channel-label">{labels.calendlyLabel}</span>
              <strong className="contact-channel-value">
                calendly.com/antonyjoaquim/30min
              </strong>
            </div>
            <span className="contact-channel-action">
              {labels.open} <i aria-hidden="true">↗</i>
            </span>
          </a>

          {/* 2. Gmail */}
          <div className="contact-channel-row contact-stagger-2">
            <a href={`mailto:${email}`} className="contact-channel-item">
              <div className="contact-channel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className="contact-channel-body">
                <span className="contact-channel-label">Gmail</span>
                <strong className="contact-channel-value">{email}</strong>
              </div>
              <span className="contact-channel-action">
                {labels.sendEmail} <i aria-hidden="true">↗</i>
              </span>
            </a>
            <button
              type="button"
              className={`contact-copy-btn ${copiedField === 'email' ? 'is-copied' : ''}`}
              onClick={(e) => handleCopy(e, email, 'email')}
              aria-label={`${labels.copy} ${email}`}
            >
              {copiedField === 'email' ? labels.copied : labels.copy}
            </button>
          </div>

          {/* 3. WhatsApp */}
          <div className="contact-channel-row contact-stagger-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-channel-item"
            >
              <div className="contact-channel-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div className="contact-channel-body">
                <span className="contact-channel-label">WhatsApp</span>
                <strong className="contact-channel-value">{phoneDisplay}</strong>
              </div>
              <span className="contact-channel-action">
                {labels.chat} <i aria-hidden="true">↗</i>
              </span>
            </a>
            <button
              type="button"
              className={`contact-copy-btn ${copiedField === 'phone' ? 'is-copied' : ''}`}
              onClick={(e) => handleCopy(e, phoneDisplay, 'phone')}
              aria-label={`${labels.copy} ${phoneDisplay}`}
            >
              {copiedField === 'phone' ? labels.copied : labels.copy}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
