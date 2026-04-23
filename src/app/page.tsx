import { createSupabaseServerClient } from "@/lib/supabase/server";
import HomePageClient from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const [projectsRes, servicesRes, settingsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);

  return (
    <HomePageClient
      projects={projectsRes.data ?? []}
      services={servicesRes.data ?? []}
      settings={settingsRes.data ?? null}
    />
  );
}
