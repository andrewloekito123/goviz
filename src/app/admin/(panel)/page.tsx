import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/Header";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: projects }, { data: services }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("services").select("id"),
  ]);

  const allProjects = projects ?? [];
  const published = allProjects.filter((p) => p.published).length;
  const drafts = allProjects.length - published;

  const stats = [
    {
      label: "Total Projects",
      value: allProjects.length,
      color: "var(--blue)",
    },
    { label: "Published", value: published, color: "var(--success)" },
    { label: "Draft", value: drafts, color: "#e8a020" },
    {
      label: "Services",
      value: (services ?? []).length,
      color: "var(--muted)",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back — here's your content overview."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
          gap: 12,
          marginBottom: 40,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: "24px",
              border: "1px solid var(--border)",
              background: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Recent Projects
        </div>
        <Link
          href="/admin/projects"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--blue)",
            textDecoration: "none",
          }}
        >
          Manage all →
        </Link>
      </div>

      <div style={{ border: "1px solid var(--border)" }}>
        {allProjects.length === 0 && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 14,
              background: "#fff",
            }}
          >
            No projects yet.
          </div>
        )}
        {allProjects.slice(0, 5).map((p, i, arr) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
              borderBottom:
                i < arr.length - 1 ? "1px solid var(--border)" : "none",
              background: "#fff",
            }}
          >
            <div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{p.title}</span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  marginLeft: 12,
                }}
              >
                {p.location} · {p.year}
              </span>
            </div>
            <span
              style={{
                padding: "3px 10px",
                fontSize: 10,
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
        ))}
      </div>
    </div>
  );
}
