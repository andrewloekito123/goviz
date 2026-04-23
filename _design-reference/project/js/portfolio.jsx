// ============================================================
// DATA
// ============================================================
const PROJECTS = [
  {
    id: '1', title: 'Meridian House', year: '2024',
    location: 'Copenhagen, Denmark', category: 'Residential',
    description: 'A study in light, threshold, and materiality. Meridian House explores the dialogue between solid and void through a sequence of carefully calibrated spaces that shift with the arc of the sun. Concrete, glass, and raw timber define a language of honest construction.',
    tags: ['Residential', 'Concrete', 'Net Zero'],
    patternAngle: 45, patternColor: '#bcc5e8', bgColor: '#1a1d2e',
  },
  {
    id: '2', title: 'Axis Cultural Center', year: '2023',
    location: 'Oslo, Norway', category: 'Cultural',
    description: 'A civic landmark designed around the concept of convergence — where public life, art, and urban infrastructure intersect in a single cohesive gesture. The building folds inward to create a sheltered public plaza, blurring the boundary between inside and out.',
    tags: ['Cultural', 'Public', 'Urban'],
    patternAngle: 0, patternColor: '#c8b8e0', bgColor: '#1e1a2d',
  },
  {
    id: '3', title: 'Parallax Tower', year: '2023',
    location: 'Berlin, Germany', category: 'Commercial',
    description: 'A mixed-use high-rise that challenges the static tower typology. Each floor plate is slightly rotated, creating a continuous twist that animates the facade while optimising daylight penetration to every workspace.',
    tags: ['Commercial', 'High-rise', 'Mixed-use'],
    patternAngle: 90, patternColor: '#b8d4c0', bgColor: '#1a2520',
  },
  {
    id: '4', title: 'Ground Pavilion', year: '2022',
    location: 'Stockholm, Sweden', category: 'Public',
    description: 'A temporary installation that became permanent. The Ground Pavilion mediates between a historic waterfront and a new urban park, offering a porous structure that serves as stage, shelter, and observatory simultaneously.',
    tags: ['Public', 'Pavilion', 'Landscape'],
    patternAngle: 30, patternColor: '#e0d0a8', bgColor: '#2a2410',
  },
  {
    id: '5', title: 'Threshold Residence', year: '2022',
    location: 'Helsinki, Finland', category: 'Residential',
    description: 'Sited on the edge of a boreal forest, this private residence negotiates between domesticity of the interior and wildness of the landscape through threshold spaces — covered terraces, screened rooms, and framed vistas.',
    tags: ['Residential', 'Timber', 'Landscape'],
    patternAngle: 60, patternColor: '#d0c0b8', bgColor: '#251e1a',
  },
  {
    id: '6', title: 'Node Research Hub', year: '2021',
    location: 'Amsterdam, Netherlands', category: 'Research',
    description: 'A collaborative research facility conceived as a network of interlocking volumes. Each node is purpose-designed for a specific mode of thinking — from focused solitary work to spontaneous cross-disciplinary collision.',
    tags: ['Research', 'Academic', 'Modular'],
    patternAngle: 15, patternColor: '#b8ccd8', bgColor: '#151e28',
  },
];

const TEAM = [
  { name: 'Elara Voss', role: 'Founding Principal', bio: '20 years shaping civic and cultural architecture across Scandinavia and Central Europe.', accent: '#d0d8f0' },
  { name: 'Marcus Holm', role: 'Design Director', bio: 'Leads conceptual and computational design from first sketch through to final detail.', accent: '#d8d0f0' },
  { name: 'Priya Rao', role: 'Technical Director', bio: 'Oversees engineering integration, sustainability certifications, and project delivery.', accent: '#d0f0d8' },
  { name: 'Tomas Lind', role: 'Associate', bio: 'Specialises in facade systems, material research, and digital fabrication workflows.', accent: '#f0e8d0' },
];

