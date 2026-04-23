"use client";

import GoVizMark from "./GoVizMark";

const LINKS = ["Privacy", "Imprint"] as const;

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--fg)",
        color: "#2a2a2a",
        padding: "28px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #141414",
        fontSize: 11,
        letterSpacing: "0.08em",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <GoVizMark size={22} color="#032bff" />
        <span style={{ color: "#2a2a2a" }}>
          © 2024 GOVIZ Architecture Studio
        </span>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        {LINKS.map((l) => (
          <a
            key={l}
            href="#"
            style={{
              color: "#2a2a2a",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--blue)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a2a2a")}
          >
            {l}
          </a>
        ))}
      </div>
    </footer>
  );
}
