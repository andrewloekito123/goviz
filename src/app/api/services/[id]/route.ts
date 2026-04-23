import { NextResponse, type NextRequest } from "next/server";
import { badRequest, requireAdmin, serverError } from "@/lib/api";
import type { ServiceUpdate } from "@/lib/supabase/types";

type Ctx = { params: Promise<{ id: string }> };

const WRITABLE = new Set<keyof ServiceUpdate>([
  "num",
  "title",
  "description",
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
  const patch: ServiceUpdate = {};
  for (const key of Object.keys(input) as (keyof ServiceUpdate)[]) {
    if (WRITABLE.has(key)) {
      (patch as Record<string, unknown>)[key] = input[key];
    }
  }

  const { data, error } = await auth.supabase
    .from("services")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return NextResponse.json({ service: data });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const { id } = await ctx.params;

  const { error } = await auth.supabase
    .from("services")
    .delete()
    .eq("id", id);
  if (error) return serverError(error.message);
  return NextResponse.json({ ok: true });
}
