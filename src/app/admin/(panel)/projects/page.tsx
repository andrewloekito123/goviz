import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProjectsAdmin from "@/components/admin/ProjectsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  return <ProjectsAdmin initial={data ?? []} />;
}
