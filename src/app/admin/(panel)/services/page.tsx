import { createSupabaseServerClient } from "@/lib/supabase/server";
import ServicesAdmin from "@/components/admin/ServicesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  return <ServicesAdmin initial={data ?? []} />;
}
