import { useEffect, useState } from 'react'

const calendlyUrl = 'https://calendly.com/antonyjoaquim/30min'

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
      location: 'Sergipe, Brazil',
      experience: '1.5 years in technology',
      services: 'Landing pages and service-based websites',
    },
    work: {
      kicker: 'Selected work',
      title: 'Projects with room to grow.',
      text: 'A small selection of concepts built around clear communication, useful interfaces and business goals.',
      view: 'View project',
      soon: 'Coming soon',
      projects: [
        { name: "Sant's Barbershop", type: 'Service-based website', description: 'A professional website concept for a barbershop, designed to showcase services and attract customers.', tags: ['Python', 'PostgreSQL', 'React'], link: '', image: '/images/Sants.png' },
        { name: 'Pulso Studio', type: 'Landing page', description: 'A modern landing page concept for a fitness training studio, focused on presenting services and attracting new members.', tags: ['HTML', 'CSS', 'React'], link: 'https://pulsostudio-theta.vercel.app/', image: '/images/Pulso.png' },
        { name: 'School Institution Website', type: 'Institutional homepage', description: 'A future concept for a school to share important information and help students find answers to their questions.', tags: ['React', 'Node.js', 'PostgreSQL'], link: '', image: '/images/School.jpeg' },
      ],
    },
    footer: { line: 'Let’s build something useful.', contact: 'Start a conversation' },
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
      introLabel: 'Localização', introValue: 'Sergipe, Brazil', stackLabel: 'Tecnologias principais', stackValue: 'HTML5 · CSS3 · JavaScript', backendLabel: 'Além da interface', backendValue: 'Python · SQL · DevOps', approachLabel: 'Forma de trabalho', approachValue: 'Extrovertido, metódico e comprometido.', availabilityLabel: 'Disponível para', availabilityValue: 'Projetos freelance e colaborações', availabilityAction: 'Vamos conversar →',
    },
    about: { kicker: 'Um pouco sobre mim', title: 'Trabalho metódico. Comunicação humana.', text: 'Sou um profissional extrovertido que leva estrutura e intenção para cada projeto. Há 1 ano e meio estudo e trabalho com tecnologia, transformando ideias em sites práticos que ajudam empresas a construir uma presença online mais forte.', location: 'Sergipe, Brazil', experience: '1 ano e meio em tecnologia', services: 'Landing pages e sites para negócios de serviços' },
    work: { kicker: 'Projetos selecionados', title: 'Projetos com espaço para crescer.', text: 'Uma seleção de conceitos construídos com comunicação clara, interfaces úteis e objetivos de negócio.', view: 'Ver projeto', soon: 'Em breve', projects: [{ name: "Sant's Barbershop", type: 'Site para serviços', description: 'Um conceito de site profissional para uma barbearia, criado para apresentar serviços e atrair clientes.', tags: ['Python', 'PostgreSQL', 'React'], link: '', image: '/images/Sants.png' }, { name: 'Pulso Studio', type: 'Landing page', description: 'Um conceito de landing page moderna para uma academia de treino, focado em apresentar serviços e atrair novos alunos.', tags: ['HTML', 'CSS', 'React'], link: 'https://pulsostudio-theta.vercel.app/', image: '/images/Pulso.png' }, { name: 'Site para instituição escolar', type: 'Homepage institucional', description: 'Um conceito futuro para uma escola compartilhar informações importantes e ajudar alunos a tirar suas dúvidas.', tags: ['React', 'Node.js', 'PostgreSQL'], link: '', image: '/images/School.jpeg' }] },
    footer: { line: 'Vamos construir algo útil.', contact: 'Iniciar uma conversa' },
  },
}

function App() {
  const [language, setLanguage] = useState('en')
  const [darkMode, setDarkMode] = useState(true)
  const t = content[language]

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const openCalendly = () => calendlyUrl ? window.open(calendlyUrl, '_blank', 'noopener,noreferrer') : scrollTo('contact')

  return (
    <main>
      <nav className="nav shell">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Go to top">AJ<span>.</span></button>
        <div className="nav-links">
          <button onClick={() => scrollTo('about')}>{t.nav.about}</button>
          <button onClick={() => scrollTo('work')}>{t.nav.work}</button>
          <button onClick={openCalendly}>{t.nav.contact}</button>
        </div>
        <div className="nav-tools">
          <button className="language" onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')} aria-label="Change language">{language === 'en' ? 'PT' : 'EN'}</button>
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle color theme">{darkMode ? '☼' : '◐'}</button>
        </div>
      </nav>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" />{t.hero.eyebrow}</p>
          <h1>{t.hero.title}</h1>
          <p className="hero-text">{t.hero.text}</p>
          <div className="hero-actions"><button className="button button-dark" onClick={() => scrollTo('work')}>{t.hero.primary} <span>↗</span></button><button className="text-button" onClick={() => scrollTo('about')}>{t.hero.secondary} <span>↓</span></button></div>
        </div>
        <div className="hero-note"><span>01</span><p>{t.grid.approachValue}</p></div>
      </section>

      <section className="bento shell" aria-label="Profile highlights">
        <article className="bento-card bento-large dark-card"><span className="card-label">{t.grid.introLabel}</span><strong>{t.grid.introValue}</strong><span className="card-mark">↘</span></article>
        <article className="bento-card"><span className="card-label">{t.grid.stackLabel}</span><strong>{t.grid.stackValue}</strong><span className="mini-line" /></article>
        <article className="bento-card"><span className="card-label">{t.grid.backendLabel}</span><strong>{t.grid.backendValue}</strong><span className="mini-line" /></article>
        <article className="bento-card bento-wide"><span className="card-label">{t.grid.availabilityLabel}</span><strong>{t.grid.availabilityValue}</strong><button className="card-link" onClick={openCalendly}>{t.grid.availabilityAction}</button></article>
      </section>

      <section id="about" className="about shell section-grid"><div><p className="kicker">{t.about.kicker}</p><h2>{t.about.title}</h2></div><div className="about-body"><p>{t.about.text}</p><div className="facts"><span>{t.about.location}</span><span>{t.about.experience}</span><span>{t.about.services}</span></div></div></section>

      <section id="work" className="work shell"><div className="section-heading"><div><p className="kicker">{t.work.kicker}</p><h2>{t.work.title}</h2></div><p>{t.work.text}</p></div><div className="project-grid">{t.work.projects.map((project, index) => <article className={`project-card project-${index + 1}`} key={project.name}><div className="project-image">{project.image ? <img src={project.image} alt={`${project.name} preview`} /> : <><span>{String(index + 1).padStart(2, '0')}</span><span className="project-shape" /></>}</div><div className="project-info"><div><p className="project-type">{project.type}</p><h3>{project.name}</h3></div><p>{project.description}</p><div className="project-bottom"><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.link ? <a href={project.link} target="_blank" rel="noreferrer">{t.work.view} ↗</a> : <span className="muted">{t.work.soon}</span>}</div></div></article>)}</div></section>

      <footer id="contact" className="footer shell"><p className="kicker">{t.footer.line}</p><h2>{t.footer.contact}</h2><button className="button button-light" onClick={openCalendly}>{t.hero.contact} <span>↗</span></button><div className="footer-bottom"><span>© 2026 Antony Joaquim</span><span>Web Developer · DevOps</span></div></footer>
    </main>
  )
}

export default App
