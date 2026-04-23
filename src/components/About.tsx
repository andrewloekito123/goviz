"use client";

import { useReveal } from "@/lib/useReveal";

const PRINCIPLES = [
  [
    "Sustainability",
    "Every project is held to a net-zero carbon brief from day one.",
  ],
  [
    "Collaboration",
    "The best buildings emerge from true co-design with clients and communities.",
  ],
  [
    "Research",
    "Our in-house unit drives material and spatial innovation.",
  ],
] as const;

export default function About() {
  const ref = useReveal<HTMLDivElement>();
  const r2 = useReveal<HTMLDivElement>(150);

  return (
    <section
      id="about"
      style={{
        padding: "120px 48px",
        background: "var(--fg)",
        color: "var(--bg)",
      }}
    >
      <div ref={ref} className="reveal" style={{ marginBottom: 72 }}>
        <div
          className="section-label"
          style={{ marginBottom: 16, color: "var(--muted)" }}
        >
          <span className="section-num">03</span> About the Studio
        </div>
        <h2
          style={{
            fontSize: "clamp(34px,4.5vw,68px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1,
            maxWidth: 680,
          }}
        >
          Architecture as precise cultural act
        </h2>
      </div>
      <div
        ref={r2}
        className="reveal"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.85,
              color: "#999",
              fontWeight: 300,
              marginBottom: 20,
            }}
          >
            GOVIZ was founded in 2012 with the conviction that every building
            is an opportunity to improve its context — socially, ecologically,
            and aesthetically.
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.85,
              color: "#555",
              fontWeight: 300,
            }}
          >
            We work across scales and typologies, from intimate residences to
            major public infrastructure, bringing the same rigour and care to
            every commission. Our process is collaborative, research-led, and
            deeply committed to craft.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {PRINCIPLES.map(([title, desc]) => (
            <div
              key={title}
              data-about-item
              style={{ borderTop: "1px solid #1c1c1c", padding: "24px 0" }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                  color: "var(--blue)",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#555",
                  lineHeight: 1.65,
                }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
