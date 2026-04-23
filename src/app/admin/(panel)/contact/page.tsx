import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ContactAdmin } from "@/components/admin/SettingsForms";
import type { SiteSettingsRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const EMPTY: SiteSettingsRow = {
  id: 1,
  contact_email: "",
  contact_phone: "",
  contact_address: "",
  studio_name: "GOVIZ",
  studio_tagline: "Architecture & Visualisation",
  studio_founded: "2012",
  studio_city: "Copenhagen",
  studio_country: "Denmark",
  updated_at: new Date().toISOString(),
};

export default async function AdminContactPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return <ContactAdmin initial={data ?? EMPTY} />;
}
