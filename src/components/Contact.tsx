"use client";

import { useState, type CSSProperties } from "react";
import { useReveal } from "@/lib/useReveal";
import type { SiteSettingsRow } from "@/lib/supabase/types";

type FormState = {
  name: string;
  email: string;
  budget: string;
  message: string;
};

const FIELDS: {
  key: keyof Omit<FormState, "message">;
  label: string;
  type: string;
}[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "budget", label: "Approximate Budget", type: "text" },
];

const inputStyle: CSSProperties = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #1e1e1e",
  background: "transparent",
  padding: "13px 0",
  fontFamily: "var(--f)",
  fontSize: 14,
  color: "var(--bg)",
  outline: "none",
};

export default function Contact({
  settings,
}: {
  settings: SiteSettingsRow | null;
}) {
  const ref = useReveal<HTMLDivElement>();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    budget: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const info: [string, string][] = [
    ["Email", settings?.contact_email || ""],
    ["Phone", settings?.contact_phone || ""],
    ["Address", settings?.contact_address || ""],
  ];

  return (
    <section
      id="contact"
      style={{
        padding: "120px 48px",
        background: "var(--fg)",
        color: "var(--bg)",
      }}
    >
      <div ref={ref} className="reveal">
        <div
          className="section-label"
          style={{ marginBottom: 16, color: "var(--muted)" }}
        >
          <span className="section-num">06</span> Get in Touch
        </div>
        <h2
          style={{
            fontSize: "clamp(34px,4.5vw,68px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1,
            marginBottom: 72,
          }}
        >
          Start a Project
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 15,
                color: "#555",
                lineHeight: 1.8,
                fontWeight: 300,
                marginBottom: 44,
              }}
            >
              We take on a limited number of projects each year to ensure
              exceptional attention to each commission. We&rsquo;d love to
              hear about yours.
            </p>
            {info.map(([l, v]) =>
              v ? (
                <div
                  key={l}
                  style={{
                    borderTop: "1px solid #1a1a1a",
                    padding: "18px 0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.25em",
                      color: "#333",
                      textTransform: "uppercase",
                      marginBottom: 3,
                    }}
                  >
                    {l}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#aaa",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {v}
                  </div>
                </div>
              ) : null,
            )}
          </div>
          {sent ? (
            <div style={{ padding: "40px 0" }}>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                Thank you.
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: "#555",
                  fontWeight: 300,
                }}
              >
                We&rsquo;ll respond within 2 working days.
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 28 }}
            >
              {FIELDS.map(({ key, label, type }) => (
                <div key={key}>
                  <label
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.22em",
                      color: "#333",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    required
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderBottomColor = "var(--blue)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottomColor = "#1e1e1e")
                    }
                  />
                </div>
              ))}
              <div>
                <label
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    color: "#333",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "var(--blue)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor = "#1e1e1e")
                  }
                />
              </div>
              <button
                type="submit"
                style={{
                  background: "var(--blue)",
                  color: "#fff",
                  border: "none",
                  padding: "16px 36px",
                  fontFamily: "var(--f)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.82")
                }
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
