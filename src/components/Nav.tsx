"use client";

import { useEffect, useState } from "react";
import GoVizMark from "./GoVizMark";

type Props = {
  onNav: (id: string) => void;
  activeSection: string;
};

const LINKS = [
  { label: "Work", id: "projects" },
  { label: "Studio", id: "about" },
  { label: "Services", id: "services" },
  { label: "Contact", id: "contact" },
];

export default function Nav({ onNav, activeSection }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        padding: "0 48px",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(247,246,242,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #dddbd3" : "none",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <button
        onClick={() => onNav("hero")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 0,
        }}
      >
        <GoVizMark size={32} color="#032bff" />
        <span
          style={{
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "0.18em",
            color: scrolled ? "var(--fg)" : "#fff",
            textTransform: "uppercase",
            transition: "color 0.4s",
          }}
        >
          GOVIZ
        </span>
      </button>

      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {LINKS.map((l) => (
          <button
            key={l.id}
            onClick={() => onNav(l.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--f)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color:
                activeSection === l.id
                  ? "var(--blue)"
                  : scrolled
                    ? "var(--fg)"
                    : "rgba(255,255,255,0.8)",
              transition: "color 0.3s",
              padding: 0,
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
