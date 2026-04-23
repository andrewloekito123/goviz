"use client";

import { useState, type CSSProperties } from "react";
import type { ProjectRow } from "@/lib/supabase/types";
import UploadDropzone from "./UploadDropzone";

export type EditableProject = Partial<ProjectRow> & {
  id?: string;
  title: string;
  year: string;
  location: string;
  category: string;
  description: string;
  tags: string[];
  published: boolean;
  cover_url: string | null;
  model_url: string | null;
};

type Tab = "info" | "media" | "seo";

type Props = {
  project: EditableProject;
  onSave: (p: EditableProject) => Promise<void> | void;
  onCancel: () => void;
  saving?: boolean;
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)",
  padding: "10px 14px",
  fontSize: 14,
  background: "#fff",
  outline: "none",
  transition: "border-color 0.2s",
  borderRadius: 0,
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 6,
};

function tagsToString(tags: string[] | undefined) {
  return (tags ?? []).join(", ");
}
function stringToTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function ProjectEditor({
  project,
  onSave,
  onCancel,
  saving = false,
}: Props) {
  const [form, setForm] = useState<EditableProject>({ ...project });
  const [tagsText, setTagsText] = useState(tagsToString(project.tags));
  const [tab, setTab] = useState<Tab>("info");

  const set = <K extends keyof EditableProject>(k: K, v: EditableProject[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    const next: EditableProject = {
      ...form,
      tags: stringToTags(tagsText),
    };
    void onSave(next);
  };

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)" }}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {(
          [
            ["info", "Project Info"],
            ["media", "Media & 3D"],
            ["seo", "SEO"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: "14px 24px",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--f)",
              fontSize: 12,
              fontWeight: tab === id ? 700 : 400,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "none",
              color: tab === id ? "var(--blue)" : "var(--muted)",
              borderBottom: `2px solid ${tab === id ? "var(--blue)" : "transparent"}`,
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 28px" }}>
        {tab === "info" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            {(
              [
                ["title", "Project Title"],
                ["location", "Location"],
                ["year", "Year"],
                ["category", "Category"],
              ] as const
            ).map(([k, l]) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input
                  style={inputStyle}
                  value={(form[k] as string) ?? ""}
                  onChange={(e) => set(k, e.target.value)}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--blue)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                />
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                rows={5}
                style={{ ...inputStyle, resize: "vertical" }}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--blue)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input
                style={inputStyle}
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--blue)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>
            <div
              style={{
                gridColumn: "1/-1",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <button
                type="button"
                onClick={() => set("published", !form.published)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: form.published ? "var(--blue)" : "#ddd",
                    position: "relative",
                    transition: "background 0.3s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: form.published ? 23 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      transition: "left 0.3s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: form.published
                      ? "var(--success)"
                      : "var(--danger)",
                  }}
                >
                  {form.published ? "Published" : "Draft"}
                </span>
              </button>
            </div>
          </div>
        )}

        {tab === "media" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <div>
              <label style={labelStyle}>Cover Image</label>
              <UploadDropzone
                kind="image"
                currentUrl={form.cover_url}
                onUploaded={(url) => set("cover_url", url)}
              />
            </div>
            <div>
              <label style={labelStyle}>3D Model (.GLB / .GLTF)</label>
              <UploadDropzone
                kind="model"
                currentUrl={form.model_url}
                onUploaded={(url) => set("model_url", url)}
              />
            </div>
          </div>
        )}

        {tab === "seo" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div>
              <label style={labelStyle}>Meta Title</label>
              <input
                style={inputStyle}
                value={form.meta_title ?? ""}
                onChange={(e) => set("meta_title", e.target.value)}
                placeholder={`${form.title} — GOVIZ`}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--blue)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Meta Description</label>
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: "none" }}
                value={form.meta_desc ?? ""}
                onChange={(e) => set("meta_desc", e.target.value)}
                placeholder="Brief description for search engines (max 160 chars)"
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--blue)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid var(--border)",
                  background: "#fff",
                }}
              >
                <span
                  style={{
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "var(--muted)",
                    borderRight: "1px solid var(--border)",
                    background: "#f7f6f2",
                    whiteSpace: "nowrap",
                  }}
                >
                  /projects/
                </span>
                <input
                  style={{
                    ...inputStyle,
                    border: "none",
                  }}
                  value={form.slug ?? ""}
                  onChange={(e) => set("slug", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          padding: "18px 28px",
          borderTop: "1px solid var(--border)",
          background: "#fafaf8",
        }}
      >
        <button
          onClick={onCancel}
          disabled={saving}
          style={{
            padding: "9px 20px",
            border: "1px solid var(--border)",
            background: "none",
            cursor: saving ? "wait" : "pointer",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "9px 24px",
            background: "var(--blue)",
            color: "#fff",
            border: "none",
            cursor: saving ? "wait" : "pointer",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Project"}
        </button>
      </div>
    </div>
  );
}
