"use client";

import { useState, type CSSProperties } from "react";
import AdminHeader from "./Header";
import Toast, { type ToastState } from "./Toast";
import type { ServiceRow } from "@/lib/supabase/types";

type Props = { initial: ServiceRow[] };

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)",
  padding: "8px 12px",
  fontSize: 13,
  background: "#fff",
  outline: "none",
  borderRadius: 0,
};

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

export default function ServicesAdmin({ initial }: Props) {
  const [services, setServices] = useState<ServiceRow[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [buf, setBuf] = useState<{ title: string; description: string; num: string }>({
    title: "",
    description: "",
    num: "",
  });
  const [toast, setToast] = useState<ToastState>(null);

  const show = (msg: string, type: "success" | "danger" = "success") =>
    setToast({ msg, type });

  const startEdit = (s: ServiceRow) => {
    setEditingId(s.id);
    setBuf({ title: s.title, description: s.description, num: s.num });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId) return;
    const res = await api<{ service: ServiceRow }>(
      `/api/services/${editingId}`,
      {
        method: "PATCH",
        body: JSON.stringify(buf),
      },
    );
    if (res.error || !res.data) {
      show(res.error ?? "Failed to save", "danger");
      return;
    }
    setServices((ss) =>
      ss.map((s) => (s.id === editingId ? res.data!.service : s)),
    );
    setEditingId(null);
    show("Service saved.");
  };

  const deleteService = async (s: ServiceRow) => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    const res = await api<{ ok: true }>(`/api/services/${s.id}`, {
      method: "DELETE",
    });
    if (res.error) {
      show(res.error, "danger");
      return;
    }
    setServices((ss) => ss.filter((x) => x.id !== s.id));
    show(`"${s.title}" deleted.`, "danger");
  };

  const addService = async () => {
    const res = await api<{ service: ServiceRow }>("/api/services", {
      method: "POST",
      body: JSON.stringify({ title: "New Service", description: "" }),
    });
    if (res.error || !res.data) {
      show(res.error ?? "Failed to add", "danger");
      return;
    }
    setServices((ss) => [...ss, res.data!.service]);
    startEdit(res.data.service);
  };

  return (
    <div>
      <AdminHeader
        title="Services"
        subtitle="Manage what your studio offers."
        action={
          <button
            onClick={addService}
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
            <span style={{ fontSize: 16 }}>+</span> Add Service
          </button>
        }
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {services.map((s) => (
          <div
            key={s.id}
            style={{
              border: "1px solid var(--border)",
              background: "#fff",
            }}
          >
            {editingId === s.id ? (
              <div
                style={{
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <input
                    value={buf.num}
                    onChange={(e) =>
                      setBuf((b) => ({ ...b, num: e.target.value }))
                    }
                    placeholder="Num (01)"
                    style={{ ...inputStyle, width: 100 }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--blue)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                  />
                  <input
                    value={buf.title}
                    onChange={(e) =>
                      setBuf((b) => ({ ...b, title: e.target.value }))
                    }
                    placeholder="Service title"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--blue)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                  />
                </div>
                <textarea
                  rows={3}
                  value={buf.description}
                  onChange={(e) =>
                    setBuf((b) => ({ ...b, description: e.target.value }))
                  }
                  placeholder="Service description"
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--blue)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={saveEdit}
                    style={{
                      padding: "7px 18px",
                      background: "var(--blue)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: "7px 18px",
                      background: "none",
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 22px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ color: "var(--blue)", marginRight: 10 }}>
                      {s.num}
                    </span>
                    {s.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {s.description}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexShrink: 0,
                    marginLeft: 16,
                  }}
                >
                  <button
                    onClick={() => startEdit(s)}
                    style={{
                      padding: "5px 12px",
                      border: "1px solid var(--border)",
                      background: "none",
                      cursor: "pointer",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteService(s)}
                    style={{
                      padding: "5px 8px",
                      border: "1px solid var(--border)",
                      background: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#bbb",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
