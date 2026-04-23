// ============================================================
// APP ROOT
// ============================================================
const { useState, useEffect } = React;

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewerProject, setViewerProject]     = useState(null);
  const [activeSection, setActiveSection]     = useState('hero');

  // Dismiss loader
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById('loader');
      if (el) el.classList.add('out');
    }, 1400);
    return () => clearTimeout(t);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const ids = ['hero','projects','about','team','services','contact'];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.35 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Smooth-scroll to section
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - (id === 'hero' ? 0 : 72);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const openViewer = (project) => {
    setSelectedProject(null);
    setTimeout(() => setViewerProject(project), 300);
  };

  return (
    <>
      <Nav onNav={scrollTo} activeSection={activeSection} />
      <Hero onNav={scrollTo} />
      <Projects onOpenProject={setSelectedProject} />
      <About />
      <Team />
      <Services />
      <Contact />
      <Footer />

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onView3D={openViewer}
        />
      )}

      {viewerProject && (
        <Viewer3D
          project={viewerProject}
          onClose={() => setViewerProject(null)}
        />
      )}
    </>
  );
}

// Tweaks panel
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#032bff",
  "heroHeadline": "Shaping Space, Defining Culture.",
  "studioClaim": "Architecture & Visualisation"
}/*EDITMODE-END*/;

(function initTweaks() {
  let tweaks = { ...TWEAK_DEFAULTS };

  window.addEventListener('message', e => {
    if (e.data?.type === '__activate_edit_mode')   showPanel(true);
    if (e.data?.type === '__deactivate_edit_mode') showPanel(false);
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  function showPanel(show) {
    document.getElementById('tweak-panel').style.display = show ? 'flex' : 'none';
  }

  function applyTweaks(t) {
    document.documentElement.style.setProperty('--blue', t.accentColor);
  }

  applyTweaks(tweaks);

  window.__applyTweak = (key, val) => {
    tweaks[key] = val;
    applyTweaks(tweaks);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  };
})();

// Mount React app
const reactRoot = ReactDOM.createRoot(document.getElementById('root'));
reactRoot.render(<App />);

// Inject Tweaks panel after mount
setTimeout(() => {
  const panel = document.createElement('div');
  panel.id = 'tweak-panel';
  panel.style.cssText = `
    display:none; position:fixed; bottom:24px; right:24px; z-index:9000;
    background:#fff; border:1px solid #e0ddd5; box-shadow:0 8px 40px rgba(0,0,0,0.12);
    padding:24px; width:260px; flex-direction:column; gap:18px;
    font-family:'Space Grotesk',sans-serif;
  `;
  panel.innerHTML = `
    <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#0c0c0a;margin-bottom:4px">Tweaks</div>

    <div>
      <label style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#7a7870;display:block;margin-bottom:6px">Accent Color</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="color" id="tw-color" value="#032bff" style="width:36px;height:28px;border:none;cursor:pointer;padding:0;background:none">
        <span id="tw-color-val" style="font-size:12px;color:#444;font-family:monospace">#032bff</span>
      </div>
    </div>

    <div>
      <label style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#7a7870;display:block;margin-bottom:6px">Hero Headline</label>
      <select id="tw-headline" style="width:100%;border:1px solid #ddd;padding:7px 10px;font-family:inherit;font-size:12px;background:#fafafa;color:#333;cursor:pointer">
        <option>Shaping Space, Defining Culture.</option>
        <option>Architecture for the Human Scale.</option>
        <option>Form Follows Meaning.</option>
        <option>We Build What Endures.</option>
      </select>
    </div>

    <div>
      <label style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#7a7870;display:block;margin-bottom:6px">Studio Tagline</label>
      <select id="tw-claim" style="width:100%;border:1px solid #ddd;padding:7px 10px;font-family:inherit;font-size:12px;background:#fafafa;color:#333;cursor:pointer">
        <option>Architecture &amp; Visualisation</option>
        <option>Architecture Studio · Copenhagen</option>
        <option>Design · Research · Build</option>
      </select>
    </div>
  `;
  document.body.appendChild(panel);

  panel.querySelector('#tw-color').addEventListener('input', e => {
    panel.querySelector('#tw-color-val').textContent = e.target.value;
    window.__applyTweak('accentColor', e.target.value);
  });
}, 200);
