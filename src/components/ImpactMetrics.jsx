export default function ImpactMetrics({ data, onContact }) {
  if (!data) return null

  return (
    <section className="impact shell reveal-block" data-reveal aria-label="Impact metrics and quality commitment">
      <div className="section-heading">
        <div>
          <p className="kicker">{data.kicker}</p>
          <h2>{data.title}</h2>
        </div>
      </div>

      {/* 4 Commercial Impact Metric Cards */}
      <div className="impact-grid">
        {data.metrics.map((metric, idx) => (
          <article key={metric.label} className="impact-card">
            <span className="impact-index" aria-hidden="true">
              0{idx + 1}
            </span>
            <div className="impact-value">
              <span>{metric.value}</span>
            </div>
            <strong className="impact-label">{metric.label}</strong>
            <p className="impact-desc">{metric.desc}</p>
          </article>
        ))}
      </div>

      {/* Methodical Work Quality Commitment (Social Proof Banner) */}
      <div className="impact-commitment">
        <div className="commitment-content">
          <div className="commitment-badge">
            <span className="status-dot" aria-hidden="true" />
            <span>{data.commitment.badge}</span>
          </div>
          <h3>{data.commitment.title}</h3>
          <p>{data.commitment.text}</p>
        </div>
        <button
          type="button"
          className="button button-light commitment-action"
          onClick={onContact}
        >
          {data.commitment.action}
        </button>
      </div>
    </section>
  )
}

