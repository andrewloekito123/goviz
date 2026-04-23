"use client";

import { useReveal } from "@/lib/useReveal";
import type { ProjectRow } from "@/lib/supabase/types";
import ProjectCard from "./ProjectCard";

type Props = {
  projects: ProjectRow[];
  onOpenProject: (p: ProjectRow) => void;
};

export default function Projects({ projects, onOpenProject }: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="projects" style={{ padding: "120px 48px" }}>
      <div ref={ref} className="reveal" style={{ marginBottom: 56 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>
          <span className="section-num">02</span> Selected Work
        </div>
        <h2
          style={{
            fontSize: "clamp(34px,4.5vw,68px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1,
          }}
        >
          Recent Projects
        </h2>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            padding: "80px 0",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 14,
          }}
        >
          No projects published yet.
        </div>
      ) : (
        <div
          data-projects-grid
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: 2,
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              onOpen={onOpenProject}
              revealDelay={i * 60}
            />
          ))}
        </div>
      )}
    </section>
  );
}
