"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectRow } from "@/lib/supabase/types";
import { useReveal } from "@/lib/useReveal";
import ProjectPattern from "./ProjectPattern";

type Props = {
  project: ProjectRow;
  onOpen: (p: ProjectRow) => void;
  revealDelay?: number;
};

export default function ProjectCard({
  project,
  onOpen,
  revealDelay = 0,
}: Props) {
  const ref = useReveal<HTMLDivElement>(revealDelay);
  const [hovered, setHovered] = useState(false);

  return (
    <div ref={ref} className="reveal">
      <div
        onClick={() => onOpen(project)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: "pointer",
          overflow: "hidden",
          border: `1px solid ${hovered ? "var(--blue)" : "var(--border)"}`,
          background: "var(--bg)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition:
            "border-color 0.3s, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "62%",
            overflow: "hidden",
            background: project.bg_color,
          }}
        >
          {project.cover_url ? (
            <Image
              src={project.cover_url}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          ) : (
            <ProjectPattern project={project} />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(3,43,255,0.6)",
              opacity: hovered ? 0.25 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              background: "var(--blue)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "6px 12px",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
              transition: "all 0.3s ease",
            }}
          >
            View →
          </div>
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              fontSize: 10,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.15em",
              background: "rgba(0,0,0,0.25)",
              padding: "2px 8px",
            }}
          >
            {project.year}
          </div>
        </div>
        <div
          style={{
            padding: "18px 22px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "var(--muted)",
                textTransform: "uppercase",
                marginBottom: 5,
              }}
            >
              {project.category}
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
              }}
            >
              {project.title}
            </h3>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 5,
              }}
            >
              {project.location}
            </div>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${hovered ? "var(--blue)" : "var(--border)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: hovered ? "var(--blue)" : "var(--muted)",
              fontSize: 14,
              transition: "all 0.3s",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            ↗
          </div>
        </div>
      </div>
    </div>
  );
}
