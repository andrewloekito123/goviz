import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { badRequest, requireAdmin, serverError, slugify } from "@/lib/api";

export async function GET(req: NextRequest) {
  const includeDrafts = req.nextUrl.searchParams.get("all") === "1";
  const supabase = await createSupabaseServerClient();

  const query = supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data, error } = includeDrafts
    ? await query
    : await query.eq("published", true);

  if (error) return serverError(error.message);
  return NextResponse.json({ projects: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const input = (body ?? {}) as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) return badRequest("title is required");

  const baseSlug =
    typeof input.slug === "string" && input.slug.trim()
      ? slugify(input.slug)
      : slugify(title);

  // Ensure slug uniqueness
  const { data: existing } = await auth.supabase
    .from("projects")
    .select("slug")
    .ilike("slug", `${baseSlug}%`);
  const taken = new Set((existing ?? []).map((r) => r.slug));
  let slug = baseSlug;
  let i = 2;
  while (taken.has(slug)) slug = `${baseSlug}-${i++}`;

  const { data: maxRow } = await auth.supabase
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? 0) + 1;

  const row = {
    slug,
    title,
    year:
      typeof input.year === "string"
        ? input.year
        : String(new Date().getFullYear()),
    location: typeof input.location === "string" ? input.location : "",
    category: typeof input.category === "string" ? input.category : "",
    description:
      typeof input.description === "string" ? input.description : "",
    tags: Array.isArray(input.tags)
      ? (input.tags as unknown[]).filter(
          (t): t is string => typeof t === "string",
        )
      : [],
    pattern_angle:
      typeof input.pattern_angle === "number" ? input.pattern_angle : 0,
    pattern_color:
      typeof input.pattern_color === "string"
        ? input.pattern_color
        : "#bcc5e8",
    bg_color:
      typeof input.bg_color === "string" ? input.bg_color : "#1a1d2e",
    cover_url:
      typeof input.cover_url === "string" ? input.cover_url : null,
    model_url:
      typeof input.model_url === "string" ? input.model_url : null,
    meta_title:
      typeof input.meta_title === "string" ? input.meta_title : null,
    meta_desc:
      typeof input.meta_desc === "string" ? input.meta_desc : null,
    published: input.published === true,
    sort_order: nextOrder,
  };

  const { data, error } = await auth.supabase
    .from("projects")
    .insert(row)
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ project: data }, { status: 201 });
}
