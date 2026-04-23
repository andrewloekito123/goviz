"use client";

import { useState } from "react";
import { TEAM, type TeamMember } from "@/lib/data";
import { useReveal } from "@/lib/useReveal";

function Initials({ name }: { name: string }) {
  return (
    <>
      {name
        .split(" ")
        .map((w) => w[0])
        .join("")}
    </>
  );
}

function MemberCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>(index * 80);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} className="reveal">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          border: `1px solid ${hov ? "var(--blue)" : "var(--border)"}`,
          transition: "border-color 0.3s",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            paddingBottom: "100%",
            position: "relative",
            background: member.accent,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 300"
            style={{ position: "absolute", inset: 0 }}
          >
            <rect width="300" height="300" fill={member.accent} />
            <line
              x1="0"
              y1="150"
              x2="300"
              y2="150"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />
            <line
              x1="150"
              y1="0"
              x2="150"
              y2="300"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />
            <circle cx="150" cy="105" r="52" fill="rgba(255,255,255,0.35)" />
            <path
              d="M40 300 Q150 195 260 300Z"
              fill="rgba(255,255,255,0.18)"
            />
            <text
              x="150"
              y="125"
              textAnchor="middle"
              fontSize="48"
              fontWeight="700"
              fontFamily="Space Grotesk,sans-serif"
              fill="rgba(0,0,0,0.15)"
            >
              <Initials name={member.name} />
            </text>
          </svg>
        </div>
        <div style={{ padding: "20px 22px 24px" }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 3 }}>
            {member.name}
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--blue)",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            {member.role}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.65,
            }}
          >
            {member.bio}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="team" style={{ padding: "120px 48px" }}>
      <div ref={ref} className="reveal" style={{ marginBottom: 56 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>
          <span className="section-num">04</span> People
        </div>
        <h2
          style={{
            fontSize: "clamp(34px,4.5vw,68px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1,
          }}
        >
          The Team
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 2,
        }}
      >
        {TEAM.map((m, i) => (
          <MemberCard key={m.name} member={m} index={i} />
        ))}
      </div>
    </section>
  );
}
