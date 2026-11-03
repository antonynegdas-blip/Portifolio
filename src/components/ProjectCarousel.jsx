import { useRef, useState } from 'react'

export default function ProjectCarousel({
  projects,
  viewLabel,
  soonLabel,
  prevLabel = 'Previous project',
  nextLabel = 'Next project',
  liveLabel = 'Live',
  conceptLabel = 'Concept',
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState('next')
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })
  const [isMouseActive, setIsMouseActive] = useState(false)
  const touchStartX = useRef(null)
  const mouseStartX = useRef(null)
  const isDragging = useRef(false)

  const total = projects.length
  if (!total) return null

  const prevIndex = (activeIndex - 1 + total) % total
  const nextIndex = (activeIndex + 1) % total

  const activeProject = projects[activeIndex]
  const prevProject = projects[prevIndex]
  const nextProject = projects[nextIndex]

  const goNext = () => {
    setDirection('next')
    setActiveIndex((prev) => (prev + 1) % total)
  }

  const goPrev = () => {
    setDirection('prev')
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }

  const goTo = (index) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 'next' : 'prev')
    setActiveIndex(index)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goNext()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goPrev()
    }
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = touchStartX.current - endX
    if (Math.abs(delta) > 42) {
      if (delta > 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    // Don't drag if clicking directly on a button or interactive element
    if (e.target.closest('button, a')) return
    mouseStartX.current = e.clientX
    isDragging.current = true
    setIsMouseActive(true)
    if (window.getSelection) {
      window.getSelection().removeAllRanges()
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging.current && mouseStartX.current !== null) {
      e.preventDefault()
    }
  }

  const handleMouseUp = (e) => {
    if (!isDragging.current || mouseStartX.current === null) {
      isDragging.current = false
      setIsMouseActive(false)
      return
    }
    const delta = mouseStartX.current - e.clientX
    if (Math.abs(delta) > 42) {
      if (delta > 0) goNext()
      else goPrev()
    }
    mouseStartX.current = null
    isDragging.current = false
    setIsMouseActive(false)
  }

  const handleMouseLeave = () => {
    mouseStartX.current = null
    isDragging.current = false
    setIsMouseActive(false)
    resetCardTilt()
  }

  const handleCardMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({
      rx: (0.5 - py) * 7,
      ry: (px - 0.5) * 9,
      gx: px * 100,
      gy: py * 100,
      active: true,
    })
  }

  const resetCardTilt = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })
  }

  return (
    <div
      className="carousel-root"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label="Selected projects carousel"
    >
      {/* Top Visual Stage: Peeking Side Previews + Centered Active Image + Loop Arrows */}
      <div
        className={`carousel-stage ${isMouseActive ? 'is-dragging' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Previous peeking project (loops cleanly) */}
        {total > 1 && (
          <button
            type="button"
            className="carousel-peek carousel-peek-prev"
            onClick={goPrev}
            aria-label={`${prevLabel}: ${prevProject.name}`}
            tabIndex={-1}
          >
            <div
              className={`carousel-peek-frame ${prevProject.fitMode === 'cover' ? 'is-cover' : ''}`}
            >
              {prevProject.image ? (
                <img src={prevProject.image} alt="" loading="lazy" decoding="async" draggable={false} />
              ) : (
                <span className="carousel-placeholder-num">
                  {String(prevIndex + 1).padStart(2, '0')}
                </span>
              )}
              <div className="carousel-peek-overlay">
                <span>{prevProject.name}</span>
              </div>
            </div>
          </button>
        )}

        {/* Left Loop Arrow Button */}
        <button
          type="button"
          className="carousel-arrow carousel-arrow-prev"
          onClick={goPrev}
          aria-label={prevLabel}
        >
          <span aria-hidden="true">←</span>
        </button>

        {/* Centered Active Project Image */}
        <div
          className="carousel-center-wrap"
          onMouseMove={handleCardMove}
          onMouseLeave={resetCardTilt}
        >
          <div
            key={`${activeProject.name}-${activeIndex}`}
            className={`carousel-active-media ${activeProject.fitMode === 'cover' ? 'is-cover' : ''} anim-${direction}`}
            style={{
              transform: tilt.active
                ? `perspective(1100px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
                : 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            }}
          >
            {activeProject.fitMode === 'cover' ? (
              <>
                <div className="carousel-media-badges">
                  <span className="carousel-counter-floating">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(total).padStart(2, '0')}
                  </span>
                  <span
                    className={`carousel-status-floating ${activeProject.link ? 'is-live' : ''}`}
                  >
                    {activeProject.link && <span className="carousel-live-dot" />}
                    {activeProject.link ? liveLabel : conceptLabel}
                  </span>
                </div>

                {activeProject.image ? (
                  <img
                    src={activeProject.image}
                    alt={`${activeProject.name} preview`}
                    className="carousel-cover-img"
                    decoding="async"
                    draggable={false}
                  />
                ) : (
                  <div className="carousel-fallback-art">
                    <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                    <span className="project-shape" />
                  </div>
                )}

                <div
                  className="carousel-glare"
                  style={{
                    opacity: tilt.active ? 1 : 0,
                    background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(199, 255, 74, 0.16), transparent 58%)`,
                  }}
                />
              </>
            ) : (
              <>
                <div className="carousel-frame-bar">
                  <div className="carousel-frame-left">
                    <span className="carousel-window-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="carousel-counter">
                      {String(activeIndex + 1).padStart(2, '0')} /{' '}
                      {String(total).padStart(2, '0')}
                    </span>
                  </div>
                  <span
                    className={`carousel-status-pill ${activeProject.link ? 'is-live' : ''}`}
                  >
                    {activeProject.link && <span className="carousel-live-dot" />}
                    {activeProject.link ? liveLabel : conceptLabel}
                  </span>
                </div>

                <div className="carousel-image-stage">
                  {activeProject.image ? (
                    <>
                      <img
                        src={activeProject.image}
                        alt=""
                        aria-hidden="true"
                        className="carousel-ambient-img"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <img
                        src={activeProject.image}
                        alt={`${activeProject.name} preview`}
                        className="carousel-main-img"
                        decoding="async"
                        draggable={false}
                      />
                    </>
                  ) : (
                    <div className="carousel-fallback-art">
                      <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                      <span className="project-shape" />
                    </div>
                  )}

                  <div
                    className="carousel-glare"
                    style={{
                      opacity: tilt.active ? 1 : 0,
                      background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(199, 255, 74, 0.14), transparent 58%)`,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Loop Arrow Button */}
        <button
          type="button"
          className="carousel-arrow carousel-arrow-next"
          onClick={goNext}
          aria-label={nextLabel}
        >
          <span aria-hidden="true">→</span>
        </button>

        {/* Next peeking project (loops cleanly) */}
        {total > 1 && (
          <button
            type="button"
            className="carousel-peek carousel-peek-next"
            onClick={goNext}
            aria-label={`${nextLabel}: ${nextProject.name}`}
            tabIndex={-1}
          >
            <div
              className={`carousel-peek-frame ${nextProject.fitMode === 'cover' ? 'is-cover' : ''}`}
            >
              {nextProject.image ? (
                <img src={nextProject.image} alt="" loading="lazy" decoding="async" draggable={false} />
              ) : (
                <span className="carousel-placeholder-num">
                  {String(nextIndex + 1).padStart(2, '0')}
                </span>
              )}
              <div className="carousel-peek-overlay">
                <span>{nextProject.name}</span>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Pagination Step Indicators */}
      <div className="carousel-dots" role="tablist" aria-label="Projects">
        {projects.map((proj, idx) => (
          <button
            key={proj.name}
            type="button"
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`${idx + 1}: ${proj.name}`}
            className={`carousel-dot ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => goTo(idx)}
          >
            <span className="carousel-dot-num">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <span className="carousel-dot-bar" />
          </button>
        ))}
      </div>

      {/* Description & Metadata Panel Directly Underneath the Project Images */}
      <article
        key={`info-${activeProject.name}-${activeIndex}`}
        className={`carousel-details-panel anim-info-${direction}`}
      >
        <div className="carousel-details-header">
          <div>
            <p className="project-type">{activeProject.type}</p>
            <h3>{activeProject.name}</h3>
          </div>
          {activeProject.link ? (
            <a
              href={activeProject.link}
              target="_blank"
              rel="noreferrer"
              className="button button-light carousel-cta"
            >
              {viewLabel} <span>↗</span>
            </a>
          ) : (
            <span className="carousel-soon-badge">{soonLabel}</span>
          )}
        </div>

        <p className="carousel-description">{activeProject.description}</p>

        <div className="carousel-details-footer">
          <div className="tags">
            {activeProject.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="carousel-quick-nav">
            <button type="button" onClick={goPrev} aria-label={prevLabel}>
              ← {prevProject.name}
            </button>
            <span className="carousel-sep">/</span>
            <button type="button" onClick={goNext} aria-label={nextLabel}>
              {nextProject.name} →
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
