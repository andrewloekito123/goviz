import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { badRequest, requireAdmin, serverError, slugify } from "@/lib/api";
import type { ProjectUpdate } from "@/lib/supabase/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return serverError(error.message);
  if (!data)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project: data });
}

const WRITABLE = new Set<keyof ProjectUpdate>([
  "slug",
  "title",
  "year",
  "location",
  "category",
  "description",
  "tags",
  "pattern_angle",
  "pattern_color",
  "bg_color",
  "cover_url",
  "model_url",
  "meta_title",
  "meta_desc",
  "published",
  "sort_order",
]);

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const input = (body ?? {}) as Record<string, unknown>;
  const patch: ProjectUpdate = {};
  for (const key of Object.keys(input) as (keyof ProjectUpdate)[]) {
    if (WRITABLE.has(key)) {
      (patch as Record<string, unknown>)[key] = input[key];
    }
  }

  if (typeof patch.slug === "string" && patch.slug.trim()) {
    patch.slug = slugify(patch.slug);
  } else if ("slug" in patch) {
    delete patch.slug;
  }

  const { data, error } = await auth.supabase
    .from("projects")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ project: data });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { id } = await ctx.params;
  const { error } = await auth.supabase
    .from("projects")
    .delete()
    .eq("id", id);
  if (error) return serverError(error.message);
  return NextResponse.json({ ok: true });
}
