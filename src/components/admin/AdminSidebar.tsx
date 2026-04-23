"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import GoVizMark from "@/components/GoVizMark";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const SECTIONS = [
  { id: "dashboard", label: "Dashboard", icon: "▦", href: "/admin" },
  { id: "projects", label: "Projects", icon: "◻", href: "/admin/projects" },
  { id: "services", label: "Services", icon: "≡", href: "/admin/services" },
  { id: "contact", label: "Contact", icon: "✉", href: "/admin/contact" },
  { id: "settings", label: "Settings", icon: "⚙", href: "/admin/settings" },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside
      style={{
        width: 220,
        background: "var(--sidebar)",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #141420",
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid #141420",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GoVizMark size={30} color="#032bff" />
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#fff",
              }}
            >
              GOVIZ
            </div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "#333",
                textTransform: "uppercase",
              }}
            >
              Admin CMS
            </div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "16px 0" }}>
        {SECTIONS.map((s) => {
          const active = isActive(s.href);
          return (
            <Link
              key={s.id}
              href={s.href}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 24px",
                textAlign: "left",
                cursor: "pointer",
                color: active ? "#fff" : "#666",
                borderLeft: `3px solid ${active ? "var(--blue)" : "transparent"}`,
                background: active ? "rgba(3,43,255,0.08)" : "transparent",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>
                {s.icon}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "0.04em",
                }}
              >
                {s.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          padding: "20px 24px",
          borderTop: "1px solid #141420",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "#555",
            textDecoration: "none",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>↗</span> View Portfolio
        </Link>
        <button
          onClick={signOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "#555",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textAlign: "left",
          }}
        >
          <span>⏻</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
