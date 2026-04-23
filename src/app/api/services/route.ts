import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { badRequest, requireAdmin, serverError } from "@/lib/api";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return serverError(error.message);
  return NextResponse.json({ services: data ?? [] });
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

  const { data: maxRow } = await auth.supabase
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (maxRow?.sort_order ?? 0) + 1;
  const num =
    typeof input.num === "string"
      ? input.num
      : String(nextOrder).padStart(2, "0");

  const { data, error } = await auth.supabase
    .from("services")
    .insert({
      num,
      title,
      description:
        typeof input.description === "string" ? input.description : "",
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ service: data }, { status: 201 });
}
