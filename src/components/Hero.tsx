"use client";

import { useEffect, useState } from "react";

type Props = { onNav: (id: string) => void };

const WORDS = ["Shaping", "Space,", "Defining"] as const;

export default function Hero({ onNav }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 48px 72px",
        position: "relative",
        overflow: "hidden",
        background: "var(--fg)",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          pointerEvents: "none",
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="hgrid"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="64"
                y1="0"
                x2="64"
                y2="64"
                stroke="white"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1="64"
                x2="64"
                y2="64"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>
      </div>

      {/* Blue left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: "var(--blue)",
        }}
      />

      {/* Top-right meta */}
      <div
        style={{
          position: "absolute",
          top: 88,
          right: 48,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          alignItems: "flex-end",
          opacity: ready ? 1 : 0,
          transition: "opacity 1s ease 1s",
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            color: "#444",
            textTransform: "uppercase",
          }}
        >
          Est. 2012 · Copenhagen
        </span>
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            color: "#444",
            textTransform: "uppercase",
          }}
        >
          Architecture &amp; Visualisation
        </span>
      </div>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.35em",
            color: "var(--blue)",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 28,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          Architecture Studio · 3D Visualisation
        </div>

        <h1
          style={{
            fontFamily: "var(--f)",
            fontWeight: 700,
            fontSize: "clamp(52px, 9.5vw, 152px)",
            lineHeight: 0.9,
            letterSpacing: "-0.025em",
            color: "var(--bg)",
            textTransform: "uppercase",
            overflow: "hidden",
          }}
        >
          {WORDS.map((word, i) => (
            <div
              key={word}
              style={{ overflow: "hidden", display: "block" }}
            >
              <span
                style={{
                  display: "block",
                  transform: ready ? "translateY(0)" : "translateY(110%)",
                  transition: `transform 1s cubic-bezier(0.77,0,0.18,1) ${
                    0.3 + i * 0.12
                  }s`,
                }}
              >
                {word}
              </span>
            </div>
          ))}
          <div style={{ overflow: "hidden", display: "block" }}>
            <span
              style={{
                display: "block",
                color: "var(--blue)",
                transform: ready ? "translateY(0)" : "translateY(110%)",
                transition:
                  "transform 1s cubic-bezier(0.77,0,0.18,1) 0.66s",
              }}
            >
              Culture.
            </span>
          </div>
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginTop: 64,
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "#666",
              maxWidth: 360,
              fontWeight: 300,
              opacity: ready ? 1 : 0,
              transition: "opacity 0.8s ease 1.1s",
            }}
          >
            We design buildings and spaces that transform how people inhabit
            the world — from private residences to major civic landmarks.
          </p>

          <div
            data-hero-stats
            style={{
              display: "flex",
              gap: 48,
              opacity: ready ? 1 : 0,
              transition: "opacity 0.8s ease 1.3s",
            }}
          >
            {(
              [
                ["48+", "Projects"],
                ["12", "Years"],
                ["6", "Countries"],
              ] as const
            ).map(([n, l]) => (
              <div key={l} style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 700,
                    color: "var(--bg)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#555",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => onNav("projects")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 56,
            padding: 0,
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease 1.5s",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid #2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "goviz-bob-down 2.5s ease-in-out infinite",
            }}
          >
            <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
              <path
                d="M5.5 1v12M1 9l4.5 4.5L10 9"
                stroke="#555"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "#555",
              textTransform: "uppercase",
            }}
          >
            Scroll to explore
          </span>
        </button>
      </div>
    </section>
  );
}
