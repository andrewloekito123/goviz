import type { ProjectRow } from "@/lib/supabase/types";

export default function ProjectPattern({ project }: { project: ProjectRow }) {
  const id = `pat-${project.id}`;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 270"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <pattern
          id={id}
          width="36"
          height="36"
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${project.pattern_angle})`}
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="36"
            stroke={project.pattern_color}
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <rect width="400" height="270" fill={project.bg_color} />
      <rect width="400" height="270" fill={`url(#${id})`} />
      <line
        x1="40"
        y1="40"
        x2="160"
        y2="40"
        stroke={project.pattern_color}
        strokeWidth="1"
        opacity="0.25"
      />
      <line
        x1="40"
        y1="40"
        x2="40"
        y2="140"
        stroke={project.pattern_color}
        strokeWidth="1"
        opacity="0.25"
      />
      <rect
        x="40"
        y="40"
        width="120"
        height="100"
        fill="none"
        stroke={project.pattern_color}
        strokeWidth="0.8"
        opacity="0.2"
      />
      <rect
        x="60"
        y="60"
        width="60"
        height="50"
        fill={project.pattern_color}
        opacity="0.07"
      />
      <text
        x="200"
        y="145"
        textAnchor="middle"
        fontFamily="'Space Grotesk', monospace"
        fontSize="9"
        fill={project.pattern_color}
        opacity="0.4"
        letterSpacing="5"
      >
        {(project.category || "").toUpperCase()}
      </text>
    </svg>
  );
}
