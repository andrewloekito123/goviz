// ============================================================
// GSAP — Pinned scroll sections + 3D cinematic animations
// ============================================================
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  // Give browser one more frame to finish layout before registering triggers
  requestAnimationFrame(() => {
  gsap.registerPlugin(ScrollTrigger);

  // ── Scroll progress bar ─────────────────────────────────
  const bar = Object.assign(document.createElement('div'), {});
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:#032bff;z-index:9998;width:0;pointer-events:none;transform-origin:left';
  document.body.appendChild(bar);
  gsap.to(bar, {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  });

  // ── HERO — multi-layer parallax ──────────────────────────
  gsap.to('#hero h1', {
    y: -180, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
  });
  gsap.to('#hero p', {
    y: -80, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: '30% top', end: 'bottom top', scrub: 1 },
  });
  const heroStats = document.querySelector('#hero div[style*="gap: 48px"]');
  if (heroStats) {
    gsap.to(heroStats, {
      y: -240, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: '15% top', end: 'bottom top', scrub: 0.8 },
    });
  }
  gsap.to('#hero', {
    scale: 0.96, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: '60% top', end: 'bottom top', scrub: 1 },
  });

  // ── PROJECTS — PINNED horizontal carousel ───────────────
  (function initProjectsCarousel() {
    const section    = document.getElementById('projects');
    const gridEl     = section && section.querySelector('div[style*="grid"]');
    const cards      = gridEl ? Array.from(gridEl.querySelectorAll('.reveal')) : [];
    if (!section || !gridEl || cards.length === 0) return;

    // Convert grid → horizontal flex strip
    const CARD_W = 480;
    const GAP    = 16;
    const STRIP_W = cards.length * CARD_W + (cards.length - 1) * GAP;

    gsap.set(gridEl, {
      display: 'flex', flexWrap: 'nowrap',
      gap: GAP, width: STRIP_W,
    });
    cards.forEach(card => {
      gsap.set(card, { width: CARD_W, flexShrink: 0, opacity: 1, y: 0, rotateX: 0 });
    });

    // Slide-in from right on first entry (before pin)
    gsap.from(gridEl, {
      x: 120, opacity: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 85%' },
    });

    // Progress label
    const prog = document.createElement('div');
    prog.id = 'proj-prog';
    prog.style.cssText = [
      'position:absolute', 'bottom:40px', 'right:48px',
      'font-family:Space Grotesk,sans-serif',
      'font-size:12px', 'font-weight:700', 'letter-spacing:0.2em',
      'color:var(--muted)', 'pointer-events:none', 'z-index:10',
      'transition:color 0.3s',
    ].join(';');
    prog.textContent = '01 / 0' + cards.length;
    section.style.position = 'relative';
    section.appendChild(prog);

    // Horizontal scrub pin
    const maxX   = -(STRIP_W - window.innerWidth + 96 + 48);
    const scrollDist = STRIP_W - window.innerWidth + 144;

    gsap.to(gridEl, {
      x: maxX, ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${Math.max(scrollDist, 600)}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate(self) {
          const idx = Math.min(
            Math.round(self.progress * (cards.length - 1)) + 1,
            cards.length
          );
          prog.textContent = String(idx).padStart(2, '0') + ' / 0' + cards.length;
          prog.style.color = self.progress > 0.05 ? 'var(--blue)' : 'var(--muted)';
        },
      },
    });
  })();

  // ── ABOUT — PINNED sequential text reveal ────────────────
  (function initAboutPin() {
    const section = document.getElementById('about');
    if (!section) return;

    const h2     = section.querySelector('h2');
    const paras  = gsap.utils.toArray('#about p');
    const items  = gsap.utils.toArray('#about [style*="border-top: 1px solid"]');

    // Start hidden
    gsap.set([h2, ...paras, ...items], { opacity: 0, y: 50 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1000',
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    tl.to(h2, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0)
      .to(paras[0], { opacity: 1, y: 0, duration: 0.35 }, 0.25)
      .to(paras[1] || {}, { opacity: 1, y: 0, duration: 0.3 }, 0.45)
      .to(items, { opacity: 1, y: 0, stagger: 0.12, duration: 0.3 }, 0.6);
  })();

  // ── TEAM — 3D stagger (no pin, natural scroll) ───────────
  (function initTeam() {
    const cards = gsap.utils.toArray('#team .reveal');
    gsap.set(cards, { opacity: 0, rotateY: -24, x: -36, transformPerspective: 1000 });
    cards.forEach((card, i) => {
      gsap.to(card, {
        opacity: 1, rotateY: 0, x: 0, duration: 1, ease: 'power4.out',
        transformOrigin: 'left center',
        scrollTrigger: { trigger: card, start: 'top 90%' },
        delay: i * 0.09,
      });
    });
  })();

  // ── SERVICES — PINNED card-by-card entrance ──────────────
  (function initServicesPin() {
    const section = document.getElementById('services');
    if (!section) return;

    const cards = gsap.utils.toArray('#services .reveal');
    if (cards.length === 0) return;

    gsap.set(cards, { opacity: 0, y: 70, scale: 0.9, rotateX: 12, transformPerspective: 800 });

    // Arrange: split into 2 staggered columns
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${cards.length * 180}`,
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    cards.forEach((card, i) => {
      tl.to(card, {
        opacity: 1, y: 0, scale: 1, rotateX: 0,
        duration: 0.5, ease: 'back.out(1.2)',
      }, i * 0.22);
    });
  })();

  // ── CONTACT — dramatic clip-path rise ───────────────────
  (function initContact() {
    const section = document.getElementById('contact');
    if (!section) return;

    gsap.set(section, { clipPath: 'inset(8% 0 0 0)', opacity: 0 });
    gsap.to(section, {
      clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 80%' },
    });

    gsap.from('#contact h2', {
      y: 100, opacity: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 70%' },
    });
    gsap.from('#contact p', {
      y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 60%' },
    });
  })();

  // ── FOOTER ───────────────────────────────────────────────
  gsap.from('footer', {
    y: 24, opacity: 0, duration: 0.7,
    scrollTrigger: { trigger: 'footer', start: 'top 95%' },
  });

  ScrollTrigger.refresh();
  window.addEventListener('resize', () => ScrollTrigger.refresh());
  console.log('[GSAP] Pinned scroll initialised ✓');
  }); // end rAF
})();
