"use client";

import { useState } from "react";
import type { ServiceRow } from "@/lib/supabase/types";
import { useReveal } from "@/lib/useReveal";

function ServiceCard({
  service,
  index,
}: {
  service: ServiceRow;
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>(index * 55);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="reveal">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: "34px 38px",
          border: "1px solid var(--border)",
          background: hov ? "var(--blue)" : "var(--bg)",
          transition: "background 0.35s ease",
          cursor: "default",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: hov ? "rgba(255,255,255,0.25)" : "var(--blue)",
            marginBottom: 14,
            transition: "color 0.35s",
          }}
        >
          {service.num}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 8,
            color: hov ? "#fff" : "var(--fg)",
            transition: "color 0.35s",
          }}
        >
          {service.title}
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: hov ? "rgba(255,255,255,0.7)" : "var(--muted)",
            transition: "color 0.35s",
          }}
        >
          {service.description}
        </div>
      </div>
    </div>
  );
}

export default function Services({ services }: { services: ServiceRow[] }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section
      id="services"
      style={{ padding: "120px 48px", background: "var(--bg)" }}
    >
      <div ref={ref} className="reveal" style={{ marginBottom: 56 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>
          <span className="section-num">05</span> What We Do
        </div>
        <h2
          style={{
            fontSize: "clamp(34px,4.5vw,68px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1,
          }}
        >
          Services
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 2,
        }}
      >
        {services.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} />
        ))}
      </div>
    </section>
  );
}