const SERVICES = [
  { num: '01', title: 'Concept Design', desc: 'From brief to bold proposition — spatial strategy, massing, and narrative.' },
  { num: '02', title: 'Architectural Design', desc: 'Full RIBA Stage 1–5 delivery, coordinated across all disciplines.' },
  { num: '03', title: 'Interior Architecture', desc: 'Material palettes, furniture strategy, and experiential sequencing.' },
  { num: '04', title: '3D Visualisation', desc: 'Immersive renders and interactive 3D models for client communication.' },
  { num: '05', title: 'Masterplanning', desc: 'Urban-scale thinking — site strategy, phasing, and public realm design.' },
  { num: '06', title: 'Heritage & Adaptive Reuse', desc: 'Sensitive interventions within historic fabric, unlocking new life.' },
];

// ============================================================
// UTILS
// ============================================================
const { useState, useEffect, useRef, useCallback } = React;

function useReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('visible'), delay); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

// GoViz logo mark (SVG recreation of the geometric angular G mark)
function GoVizMark({ size = 28, color = '#032bff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer frame with chamfered top-left corner */}
      <path d="
        M 28 14
        L 86 14
        L 86 86
        L 14 86
        L 14 40
        L 28 14
        Z
        M 28 28
        L 28 72
        L 72 72
        L 72 56
        L 54 56
        L 54 48
        L 72 48
        L 72 28
        Z
      " fill={color} fillRule="evenodd"/>
      {/* Diagonal accent at top-left corner */}
      <path d="M 14 40 L 28 14 L 28 28 L 14 40 Z" fill={color} opacity="0.5"/>
    </svg>
  );
}

function ProjectPattern({ project }) {
  const id = `pat-${project.id}`;
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 270" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${project.patternAngle})`}>
          <line x1="0" y1="0" x2="0" y2="36" stroke={project.patternColor} strokeWidth="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="400" height="270" fill={project.bgColor}/>
      <rect width="400" height="270" fill={`url(#${id})`}/>
      {/* Architectural plan lines */}
      <line x1="40" y1="40" x2="160" y2="40" stroke={project.patternColor} strokeWidth="1" opacity="0.25"/>
      <line x1="40" y1="40" x2="40" y2="140" stroke={project.patternColor} strokeWidth="1" opacity="0.25"/>
      <rect x="40" y="40" width="120" height="100" fill="none" stroke={project.patternColor} strokeWidth="0.8" opacity="0.2"/>
      <rect x="60" y="60" width="60" height="50" fill={project.patternColor} opacity="0.07"/>
      <text x="200" y="145" textAnchor="middle"
        fontFamily="'Space Grotesk', monospace" fontSize="9" fill={project.patternColor}
        opacity="0.4" letterSpacing="5">{project.category.toUpperCase()}</text>
    </svg>
  );
}

