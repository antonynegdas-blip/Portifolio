import { lazy, Suspense, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ProjectCarousel from './components/ProjectCarousel'
import ContactModal from './components/ContactModal'
import ImpactMetrics from './components/ImpactMetrics'
import FAQ from './components/FAQ'
import AllProjects from './components/AllProjects'
import { calendlyUrl, content, marqueeItems } from './data/content'

const HeroScene = lazy(() => import('./components/HeroScene'))
const AboutOrbit = lazy(() => import('./components/AboutOrbit'))

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = localStorage.getItem('portfolio_lang')
    if (saved === 'pt' || saved === 'en') return saved
    if (navigator.language && navigator.language.toLowerCase().startsWith('pt')) {
      return 'pt'
    }
  } catch {
    // Ignore storage errors safely
  }
  return 'en'
}

function getInitialTheme() {
  if (typeof window === 'undefined') return true
  try {
    const saved = localStorage.getItem('portfolio_theme')
    if (saved !== null) return saved === 'dark'
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return false
    }
  } catch {
    // Ignore storage errors safely
  }
  return true
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [darkMode, setDarkMode] = useState(getInitialTheme)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#projects') {
      return 'projects'
    }
    return 'home'
  })
  const t = content[language]

  // Synchronize browser history / URL hash (#projects) with current view
  useEffect(() => {
    const handlePopState = () => {
      const isProjects = window.location.hash === '#projects'
      setCurrentView(isProjects ? 'projects' : 'home')
      if (isProjects) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Lock body scroll and listen for Escape key / window resize when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    try {
      localStorage.setItem('portfolio_theme', darkMode ? 'dark' : 'light')
    } catch {
      // Storage fallback
    }
  }, [darkMode])

  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem('portfolio_lang', language)
    } catch {
      // Storage fallback
    }
  }, [language])

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      setIsScrolled(scrollTop > 24)
      setScrollProgress(
        docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
      )
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [currentView])

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const goToProjects = () => {
    setCurrentView('projects')
    setIsMobileMenuOpen(false)
    if (window.location.hash !== '#projects') {
      window.history.pushState(null, '', '#projects')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = (targetId = 'top') => {
    setIsMobileMenuOpen(false)
    if (currentView !== 'home') {
      setCurrentView('home')
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname)
      }
      if (targetId && targetId !== 'top') {
        setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
        }, 60)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      if (targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const openContact = () => setIsContactOpen(true)

  const handleCardSpotlight = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }

  return (
    <main className="page-root">
      {/* Ambient architectural background grid */}
      <div className="ambient-grid" aria-hidden="true" />

      {/* Top electric-lime scroll progress indicator */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      {/* Sticky glassmorphic navigation */}
      <header className={`nav-header ${isScrolled ? 'is-scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <nav className="nav shell" aria-label="Main Navigation">
          <button
            className="brand"
            onClick={() => goHome('top')}
            aria-label="Antony Joaquim - Go to top"
          >
            AJ<span>.</span>
          </button>
          <div className="nav-links">
            <button type="button" onClick={() => goHome('about')}>{t.nav.about}</button>
            <button
              type="button"
              className={currentView === 'projects' ? 'is-active-nav' : ''}
              onClick={goToProjects}
            >
              {t.nav.work}
            </button>
            <button type="button" onClick={openContact}>{t.nav.contact}</button>
          </div>
          <div className="nav-tools">
            <button
              type="button"
              className="language"
              onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
              aria-label={language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'}
            >
              {language === 'en' ? 'PT' : 'EN'}
            </button>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle color theme"
              aria-pressed={!darkMode}
            >
              <span aria-hidden="true">{darkMode ? '☼' : '◐'}</span>
            </button>
            <button
              type="button"
              className={`menu-toggle ${isMobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              <span className="menu-bar bar-1" />
              <span className="menu-bar bar-2" />
            </button>
          </div>
        </nav>

        {/* Mobile Slide-down Glassmorphic Navigation Drawer */}
        <div
          id="mobile-nav-menu"
          className={`mobile-menu-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="mobile-menu-inner shell">
            <div className="mobile-menu-links">
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => goHome('about')}
              >
                <span className="mobile-nav-num">01</span>
                <span className="mobile-nav-label">{t.nav.about}</span>
                <span className="mobile-nav-arrow" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="mobile-nav-item"
                onClick={goToProjects}
              >
                <span className="mobile-nav-num">02</span>
                <span className="mobile-nav-label">{t.nav.work}</span>
                <span className="mobile-nav-arrow" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openContact()
                }}
              >
                <span className="mobile-nav-num">03</span>
                <span className="mobile-nav-label">{t.nav.contact}</span>
                <span className="mobile-nav-arrow" aria-hidden="true">→</span>
              </button>
            </div>

            <div className="mobile-menu-footer">
              <div className="mobile-menu-status">
                <span className="status-dot" aria-hidden="true" />
                <span>{t.grid.availabilityValue}</span>
              </div>
              <button
                type="button"
                className="button button-dark mobile-cta-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openContact()
                }}
              >
                {t.hero.contact} <span className="btn-arrow" aria-hidden="true">↗</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {currentView === 'projects' ? (
        <AllProjects
          data={t.allProjects}
          onBack={() => goHome('top')}
          onContact={openContact}
        />
      ) : (
        <>
          {/* Hero Section with Interactive Three.js Kinetic Sculpture */}
          <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow hero-stagger-1">
            <span className="status-dot" aria-hidden="true" />
            {t.hero.eyebrow}
          </p>
          <h1 className="hero-stagger-2">{t.hero.title}</h1>
          <p className="hero-text hero-stagger-3">{t.hero.text}</p>
          <div className="hero-actions hero-stagger-4">
            <button
              type="button"
              className="button button-dark"
              onClick={() => scrollTo('work')}
            >
              {t.hero.primary} <span className="btn-arrow" aria-hidden="true">↗</span>
            </button>
            <button
              type="button"
              className="text-button"
              onClick={() => scrollTo('about')}
            >
              {t.hero.secondary} <span className="btn-arrow-down" aria-hidden="true">↓</span>
            </button>
          </div>
        </div>

        <div className="hero-visual-col hero-stagger-3">
          <Suspense fallback={<div className="hero-canvas-wrap" aria-hidden="true" />}>
            <HeroScene darkMode={darkMode} />
          </Suspense>
          <div className="hero-note">
            <span aria-hidden="true">01</span>
            <p>{t.grid.approachValue}</p>
          </div>
        </div>
      </section>

      {/* Bento Highlights with Cursor-Reactive Spotlight */}
      <section
        className="bento shell reveal-block"
        data-reveal
        aria-label="Profile highlights"
      >
        <article
          className="bento-card bento-large dark-card"
          onMouseMove={handleCardSpotlight}
        >
          <span className="card-label">{t.grid.introLabel}</span>
          <strong>{t.grid.introValue}</strong>
          <span className="card-mark" aria-hidden="true">↘</span>
        </article>
        <article className="bento-card" onMouseMove={handleCardSpotlight}>
          <span className="card-label">{t.grid.stackLabel}</span>
          <strong>{t.grid.stackValue}</strong>
          <span className="mini-line" aria-hidden="true" />
        </article>
        <article className="bento-card" onMouseMove={handleCardSpotlight}>
          <span className="card-label">{t.grid.backendLabel}</span>
          <strong>{t.grid.backendValue}</strong>
          <span className="mini-line" aria-hidden="true" />
        </article>
        <article
          className="bento-card bento-wide"
          onMouseMove={handleCardSpotlight}
        >
          <div className="bento-wide-copy">
            <span className="card-label">{t.grid.availabilityLabel}</span>
            <strong>{t.grid.availabilityValue}</strong>
          </div>
          <button type="button" className="card-link" onClick={openContact}>
            {t.grid.availabilityAction}
          </button>
        </article>
      </section>

      {/* Kinetic Editorial Tech Ticker */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((tech, idx) => (
            <span className="marquee-item" key={`${tech}-${idx}`}>
              {tech}
              <i className="marquee-dot">✦</i>
            </span>
          ))}
        </div>
      </div>

      {/* Commercial Impact Metrics & Quality Guarantee Commitment */}
      <ImpactMetrics data={t.impact} onContact={openContact} />

      {/* About Section with 3D Planetary Orbital Information System */}
      <section id="about" className="about shell reveal-block" data-reveal>
        <div className="about-header">
          <div className="about-title-col">
            <p className="kicker">{t.about.kicker}</p>
            <h2>{t.about.title}</h2>
          </div>
          <div className="about-bio-col">
            <p>{t.about.text}</p>
            <div className="social-links">
              <a
                href="https://www.linkedin.com/in/antony-joaquim-0171b4402/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Antony Joaquim on LinkedIn"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://github.com/antonynegdas-blip"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Antony Joaquim on GitHub"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <Suspense
          fallback={<div className="about-orbit-wrapper" style={{ minHeight: 560 }} />}
        >
          <AboutOrbit
            items={t.about.orbitItems}
            darkMode={darkMode}
            labels={t.about.orbitLabels}
          />
        </Suspense>
      </section>

      {/* Selected Work Section with Centered Infinite-Loop Carousel */}
      <section id="work" className="work shell reveal-block" data-reveal>
        <div className="section-heading">
          <div>
            <p className="kicker">{t.work.kicker}</p>
            <h2>{t.work.title}</h2>
          </div>
          <p>{t.work.text}</p>
        </div>

        <ProjectCarousel
          projects={t.work.projects}
          viewLabel={t.work.view}
          soonLabel={t.work.soon}
          prevLabel={t.work.prev}
          nextLabel={t.work.next}
          liveLabel={t.work.live}
          conceptLabel={t.work.concept}
        />

        <div className="work-all-action">
          <button
            type="button"
            className="button button-dark work-all-btn"
            onClick={goToProjects}
          >
            {t.work.viewAll} <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </section>

          {/* Frequently Asked Questions Accordion */}
          <FAQ data={t.faq} />
        </>
      )}

      {/* Living Footer */}
      <footer id="contact" className="footer shell reveal-block" data-reveal>
        <div className="footer-cta-wrap">
          <p className="kicker">{t.footer.line}</p>
          <h2>{t.footer.contact}</h2>
          <button type="button" className="button button-light" onClick={openContact}>
            {t.hero.contact} <span className="btn-arrow" aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Antony Joaquim</span>
          <span>Web Developer · DevOps</span>
          <button
            type="button"
            className="back-top-btn"
            onClick={() => (currentView === 'home' ? scrollTo('top') : window.scrollTo({ top: 0, behavior: 'smooth' }))}
          >
            {t.footer.backTop}
          </button>
        </div>
      </footer>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        labels={t.contactModal}
        calendlyUrl={calendlyUrl}
        language={language}
      />

      <Analytics />
    </main>
  )
}

export default App
