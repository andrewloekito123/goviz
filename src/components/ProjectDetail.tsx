"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProjectRow } from "@/lib/supabase/types";
import ProjectPattern from "./ProjectPattern";

type Props = {
  project: ProjectRow;
  onClose: () => void;
  onView3D: (p: ProjectRow) => void;
};

export default function ProjectDetail({
  project,
  onClose,
  onView3D,
}: Props) {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 10);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVis(false);
    setTimeout(onClose, 450);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 800 }}>
      <div
        onClick={close}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(12,12,10,0.55)",
          opacity: vis ? 1 : 0,
          transition: "opacity 0.4s ease",
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "min(580px, 100vw)",
          background: "var(--bg)",
          transform: vis ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "54%",
            flexShrink: 0,
            background: project.bg_color,
          }}
        >
          {project.cover_url ? (
            <Image
              src={project.cover_url}
              alt={project.title}
              fill
              sizes="580px"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          ) : (
            <ProjectPattern project={project} />
          )}
          <button
            onClick={close}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(0,0,0,0.5)",
              border: "none",
              cursor: "pointer",
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 16,
              fontFamily: "var(--f)",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "36px 44px", flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "var(--blue)",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            {project.category}
          </div>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              marginBottom: 6,
            }}
          >
            {project.title}
          </h2>
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginBottom: 28,
            }}
          >
            {project.location} · {project.year}
          </div>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "#444",
              marginBottom: 32,
              fontWeight: 300,
            }}
          >
            {project.description}
          </p>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 44,
            }}
          >
            {project.tags.map((t) => (
              <span
                key={t}
                style={{
                  padding: "4px 12px",
                  border: "1px solid var(--border)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  fontWeight: 600,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={() => onView3D(project)}
            style={{
              background: "var(--blue)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              width: "100%",
              padding: "17px 32px",
              fontFamily: "var(--f)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L15 4.5V11.5L8 15L1 11.5V4.5L8 1Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M1 4.5L8 8M8 8L15 4.5M8 8V15"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            View Immersive 3D Model
          </button>
        </div>
      </div>
    </div>
  );
}