// ============================================================
// NAV
// ============================================================
function Nav({ onNav, activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { label: 'Work', id: 'projects' },
    { label: 'Studio', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
      padding: '0 48px', height: 72,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(247,246,242,0.94)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid #dddbd3' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <button onClick={() => onNav('hero')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, padding: 0,
      }}>
        <GoVizMark size={32} color={scrolled ? '#032bff' : '#032bff'} />
        <span style={{
          fontWeight: 700, fontSize: 17, letterSpacing: '0.18em',
          color: scrolled ? 'var(--fg)' : '#fff', textTransform: 'uppercase',
          transition: 'color 0.4s',
        }}>GOVIZ</span>
      </button>

      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        {links.map(l => (
          <button key={l.id} onClick={() => onNav(l.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--f)', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: activeSection === l.id ? 'var(--blue)' : (scrolled ? 'var(--fg)' : 'rgba(255,255,255,0.8)'),
            transition: 'color 0.3s', padding: 0,
          }}>{l.label}</button>
        ))}
        <a href="admin.html" target="_blank" style={{
          background: 'var(--blue)', color: '#fff',
          padding: '8px 20px',
          textDecoration: 'none', fontSize: 11,
          fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          transition: 'opacity 0.2s',
        }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
           onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          Admin ↗
        </a>
      </div>
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero({ onNav }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section id="hero" data-screen-label="01 Hero" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', padding: '0 48px 72px',
      position: 'relative', overflow: 'hidden',
      background: 'var(--fg)',
    }}>
      {/* Animated grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="hgrid" width="64" height="64" patternUnits="userSpaceOnUse">
              <line x1="64" y1="0" x2="64" y2="64" stroke="white" strokeWidth="0.5"/>
              <line x1="0" y1="64" x2="64" y2="64" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)"/>
        </svg>
      </div>

      {/* Blue left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--blue)' }}/>

      {/* Top-right meta */}
      <div style={{
        position: 'absolute', top: 88, right: 48,
        display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end',
        opacity: ready ? 1 : 0, transition: 'opacity 1s ease 1s',
      }}>
        <span style={{ fontSize: 10, letterSpacing: '0.25em', color: '#444', textTransform: 'uppercase' }}>Est. 2012 · Copenhagen</span>
        <span style={{ fontSize: 10, letterSpacing: '0.25em', color: '#444', textTransform: 'uppercase' }}>Architecture & Visualisation</span>
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.35em', color: 'var(--blue)',
          textTransform: 'uppercase', fontWeight: 700, marginBottom: 28,
          opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease 0.4s',
        }}>Architecture Studio · 3D Visualisation</div>

        <h1 style={{
          fontFamily: 'var(--f)', fontWeight: 700,
          fontSize: 'clamp(52px, 9.5vw, 152px)',
          lineHeight: 0.9, letterSpacing: '-0.025em',
          color: 'var(--bg)', textTransform: 'uppercase',
          overflow: 'hidden',
        }}>
          {['Shaping', 'Space,', 'Defining'].map((word, i) => (
            <div key={word} style={{ overflow: 'hidden', display: 'block' }}>
              <span style={{
                display: 'block',
                transform: ready ? 'translateY(0)' : 'translateY(110%)',
                transition: `transform 1s cubic-bezier(0.77,0,0.18,1) ${0.3 + i * 0.12}s`,
              }}>{word}</span>
            </div>
          ))}
          <div style={{ overflow: 'hidden', display: 'block' }}>
            <span style={{
              display: 'block', color: 'var(--blue)',
              transform: ready ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1s cubic-bezier(0.77,0,0.18,1) 0.66s',
            }}>Culture.</span>
          </div>
        </h1>

        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginTop: 64, flexWrap: 'wrap', gap: 32,
        }}>
          <p style={{
            fontSize: 15, lineHeight: 1.8, color: '#666',
            maxWidth: 360, fontWeight: 300,
            opacity: ready ? 1 : 0, transition: 'opacity 0.8s ease 1.1s',
          }}>
            We design buildings and spaces that transform how people inhabit the world — from private residences to major civic landmarks.
          </p>

          <div style={{
            display: 'flex', gap: 48,
            opacity: ready ? 1 : 0, transition: 'opacity 0.8s ease 1.3s',
          }}>
            {[['48+', 'Projects'], ['12', 'Years'], ['6', 'Countries']].map(([n, l]) => (
              <div key={l} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 38, fontWeight: 700, color: 'var(--bg)', letterSpacing: '-0.03em', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 9, color: '#555', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <button onClick={() => onNav('projects')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
          marginTop: 56, padding: 0,
          opacity: ready ? 1 : 0, transition: 'opacity 0.8s ease 1.5s',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '1px solid #2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'bobDown 2.5s ease-in-out infinite',
          }}>
            <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
              <path d="M5.5 1v12M1 9l4.5 4.5L10 9" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 10, letterSpacing: '0.25em', color: '#555', textTransform: 'uppercase' }}>Scroll to explore</span>
        </button>
      </div>

      <style>{`
        @keyframes bobDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}

// ============================================================
// PROJECTS
// ============================================================
function ProjectCard({ project, onOpen, revealDelay = 0 }) {
  const ref = useReveal(revealDelay);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} className="reveal">
      <div
        onClick={() => onOpen(project)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: 'pointer', overflow: 'hidden',
          border: `1px solid ${hovered ? 'var(--blue)' : 'var(--border)'}`,
          background: 'var(--bg)',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          transition: 'border-color 0.3s, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}>
        {/* Cover image area */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '62%', overflow: 'hidden' }}>
          <ProjectPattern project={project}/>
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(3,43,255,0.6)',
            opacity: hovered ? 0.25 : 0, transition: 'opacity 0.4s ease',
          }}/>
          {/* View label */}
          <div style={{
            position: 'absolute', bottom: 16, right: 16,
            background: 'var(--blue)', color: '#fff',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '6px 12px',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'all 0.3s ease',
          }}>View →</div>
          {/* Year badge */}
          <div style={{
            position: 'absolute', top: 16, left: 16,
            fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em',
          }}>{project.year}</div>
        </div>
        {/* Card footer */}
        <div style={{ padding: '18px 22px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 5 }}>
              {project.category}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
              {project.title}
            </h3>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>{project.location}</div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: `1px solid ${hovered ? 'var(--blue)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: hovered ? 'var(--blue)' : 'var(--muted)',
            fontSize: 14, transition: 'all 0.3s', flexShrink: 0, marginTop: 2,
          }}>↗</div>
        </div>
      </div>
    </div>
  );
}

