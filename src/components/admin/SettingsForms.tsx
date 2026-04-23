"use client";

import { useState, type CSSProperties } from "react";
import AdminHeader from "./Header";
import Toast, { type ToastState } from "./Toast";
import type { SiteSettingsRow } from "@/lib/supabase/types";

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)",
  padding: "10px 14px",
  fontSize: 14,
  background: "#fff",
  outline: "none",
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

async function patchSettings(
  patch: Partial<SiteSettingsRow>,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const json = await res.json();
  if (!res.ok) return { ok: false, error: json.error ?? "Failed" };
  return { ok: true };
}

export function ContactAdmin({ initial }: { initial: SiteSettingsRow }) {
  const [info, setInfo] = useState(initial);
  const [toast, setToast] = useState<ToastState>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await patchSettings({
      contact_email: info.contact_email,
      contact_phone: info.contact_phone,
      contact_address: info.contact_address,
    });
    setSaving(false);
    setToast({
      msg: res.ok ? "Contact info saved." : res.error ?? "Failed",
      type: res.ok ? "success" : "danger",
    });
  };

  return (
    <div>
      <AdminHeader
        title="Contact Info"
        subtitle="Studio contact details shown on the portfolio site."
      />
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          padding: "28px",
          maxWidth: 560,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={info.contact_email}
              onChange={(e) =>
                setInfo({ ...info, contact_email: e.target.value })
              }
              style={inputStyle}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--blue)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input
              value={info.contact_phone}
              onChange={(e) =>
                setInfo({ ...info, contact_phone: e.target.value })
              }
              style={inputStyle}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--blue)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            />
          </div>
          <div>
            <label style={labelStyle}>Studio Address</label>
            <textarea
              rows={2}
              value={info.contact_address}
              onChange={(e) =>
                setInfo({ ...info, contact_address: e.target.value })
              }
              style={{ ...inputStyle, resize: "none" }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--blue)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            />
          </div>
          <button
            onClick={save}
            disabled={saving}
            style={{
              alignSelf: "flex-start",
              background: "var(--blue)",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              cursor: saving ? "wait" : "pointer",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

export function SettingsAdmin({ initial }: { initial: SiteSettingsRow }) {
  const [form, setForm] = useState(initial);
  const [toast, setToast] = useState<ToastState>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await patchSettings({
      studio_name: form.studio_name,
      studio_tagline: form.studio_tagline,
      studio_founded: form.studio_founded,
      studio_city: form.studio_city,
      studio_country: form.studio_country,
    });
    setSaving(false);
    setToast({
      msg: res.ok ? "Settings saved." : res.error ?? "Failed",
      type: res.ok ? "success" : "danger",
    });
  };

  const field = (
    key: keyof SiteSettingsRow,
    label: string,
    span?: string,
  ) => (
    <div key={key} style={{ gridColumn: span }}>
      <label style={labelStyle}>{label}</label>
      <input
        value={(form[key] as string) ?? ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--border)")
        }
      />
    </div>
  );

  return (
    <div>
      <AdminHeader title="Settings" subtitle="Global studio configuration." />
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border)",
          padding: "28px",
          maxWidth: 560,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {field("studio_name", "Studio Name")}
          {field("studio_founded", "Founded")}
          {field("studio_tagline", "Tagline", "1/-1")}
          {field("studio_city", "City")}
          {field("studio_country", "Country")}
          <div style={{ gridColumn: "1/-1" }}>
            <button
              onClick={save}
              disabled={saving}
              style={{
                background: "var(--blue)",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                cursor: saving ? "wait" : "pointer",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
