export default function AllProjects({ data, onBack, onContact }) {
  if (!data) return null

  const { sections } = data

  const renderProjectCard = (project, idx, isVibe = false) => {
    const isLive = Boolean(project.link)

    return (
      <article
        key={`${project.name}-${idx}`}
        className={`all-project-card ${isVibe ? 'is-vibe-card' : ''}`}
      >
        <div className="all-project-media">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name} preview`}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={`all-project-img ${project.fitMode === 'cover' ? 'is-cover' : ''}`}
            />
          ) : (
            <div className="all-project-fallback">
              <span>{String(idx + 1).padStart(2, '0')}</span>
            </div>
          )}

          <div className="all-project-badges">
            <span className={`all-project-status ${isLive ? 'is-live' : ''}`}>
              {isLive && <span className="status-live-dot" aria-hidden="true" />}
              {isLive ? data.live : data.concept}
            </span>
            {isVibe && (
              <span className="all-project-vibe-tag" aria-label="Built with Vibe Coding">
                ⚡ Vibe Coding
              </span>
            )}
          </div>
        </div>

        <div className="all-project-body">
          <p className="all-project-type">{project.type}</p>
          <h3 className="all-project-title">{project.name}</h3>
          <p className="all-project-desc">{project.description}</p>

          <div className="all-project-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="all-project-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="all-project-footer">
          {isLive ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-dark all-project-cta"
            >
              {data.view} <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="all-project-soon">{data.soon}</span>
          )}
        </div>
      </article>
    )
  }

  return (
    <div className="all-projects-view shell">
      {/* Top Breadcrumb & Page Header */}
      <header className="all-projects-header">
        <button
          type="button"
          className="all-projects-back-btn"
          onClick={onBack}
          aria-label={data.backHome}
        >
          <span aria-hidden="true">←</span> {data.backHome}
        </button>

        <div className="all-projects-title-block">
          <p className="eyebrow">
            <span className="status-dot" aria-hidden="true" />
            {data.kicker}
          </p>
          <h1 className="all-projects-heading">{data.title}</h1>
          <p className="all-projects-subtitle">{data.subtitle}</p>
        </div>
      </header>

      {/* Section 1: Feitos por mim / Built by me */}
      <section className="all-projects-section" aria-label={sections.builtByMe.title}>
        <div className="all-projects-section-header">
          <div className="section-badge-wrap">
            <span className="section-category-badge">{sections.builtByMe.badge}</span>
            <h2>{sections.builtByMe.title}</h2>
          </div>
          <p>{sections.builtByMe.subtitle}</p>
        </div>

        <div className="all-projects-grid">
          {sections.builtByMe.projects.map((proj, idx) =>
            renderProjectCard(proj, idx, false)
          )}
        </div>
      </section>

      {/* Section 2: Vibe Coding */}
      <section className="all-projects-section vibe-section" aria-label={sections.vibeCoding.title}>
        <div className="all-projects-section-header">
          <div className="section-badge-wrap">
            <span className="section-category-badge vibe-badge">
              ⚡ {sections.vibeCoding.badge}
            </span>
            <h2>{sections.vibeCoding.title}</h2>
          </div>
          <p>{sections.vibeCoding.subtitle}</p>
        </div>

        <div className="all-projects-grid">
          {sections.vibeCoding.projects.map((proj, idx) =>
            renderProjectCard(proj, idx, true)
          )}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <div className="all-projects-cta-card">
        <div>
          <p className="kicker">{data.cta.kicker}</p>
          <h3>{data.cta.title}</h3>
          <p>{data.cta.text}</p>
        </div>
        <button
          type="button"
          className="button button-light"
          onClick={onContact}
        >
          {data.cta.button} <span className="btn-arrow" aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  )
}