function Projects({ onOpenProject }) {
  const ref = useReveal();
  return (
    <section id="projects" data-screen-label="02 Projects" style={{ padding: '120px 48px' }}>
      <div ref={ref} className="reveal" style={{ marginBottom: 56 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>
          <span className="section-num">02</span> Selected Work
        </div>
        <h2 style={{ fontSize: 'clamp(34px,4.5vw,68px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>
          Recent Projects
        </h2>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: 2,
      }}>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} onOpen={onOpenProject} revealDelay={i * 60}/>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// PROJECT DETAIL MODAL
// ============================================================
function ProjectDetail({ project, onClose, onView3D }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 10); return () => clearTimeout(t); }, []);
  const close = () => { setVis(false); setTimeout(onClose, 450); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800 }}>
      <div onClick={close} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(12,12,10,0.55)',
        opacity: vis ? 1 : 0, transition: 'opacity 0.4s ease',
        backdropFilter: 'blur(4px)',
      }}/>
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 'min(580px, 100vw)',
        background: 'var(--bg)',
        transform: vis ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)',
        overflowY: 'auto', display: 'flex', flexDirection: 'column', zIndex: 1,
      }}>
        {/* Cover */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '54%', flexShrink: 0 }}>
          <ProjectPattern project={project}/>
          <button onClick={close} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
            width: 38, height: 38, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 16, fontFamily: 'var(--f)',
          }}>✕</button>
        </div>

        <div style={{ padding: '36px 44px', flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', color: 'var(--blue)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
            {project.category}
          </div>
          <h2 style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 6 }}>
            {project.title}
          </h2>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>
            {project.location} · {project.year}
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#444', marginBottom: 32, fontWeight: 300 }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 44 }}>
            {project.tags.map(t => (
              <span key={t} style={{
                padding: '4px 12px', border: '1px solid var(--border)',
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--muted)', fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>
          <button onClick={() => onView3D(project)} style={{
            background: 'var(--blue)', color: '#fff',
            border: 'none', cursor: 'pointer', width: '100%',
            padding: '17px 32px', fontFamily: 'var(--f)',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'opacity 0.2s',
          }} onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
             onMouseLeave={e => e.currentTarget.style.opacity='1'}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 4.5L8 8M8 8L15 4.5M8 8V15" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            View Immersive 3D Model
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ABOUT
// ============================================================
function About() {
  const ref = useReveal();
  const r2 = useReveal(150);
  return (
    <section id="about" data-screen-label="03 About" style={{ padding: '120px 48px', background: 'var(--fg)', color: 'var(--bg)' }}>
      <div ref={ref} className="reveal" style={{ marginBottom: 72 }}>
        <div className="section-label" style={{ marginBottom: 16, color: 'var(--muted)' }}>
          <span className="section-num">03</span> About the Studio
        </div>
        <h2 style={{ fontSize: 'clamp(34px,4.5vw,68px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1, maxWidth: 680 }}>
          Architecture as precise cultural act
        </h2>
      </div>
      <div ref={r2} className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
        <div>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: '#999', fontWeight: 300, marginBottom: 20 }}>
            GOVIZ was founded in 2012 with the conviction that every building is an opportunity to improve its context — socially, ecologically, and aesthetically.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#555', fontWeight: 300 }}>
            We work across scales and typologies, from intimate residences to major public infrastructure, bringing the same rigour and care to every commission. Our process is collaborative, research-led, and deeply committed to craft.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            ['Sustainability', 'Every project is held to a net-zero carbon brief from day one.'],
            ['Collaboration', 'The best buildings emerge from true co-design with clients and communities.'],
            ['Research', 'Our in-house unit drives material and spatial innovation.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ borderTop: '1px solid #1c1c1c', padding: '24px 0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 6, color: 'var(--blue)' }}>{title}</div>
              <div style={{ fontSize: 14, color: '#555', lineHeight: 1.65 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TEAM
// ============================================================
function TeamMember({ member, index }) {
  const ref = useReveal(index * 80);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="reveal">
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ border: `1px solid ${hov ? 'var(--blue)' : 'var(--border)'}`, transition: 'border-color 0.3s', overflow: 'hidden' }}>
        <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', background: member.accent }}>
          <svg width="100%" height="100%" viewBox="0 0 300 300" style={{ position: 'absolute', inset: 0 }}>
            <rect width="300" height="300" fill={member.accent}/>
            {/* Subtle architectural grid */}
            <line x1="0" y1="150" x2="300" y2="150" stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
            <line x1="150" y1="0" x2="150" y2="300" stroke="rgba(0,0,0,0.06)" strokeWidth="1"/>
            <circle cx="150" cy="105" r="52" fill="rgba(255,255,255,0.35)"/>
            <path d="M40 300 Q150 195 260 300Z" fill="rgba(255,255,255,0.18)"/>
            <text x="150" y="125" textAnchor="middle" fontSize="48" fontWeight="700"
              fontFamily="Space Grotesk,sans-serif" fill="rgba(0,0,0,0.15)">
              {member.name.split(' ').map(w => w[0]).join('')}
            </text>
          </svg>
        </div>
        <div style={{ padding: '20px 22px 24px' }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 3 }}>{member.name}</div>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--blue)', fontWeight: 700, marginBottom: 10 }}>{member.role}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{member.bio}</div>
        </div>
      </div>
    </div>
  );
}

function Team() {
  const ref = useReveal();
  return (
    <section id="team" data-screen-label="04 Team" style={{ padding: '120px 48px' }}>
      <div ref={ref} className="reveal" style={{ marginBottom: 56 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>
          <span className="section-num">04</span> People
        </div>
        <h2 style={{ fontSize: 'clamp(34px,4.5vw,68px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>
          The Team
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
        {TEAM.map((m, i) => <TeamMember key={m.name} member={m} index={i}/>)}
      </div>
    </section>
  );
}

// ============================================================
// SERVICES
// ============================================================
function ServiceCard({ service, index }) {
  const ref = useReveal(index * 55);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="reveal">
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          padding: '34px 38px', border: '1px solid var(--border)',
          background: hov ? 'var(--blue)' : 'var(--bg)',
          transition: 'background 0.35s ease', cursor: 'default',
        }}>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em',
          color: hov ? 'rgba(255,255,255,0.25)' : 'var(--blue)', marginBottom: 14, transition: 'color 0.35s' }}>
          {service.num}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8,
          color: hov ? '#fff' : 'var(--fg)', transition: 'color 0.35s' }}>
          {service.title}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7,
          color: hov ? 'rgba(255,255,255,0.7)' : 'var(--muted)', transition: 'color 0.35s' }}>
          {service.desc}
        </div>
      </div>
    </div>
  );
}

