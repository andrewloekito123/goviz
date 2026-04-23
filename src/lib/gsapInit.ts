"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Teardown = () => void;

export function initGsapScroll(): Teardown {
  if (typeof window === "undefined") return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const cleanup: Teardown[] = [];

  // Scroll progress bar
  const bar = document.createElement("div");
  bar.style.cssText =
    "position:fixed;top:0;left:0;height:3px;background:#032bff;z-index:9998;width:0;pointer-events:none;transform-origin:left";
  document.body.appendChild(bar);
  cleanup.push(() => bar.remove());

  gsap.to(bar, {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });

  // HERO — parallax layers
  gsap.to("#hero h1", {
    y: -180,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
    },
  });
  gsap.to("#hero p", {
    y: -80,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "30% top",
      end: "bottom top",
      scrub: 1,
    },
  });
  const heroStats = document.querySelector<HTMLElement>(
    "#hero [data-hero-stats]",
  );
  if (heroStats) {
    gsap.to(heroStats, {
      y: -240,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "15% top",
        end: "bottom top",
        scrub: 0.8,
      },
    });
  }
  gsap.to("#hero", {
    scale: 0.96,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "60% top",
      end: "bottom top",
      scrub: 1,
    },
  });

  // PROJECTS — pinned horizontal carousel
  const projectsSection = document.getElementById("projects");
  const projectsGrid = projectsSection?.querySelector<HTMLElement>(
    "[data-projects-grid]",
  );
  if (projectsSection && projectsGrid) {
    const cards = Array.from(
      projectsGrid.querySelectorAll<HTMLElement>(".reveal"),
    );
    if (cards.length > 0) {
      const CARD_W = 480;
      const GAP = 16;
      const STRIP_W = cards.length * CARD_W + (cards.length - 1) * GAP;

      gsap.set(projectsGrid, {
        display: "flex",
        flexWrap: "nowrap",
        gap: GAP,
        width: STRIP_W,
      });
      cards.forEach((card) => {
        gsap.set(card, {
          width: CARD_W,
          flexShrink: 0,
          opacity: 1,
          y: 0,
          rotateX: 0,
        });
      });

      gsap.from(projectsGrid, {
        x: 120,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: projectsSection, start: "top 85%" },
      });

      const prog = document.createElement("div");
      prog.id = "proj-prog";
      prog.style.cssText = [
        "position:absolute",
        "bottom:40px",
        "right:48px",
        "font-family:Space Grotesk,sans-serif",
        "font-size:12px",
        "font-weight:700",
        "letter-spacing:0.2em",
        "color:var(--muted)",
        "pointer-events:none",
        "z-index:10",
        "transition:color 0.3s",
      ].join(";");
      prog.textContent = "01 / 0" + cards.length;
      projectsSection.style.position = "relative";
      projectsSection.appendChild(prog);
      cleanup.push(() => prog.remove());

      const scrollDist = STRIP_W - window.innerWidth + 144;
      const maxX = -(STRIP_W - window.innerWidth + 96 + 48);

      gsap.to(projectsGrid, {
        x: maxX,
        ease: "none",
        scrollTrigger: {
          trigger: projectsSection,
          start: "top top",
          end: `+=${Math.max(scrollDist, 600)}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate(self) {
            const idx = Math.min(
              Math.round(self.progress * (cards.length - 1)) + 1,
              cards.length,
            );
            prog.textContent =
              String(idx).padStart(2, "0") + " / 0" + cards.length;
            prog.style.color =
              self.progress > 0.05 ? "var(--blue)" : "var(--muted)";
          },
        },
      });
    }
  }

  // ABOUT — pinned sequential reveal
  const aboutSection = document.getElementById("about");
  if (aboutSection) {
    const h2 = aboutSection.querySelector("h2");
    const paras = gsap.utils.toArray<HTMLElement>("#about p");
    const items = gsap.utils.toArray<HTMLElement>(
      "#about [data-about-item]",
    );

    gsap.set(
      [h2, ...paras, ...items].filter(
        (el): el is HTMLElement => !!el,
      ),
      { opacity: 0, y: 50 },
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top top",
        end: "+=1000",
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    if (h2) tl.to(h2, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, 0);
    if (paras[0])
      tl.to(paras[0], { opacity: 1, y: 0, duration: 0.35 }, 0.25);
    if (paras[1]) tl.to(paras[1], { opacity: 1, y: 0, duration: 0.3 }, 0.45);
    if (items.length)
      tl.to(
        items,
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.3 },
        0.6,
      );
  }

  // TEAM — 3D stagger on scroll
  const teamCards = gsap.utils.toArray<HTMLElement>("#team .reveal");
  gsap.set(teamCards, {
    opacity: 0,
    rotateY: -24,
    x: -36,
    transformPerspective: 1000,
  });
  teamCards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      rotateY: 0,
      x: 0,
      duration: 1,
      ease: "power4.out",
      transformOrigin: "left center",
      scrollTrigger: { trigger: card, start: "top 90%" },
      delay: i * 0.09,
    });
  });

  // SERVICES — pinned card entrance
  const servicesSection = document.getElementById("services");
  if (servicesSection) {
    const cards = gsap.utils.toArray<HTMLElement>("#services .reveal");
    if (cards.length > 0) {
      gsap.set(cards, {
        opacity: 0,
        y: 70,
        scale: 0.9,
        rotateX: 12,
        transformPerspective: 800,
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesSection,
          start: "top top",
          end: `+=${cards.length * 180}`,
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.5,
            ease: "back.out(1.2)",
          },
          i * 0.22,
        );
      });
    }
  }

  // CONTACT — clip-path rise
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    gsap.set(contactSection, {
      clipPath: "inset(8% 0 0 0)",
      opacity: 0,
    });
    gsap.to(contactSection, {
      clipPath: "inset(0% 0 0 0)",
      opacity: 1,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: contactSection, start: "top 80%" },
    });
    gsap.from("#contact h2", {
      y: 100,
      opacity: 0,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: contactSection, start: "top 70%" },
    });
    gsap.from("#contact p", {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: contactSection, start: "top 60%" },
    });
  }

  // FOOTER
  gsap.from("footer", {
    y: 24,
    opacity: 0,
    duration: 0.7,
    scrollTrigger: { trigger: "footer", start: "top 95%" },
  });

  ScrollTrigger.refresh();
  const onResize = () => ScrollTrigger.refresh();
  window.addEventListener("resize", onResize);
  cleanup.push(() => window.removeEventListener("resize", onResize));

  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    cleanup.forEach((fn) => fn());
  };
}
