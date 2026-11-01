import { lazy, Suspense, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import ProjectCarousel from './components/ProjectCarousel'

const HeroScene = lazy(() => import('./components/HeroScene'))
const AboutOrbit = lazy(() => import('./components/AboutOrbit'))

const calendlyUrl = 'https://calendly.com/antonyjoaquim/30min'

const marqueeItems = [
  'HTML5',
  'CSS3',
  'JAVASCRIPT',
  'REACT',
  'THREE.JS',
  'PYTHON',
  'POSTGRESQL',
  'SQL',
  'DEVOPS',
  'UI & PERFORMANCE',
]

const content = {
  en: {
    nav: { about: 'About', work: 'Work', contact: 'Contact' },
    hero: {
      eyebrow: 'Web Developer & DevOps',
      title: 'Building professional websites that help businesses grow.',
      text: 'I create thoughtful digital experiences for ambitious local businesses and entrepreneurs ready to be seen online.',
      primary: 'View my work',
      secondary: 'About me',
      contact: 'Get in touch',
    },
    grid: {
      introLabel: 'Based in',
      introValue: 'Sergipe, Brazil',
      stackLabel: 'Core stack',
      stackValue: 'HTML5 · CSS3 · JavaScript',
      backendLabel: 'Beyond the interface',
      backendValue: 'Python · SQL · DevOps',
      approachLabel: 'Work approach',
      approachValue: 'Outgoing, methodical and committed.',
      availabilityLabel: 'Currently open to',
      availabilityValue: 'Freelance projects and collaborations',
      availabilityAction: 'Let’s talk →',
    },
    about: {
      kicker: 'A little about me',
      title: 'Methodical work. Human communication.',
      text: 'I am an outgoing professional who brings structure and intention to every project. For the last 1.5 years, I have been studying and working with technology, turning ideas into practical websites that help businesses build a stronger online presence.',
      orbitLabels: {
        orbitHint: 'Interactive 3D Orbit · Hover or click any node',
        pause: 'Pause',
        resume: 'Orbit',
      },
      orbitItems: [
        {
          id: 'location',
          label: 'Location',
          value: 'Sergipe, Brazil',
          detail: 'Working locally and remotely with businesses ready to expand their digital footprint.',
        },
        {
          id: 'experience',
          label: 'Experience',
          value: '1.5 years in tech',
          detail: 'Dedicated continuous study and hands-on delivery across web interfaces and infrastructure.',
        },
        {
          id: 'services',
          label: 'Specialty',
          value: 'Landing Pages & Sites',
          detail: 'High-clarity landing pages and service-based websites crafted to convert visitors into clients.',
        },
        {
          id: 'frontend',
          label: 'Frontend',
          value: 'React · JS · Three.js',
          detail: 'Responsive, modern interfaces built with HTML5, CSS3, JavaScript, React and interactive 3D.',
        },
        {
          id: 'backend',
          label: 'Backend & Infra',
          value: 'Python · SQL · DevOps',
          detail: 'Structured data, reliable deployments and practical automation beyond the visual layer.',
        },
        {
          id: 'mindset',
          label: 'Work Mindset',
          value: 'Outgoing & Methodical',
          detail: 'Clear human communication combined with organized processes from briefing to launch.',
        },
      ],
    },
    work: {
      kicker: 'Selected work',
      title: 'Projects with room to grow.',
      text: 'A small selection of concepts built around clear communication, useful interfaces and business goals.',
      view: 'View project',
      soon: 'Coming soon',
      prev: 'Previous project',
      next: 'Next project',
      live: 'Live',
      concept: 'Concept',
      projects: [
        {
          name: "Sant's Barbershop",
          type: 'Service-based website',
          description:
            'A professional website concept for a barbershop, designed to showcase services and attract customers.',
          tags: ['Python', 'PostgreSQL', 'React'],
          link: '',
          image: '/images/Sants.png',
        },
        {
          name: 'Pulso Studio',
          type: 'Landing page',
          description:
            'A modern landing page concept for a fitness training studio, focused on presenting services and attracting new members.',
          tags: ['HTML', 'CSS', 'React'],
          link: 'https://pulsostudio-theta.vercel.app/',
          image: '/images/Pulso.png',
        },
        {
          name: 'School Institution Website',
          type: 'Institutional homepage',
          description:
            'A future concept for a school to share important information and help students find answers to their questions.',
          tags: ['React', 'Node.js', 'PostgreSQL'],
          link: '',
          image: '/images/School.jpeg',
          fitMode: 'cover',
        },
      ],
    },
    footer: {
      line: 'Let’s build something useful.',
      contact: 'Start a conversation',
      backTop: 'Back to top ↑',
    },
  },
  pt: {
    nav: { about: 'Sobre', work: 'Projetos', contact: 'Contato' },
    hero: {
      eyebrow: 'Desenvolvedor Web e DevOps',
      title: 'Criando sites profissionais que ajudam empresas a crescer.',
      text: 'Crio experiências digitais pensadas para negócios locais e empreendedores que querem ser vistos na internet.',
      primary: 'Ver meus projetos',
      secondary: 'Sobre mim',
      contact: 'Entrar em contato',
    },
    grid: {
      introLabel: 'Localização',
      introValue: 'Sergipe, Brasil',
      stackLabel: 'Tecnologias principais',
      stackValue: 'HTML5 · CSS3 · JavaScript',
      backendLabel: 'Além da interface',
      backendValue: 'Python · SQL · DevOps',
      approachLabel: 'Forma de trabalho',
      approachValue: 'Extrovertido, metódico e comprometido.',
      availabilityLabel: 'Disponível para',
      availabilityValue: 'Projetos freelance e colaborações',
      availabilityAction: 'Vamos conversar →',
    },
    about: {
      kicker: 'Um pouco sobre mim',
      title: 'Trabalho metódico. Comunicação humana.',
      text: 'Sou um profissional extrovertido que leva estrutura e intenção para cada projeto. Há 1 ano e meio estudo e trabalho com tecnologia, transformando ideias em sites práticos que ajudam empresas a construir uma presença online mais forte.',
      orbitLabels: {
        orbitHint: 'Órbita 3D Interativa · Passe o mouse ou clique em um item',
        pause: 'Pausar',
        resume: 'Girar',
      },
      orbitItems: [
        {
          id: 'location',
          label: 'Localização',
          value: 'Sergipe, Brasil',
          detail: 'Atendendo negócios locais e clientes remotos que buscam fortalecer sua presença digital.',
        },
        {
          id: 'experience',
          label: 'Experiência',
          value: '1,5 ano em tecnologia',
          detail: 'Estudo contínuo e prática construindo interfaces web modernas, APIs e infraestrutura.',
        },
        {
          id: 'services',
          label: 'Especialidade',
          value: 'Landing Pages e Sites',
          detail: 'Landing pages e sites para negócios de serviços pensados para atrair e converter clientes.',
        },
        {
          id: 'frontend',
          label: 'Frontend',
          value: 'React · JS · Three.js',
          detail: 'Interfaces rápidas, responsivas e interativas com HTML5, CSS3, JavaScript, React e 3D.',
        },
        {
          id: 'backend',
          label: 'Backend e Infra',
          value: 'Python · SQL · DevOps',
          detail: 'Dados bem estruturados, deploy confiável e automação prática além do visual.',
        },
        {
          id: 'mindset',
          label: 'Perfil',
          value: 'Extrovertido e Metódico',
          detail: 'Comunicação clara e próxima unida a organização técnica do início à entrega.',
        },
      ],
    },
    work: {
      kicker: 'Projetos selecionados',
      title: 'Projetos com espaço para crescer.',
      text: 'Uma seleção de conceitos construídos com comunicação clara, interfaces úteis e objetivos de negócio.',
      view: 'Ver projeto',
      soon: 'Em breve',
      prev: 'Projeto anterior',
      next: 'Próximo projeto',
      live: 'No ar',
      concept: 'Conceito',
      projects: [
        {
          name: "Sant's Barbershop",
          type: 'Site para serviços',
          description:
            'Um conceito de site profissional para uma barbearia, criado para apresentar serviços e atrair clientes.',
          tags: ['Python', 'PostgreSQL', 'React'],
          link: '',
          image: '/images/Sants.png',
        },
        {
          name: 'Pulso Studio',
          type: 'Landing page',
          description:
            'Um conceito de landing page moderna para uma academia de treino, focado em apresentar serviços e atrair novos alunos.',
          tags: ['HTML', 'CSS', 'React'],
          link: 'https://pulsostudio-theta.vercel.app/',
          image: '/images/Pulso.png',
        },
        {
          name: 'Site para instituição escolar',
          type: 'Homepage institucional',
          description:
            'Um conceito futuro para uma escola compartilhar informações importantes e ajudar alunos a tirar suas dúvidas.',
          tags: ['React', 'Node.js', 'PostgreSQL'],
          link: '',
          image: '/images/School.jpeg',
          fitMode: 'cover',
        },
      ],
    },
    footer: {
      line: 'Vamos construir algo útil.',
      contact: 'Iniciar uma conversa',
      backTop: 'Voltar ao topo ↑',
    },
  },
}

function App() {
  const [language, setLanguage] = useState('en')
  const [darkMode, setDarkMode] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const t = content[language]

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

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
  }, [])

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const openCalendly = () =>
    calendlyUrl
      ? window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
      : scrollTo('contact')

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
      <header className={`nav-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <nav className="nav shell">
          <button
            className="brand"
            onClick={() => scrollTo('top')}
            aria-label="Go to top"
          >
            AJ<span>.</span>
          </button>
          <div className="nav-links">
            <button onClick={() => scrollTo('about')}>{t.nav.about}</button>
            <button onClick={() => scrollTo('work')}>{t.nav.work}</button>
            <button onClick={openCalendly}>{t.nav.contact}</button>
          </div>
          <div className="nav-tools">
            <button
              className="language"
              onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
              aria-label="Change language"
            >
              {language === 'en' ? 'PT' : 'EN'}
            </button>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle color theme"
            >
              {darkMode ? '☼' : '◐'}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section with Interactive Three.js Kinetic Sculpture */}
      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow hero-stagger-1">
            <span className="status-dot" />
            {t.hero.eyebrow}
          </p>
          <h1 className="hero-stagger-2">{t.hero.title}</h1>
          <p className="hero-text hero-stagger-3">{t.hero.text}</p>
          <div className="hero-actions hero-stagger-4">
            <button
              className="button button-dark"
              onClick={() => scrollTo('work')}
            >
              {t.hero.primary} <span className="btn-arrow">↗</span>
            </button>
            <button className="text-button" onClick={() => scrollTo('about')}>
              {t.hero.secondary} <span className="btn-arrow-down">↓</span>
            </button>
          </div>
        </div>

        <div className="hero-visual-col hero-stagger-3">
          <Suspense fallback={<div className="hero-canvas-wrap" aria-hidden="true" />}>
            <HeroScene darkMode={darkMode} />
          </Suspense>
          <div className="hero-note">
            <span>01</span>
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
          <span className="card-mark">↘</span>
        </article>
        <article className="bento-card" onMouseMove={handleCardSpotlight}>
          <span className="card-label">{t.grid.stackLabel}</span>
          <strong>{t.grid.stackValue}</strong>
          <span className="mini-line" />
        </article>
        <article className="bento-card" onMouseMove={handleCardSpotlight}>
          <span className="card-label">{t.grid.backendLabel}</span>
          <strong>{t.grid.backendValue}</strong>
          <span className="mini-line" />
        </article>
        <article
          className="bento-card bento-wide"
          onMouseMove={handleCardSpotlight}
        >
          <div className="bento-wide-copy">
            <span className="card-label">{t.grid.availabilityLabel}</span>
            <strong>{t.grid.availabilityValue}</strong>
          </div>
          <button className="card-link" onClick={openCalendly}>
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
                rel="noreferrer"
                aria-label="Antony Joaquim on LinkedIn"
              >
                LinkedIn <span>↗</span>
              </a>
              <a
                href="https://github.com/antonynegdas-blip"
                target="_blank"
                rel="noreferrer"
                aria-label="Antony Joaquim on GitHub"
              >
                GitHub <span>↗</span>
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
      </section>

      {/* Living Footer */}
      <footer id="contact" className="footer shell reveal-block" data-reveal>
        <div className="footer-cta-wrap">
          <p className="kicker">{t.footer.line}</p>
          <h2>{t.footer.contact}</h2>
          <button className="button button-light" onClick={openCalendly}>
            {t.hero.contact} <span className="btn-arrow">↗</span>
          </button>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Antony Joaquim</span>
          <span>Web Developer · DevOps</span>
          <button
            type="button"
            className="back-top-btn"
            onClick={() => scrollTo('top')}
          >
            {t.footer.backTop}
          </button>
        </div>
      </footer>

      <Analytics />
    </main>
  )
}

export default App
