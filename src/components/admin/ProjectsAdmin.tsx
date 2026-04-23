"use client";

import { useState } from "react";
import AdminHeader from "./Header";
import Toast, { type ToastState } from "./Toast";
import ProjectEditor, { type EditableProject } from "./ProjectEditor";
import type { ProjectRow } from "@/lib/supabase/types";

type Props = { initial: ProjectRow[] };

async function api<T>(
  url: string,
  init?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...init,
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error ?? "Request failed" };
    return { data: json as T, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}

function toEditable(row: ProjectRow): EditableProject {
  return {
    ...row,
    tags: row.tags ?? [],
    cover_url: row.cover_url ?? null,
    model_url: row.model_url ?? null,
  };
}

export default function ProjectsAdmin({ initial }: Props) {
  const [projects, setProjects] = useState<ProjectRow[]>(initial);
  const [editing, setEditing] = useState<EditableProject | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const [saving, setSaving] = useState(false);

  const show = (msg: string, type: "success" | "danger" = "success") =>
    setToast({ msg, type });

  const newDraft: EditableProject = {
    title: "New Project",
    year: String(new Date().getFullYear()),
    location: "",
    category: "",
    description: "",
    tags: [],
    published: false,
    cover_url: null,
    model_url: null,
    pattern_angle: 0,
    pattern_color: "#bcc5e8",
    bg_color: "#1a1d2e",
  };

  const saveProject = async (form: EditableProject) => {
    setSaving(true);
    if (creating || !form.id) {
      const res = await api<{ project: ProjectRow }>("/api/projects", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSaving(false);
      if (res.error || !res.data) {
        show(res.error ?? "Failed to create", "danger");
        return;
      }
      setProjects((ps) => [res.data!.project, ...ps]);
      show(`"${res.data.project.title}" created.`);
    } else {
      const res = await api<{ project: ProjectRow }>(
        `/api/projects/${form.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(form),
        },
      );
      setSaving(false);
      if (res.error || !res.data) {
        show(res.error ?? "Failed to save", "danger");
        return;
      }
      setProjects((ps) =>
        ps.map((p) => (p.id === form.id ? res.data!.project : p)),
      );
      show(`"${res.data.project.title}" saved.`);
    }
    setEditing(null);
    setCreating(false);
  };

  const togglePublish = async (p: ProjectRow) => {
    const res = await api<{ project: ProjectRow }>(`/api/projects/${p.id}`, {
      method: "PATCH",
      body: JSON.stringify({ published: !p.published }),
    });
    if (res.error || !res.data) {
      show(res.error ?? "Failed to update", "danger");
      return;
    }
    setProjects((ps) =>
      ps.map((x) => (x.id === p.id ? res.data!.project : x)),
    );
    show(`"${p.title}" ${p.published ? "unpublished" : "published"}.`);
  };

  const deleteProject = async (p: ProjectRow) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const res = await api<{ ok: true }>(`/api/projects/${p.id}`, {
      method: "DELETE",
    });
    if (res.error) {
      show(res.error, "danger");
      return;
    }
    setProjects((ps) => ps.filter((x) => x.id !== p.id));
    show(`"${p.title}" deleted.`, "danger");
  };

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const publishedCount = projects.filter((p) => p.published).length;
  const draftCount = projects.length - publishedCount;

  return (
    <div>
      <AdminHeader
        title="Projects"
        subtitle={`${publishedCount} published · ${draftCount} draft`}
        action={
          <button
            onClick={() => {
              setCreating(true);
              setEditing(newDraft);
            }}
            style={{
              background: "var(--blue)",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 300 }}>+</span> New
            Project
          </button>
        }
      />

      <div style={{ marginBottom: 20, position: "relative" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects…"
          style={{
            width: "100%",
            border: "1px solid var(--border)",
            padding: "10px 14px 10px 38px",
            fontSize: 13,
            background: "#fff",
            outline: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.3,
            fontSize: 14,
          }}
        >
          ⌕
        </span>
      </div>

      {editing && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {creating ? "Creating" : "Editing"}:{" "}
            <strong style={{ color: "var(--fg)" }}>{editing.title}</strong>
          </div>
          <ProjectEditor
            project={editing}
            onSave={saveProject}
            onCancel={() => {
              setEditing(null);
              setCreating(false);
            }}
            saving={saving}
          />
        </div>
      )}

      <div style={{ border: "1px solid var(--border)", background: "#fff" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 160px",
            padding: "10px 20px",
            borderBottom: "1px solid var(--border)",
            background: "#f7f6f2",
          }}
        >
          {["Project", "Category", "Year", "Status", "Actions"].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            No projects match your search.
          </div>
        )}

        {filtered.map((p, i) => (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 160px",
              padding: "14px 20px",
              alignItems: "center",
              borderBottom:
                i < filtered.length - 1 ? "1px solid var(--border)" : "none",
              transition: "background 0.15s",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{p.title}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  marginTop: 2,
                }}
              >
                {p.location}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {p.category}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.year}</div>
            <div>
              <span
                style={{
                  padding: "3px 10px",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: p.published
                    ? "rgba(26,158,95,0.1)"
                    : "rgba(229,57,53,0.08)",
                  color: p.published ? "var(--success)" : "var(--danger)",
                }}
              >
                {p.published ? "Published" : "Draft"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => {
                  setCreating(false);
                  setEditing(toEditable(p));
                }}
                title="Edit"
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  padding: "5px 10px",
                  fontSize: 11,
                  color: "var(--fg)",
                  transition: "all 0.2s",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => togglePublish(p)}
                title="Toggle publish"
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  padding: "5px 8px",
                  fontSize: 12,
                  color: p.published ? "var(--danger)" : "var(--success)",
                }}
              >
                {p.published ? "⏸" : "▶"}
              </button>
              <button
                onClick={() => deleteProject(p)}
                title="Delete"
                style={{
                  background: "none",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  padding: "5px 8px",
                  fontSize: 12,
                  color: "#bbb",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
