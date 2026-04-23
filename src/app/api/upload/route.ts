import { NextResponse, type NextRequest } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MODEL_EXT = [".glb", ".gltf"];
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

// 100 MB for models, 10 MB for cover images
const MODEL_MAX = 100 * 1024 * 1024;
const IMAGE_MAX = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Gate token issuance on admin auth.
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized");

        const lower = pathname.toLowerCase();
        const isModel = MODEL_EXT.some((e) => lower.endsWith(e));
        const isImage = IMAGE_EXT.some((e) => lower.endsWith(e));
        if (!isModel && !isImage) {
          throw new Error("Only .glb/.gltf or image files are allowed.");
        }

        return {
          allowedContentTypes: isModel
            ? ["model/gltf-binary", "model/gltf+json", "application/octet-stream"]
            : ["image/jpeg", "image/png", "image/webp", "image/avif"],
          maximumSizeInBytes: isModel ? MODEL_MAX : IMAGE_MAX,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: user.id, kind: isModel ? "model" : "image" }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Hook for post-upload bookkeeping — we update the project row from the client
        // after receiving the blob URL, so no-op here.
        console.log("[upload] completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