function Services() {
  const ref = useReveal();
  return (
    <section id="services" data-screen-label="05 Services" style={{ padding: '120px 48px', background: 'var(--bg)' }}>
      <div ref={ref} className="reveal" style={{ marginBottom: 56 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>
          <span className="section-num">05</span> What We Do
        </div>
        <h2 style={{ fontSize: 'clamp(34px,4.5vw,68px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>
          Services
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 2 }}>
        {SERVICES.map((s, i) => <ServiceCard key={s.num} service={s} index={i}/>)}
      </div>
    </section>
  );
}

// ============================================================
// CONTACT
// ============================================================
function Contact() {
  const ref = useReveal();
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);
  const inputS = {
    width: '100%', border: 'none', borderBottom: '1px solid #1e1e1e',
    background: 'transparent', padding: '13px 0',
    fontFamily: 'var(--f)', fontSize: 14, color: 'var(--bg)',
    outline: 'none',
  };
  return (
    <section id="contact" data-screen-label="06 Contact" style={{ padding: '120px 48px', background: 'var(--fg)', color: 'var(--bg)' }}>
      <div ref={ref} className="reveal">
        <div className="section-label" style={{ marginBottom: 16, color: 'var(--muted)' }}>
          <span className="section-num">06</span> Get in Touch
        </div>
        <h2 style={{ fontSize: 'clamp(34px,4.5vw,68px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1, marginBottom: 72 }}>
          Start a Project
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 15, color: '#555', lineHeight: 1.8, fontWeight: 300, marginBottom: 44 }}>
              We take on a limited number of projects each year to ensure exceptional attention to each commission. We'd love to hear about yours.
            </p>
            {[['Email', 'studio@goviz.dk'], ['Phone', '+45 33 12 34 56'], ['Address', 'Vesterbrogade 44\n1620 Copenhagen, DK']].map(([l, v]) => (
              <div key={l} style={{ borderTop: '1px solid #1a1a1a', padding: '18px 0' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.25em', color: '#333', textTransform: 'uppercase', marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 14, color: '#aaa', whiteSpace: 'pre-line' }}>{v}</div>
              </div>
            ))}
          </div>
          {sent ? (
            <div style={{ padding: '40px 0' }}>
              <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 12 }}>Thank you.</div>
              <div style={{ fontSize: 15, color: '#555', fontWeight: 300 }}>We'll respond within 2 working days.</div>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {[['name','Name','text'],['email','Email','email'],['budget','Approximate Budget','text']].map(([k,l,t]) => (
                <div key={k}>
                  <label style={{ fontSize: 9, letterSpacing: '0.22em', color: '#333', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{l}</label>
                  <input type={t} required value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                    style={inputS}
                    onFocus={e => e.target.style.borderBottomColor='var(--blue)'}
                    onBlur={e => e.target.style.borderBottomColor='#1e1e1e'}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize: 9, letterSpacing: '0.22em', color: '#333', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Message</label>
                <textarea rows={4} required value={form.message} onChange={e => setForm({...form,message:e.target.value})}
                  style={{...inputS, resize:'vertical'}}
                  onFocus={e => e.target.style.borderBottomColor='var(--blue)'}
                  onBlur={e => e.target.style.borderBottomColor='#1e1e1e'}/>
              </div>
              <button type="submit" style={{
                background:'var(--blue)', color:'#fff', border:'none',
                padding:'16px 36px', fontFamily:'var(--f)',
                fontSize:11, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
                cursor:'pointer', alignSelf:'flex-start', transition:'opacity 0.2s',
              }} onMouseEnter={e=>e.target.style.opacity='0.82'}
                 onMouseLeave={e=>e.target.style.opacity='1'}>
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer style={{
      background:'var(--fg)', color:'#2a2a2a',
      padding:'28px 48px',
      display:'flex', justifyContent:'space-between', alignItems:'center',
      borderTop:'1px solid #141414', fontSize:11, letterSpacing:'0.08em',
    }}>
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <GoVizMark size={22} color="#032bff"/>
        <span style={{color:'#2a2a2a'}}>© 2024 GOVIZ Architecture Studio</span>
      </div>
      <div style={{display:'flex', gap:28}}>
        {['Privacy','Imprint','Admin →'].map(l => (
          <a key={l} href={l==='Admin →'?'admin.html':'#'} target={l==='Admin →'?'_blank':undefined}
            style={{color:'#2a2a2a',textDecoration:'none',textTransform:'uppercase',transition:'color 0.2s'}}
            onMouseEnter={e=>e.target.style.color='var(--blue)'}
            onMouseLeave={e=>e.target.style.color='#2a2a2a'}>{l}</a>
        ))}
      </div>
    </footer>
  );
}

// Export everything to window
Object.assign(window, {
  PROJECTS, TEAM, SERVICES,
  GoVizMark, ProjectPattern,
  Nav, Hero, Projects, ProjectCard, ProjectDetail,
  About, Team, TeamMember, Services, ServiceCard, Contact, Footer,
  useReveal,
});
