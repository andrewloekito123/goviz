import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { badRequest, requireAdmin, serverError } from "@/lib/api";
import type { SiteSettingsUpdate } from "@/lib/supabase/types";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) return serverError(error.message);
  return NextResponse.json({ settings: data });
}

const WRITABLE = new Set<keyof SiteSettingsUpdate>([
  "contact_email",
  "contact_phone",
  "contact_address",
  "studio_name",
  "studio_tagline",
  "studio_founded",
  "studio_city",
  "studio_country",
]);

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const input = (body ?? {}) as Record<string, unknown>;
  const patch: SiteSettingsUpdate = {};
  for (const key of Object.keys(input) as (keyof SiteSettingsUpdate)[]) {
    if (WRITABLE.has(key) && typeof input[key] === "string") {
      (patch as Record<string, unknown>)[key] = input[key];
    }
  }

  const { data, error } = await auth.supabase
    .from("site_settings")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ settings: data });
}
