import { useState } from 'react'

export default function FAQ({ data }) {
  const [openIndex, setOpenIndex] = useState(0)

  if (!data || !data.items) return null

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <section className="faq shell reveal-block" data-reveal aria-label="Frequently Asked Questions">
      <div className="section-heading">
        <div>
          <p className="kicker">{data.kicker}</p>
          <h2>{data.title}</h2>
        </div>
        <p>{data.subtitle}</p>
      </div>

      <div className="faq-list">
        {data.items.map((item, idx) => {
          const isOpen = openIndex === idx
          return (
            <article
              key={item.question}
              className={`faq-item ${isOpen ? 'is-active' : ''}`}
            >
              <button
                type="button"
                className="faq-trigger"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${idx}`}
                id={`faq-btn-${idx}`}
              >
                <span className="faq-num" aria-hidden="true">
                  0{idx + 1}
                </span>
                <span className="faq-question">{item.question}</span>
                <span className={`faq-icon ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                  <span className="faq-icon-line line-h" />
                  <span className="faq-icon-line line-v" />
                </span>
              </button>

              <div
                id={`faq-content-${idx}`}
                role="region"
                aria-labelledby={`faq-btn-${idx}`}
                className={`faq-panel ${isOpen ? 'is-open' : ''}`}
              >
                <div className="faq-answer-inner">
                  <p>{item.answer}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

