"use client";

import { useState, type CSSProperties } from "react";
import { upload } from "@vercel/blob/client";

type Props = {
  kind: "image" | "model";
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
};

const MAX_MB = { image: 10, model: 100 };

function prettySize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function UploadDropzone({
  kind,
  currentUrl,
  onUploaded,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [localName, setLocalName] = useState<string | null>(null);
  const [localSize, setLocalSize] = useState<number | null>(null);

  const accept = kind === "image" ? "image/*" : ".glb,.gltf";

  const handleFile = async (file: File) => {
    setErr(null);
    setProgress(0);
    setBusy(true);
    setLocalName(file.name);
    setLocalSize(file.size);

    const maxBytes = MAX_MB[kind] * 1024 * 1024;
    if (file.size > maxBytes) {
      setErr(`File exceeds ${MAX_MB[kind]} MB limit.`);
      setBusy(false);
      return;
    }

    try {
      const folder = kind === "image" ? "covers" : "models";
      const ext = file.name.includes(".")
        ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
        : "";
      const base = file.name
        .slice(0, file.name.length - ext.length)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "file";
      const safePath = `${folder}/${base}${ext}`;

      const blob = await upload(safePath, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (event) => {
          setProgress(event.percentage);
        },
      });
      onUploaded(blob.url);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upload failed";
      setErr(message);
    } finally {
      setBusy(false);
    }
  };

  const baseStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed var(--border)",
    padding: "40px 24px",
    cursor: busy ? "wait" : "pointer",
    background:
      currentUrl || localName ? "rgba(3,43,255,0.03)" : "#fafaf8",
    transition: "border-color 0.2s",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div>
      <label
        style={baseStyle}
        onMouseEnter={(e) =>
          !busy && (e.currentTarget.style.borderColor = "var(--blue)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--border)")
        }
      >
        {busy && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 3,
              width: `${progress}%`,
              background: "var(--blue)",
              transition: "width 0.2s ease",
            }}
          />
        )}

        {kind === "image" ? (
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            style={{ marginBottom: 12, opacity: 0.3 }}
          >
            <rect
              x="4"
              y="4"
              width="32"
              height="32"
              rx="2"
              stroke="var(--fg)"
              strokeWidth="1.5"
            />
            <circle
              cx="14"
              cy="14"
              r="4"
              stroke="var(--fg)"
              strokeWidth="1.5"
            />
            <path
              d="M4 28l10-10 6 6 4-4 12 10"
              stroke="var(--fg)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            style={{ marginBottom: 12, opacity: 0.3 }}
          >
            <path
              d="M20 4L36 12.5V27.5L20 36L4 27.5V12.5L20 4Z"
              stroke="var(--fg)"
              strokeWidth="1.5"
            />
            <path
              d="M4 12.5L20 21M20 21L36 12.5M20 21V36"
              stroke="var(--fg)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}

        {busy ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Uploading… {Math.round(progress)}%
            </div>
            {localName && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                {localName}
              </div>
            )}
          </div>
        ) : localName && localSize != null ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{localName}</div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 4,
              }}
            >
              {prettySize(localSize)} — uploaded. Click to replace.
            </div>
          </div>
        ) : currentUrl ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {kind === "image" ? "Cover uploaded" : "Model uploaded"}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 4,
                maxWidth: 360,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentUrl}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 6,
              }}
            >
              Click to replace
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              {kind === "image"
                ? "Upload cover image"
                : "Upload 3D model"}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {kind === "image"
                ? "JPG, PNG, WEBP — max 10 MB"
                : ".GLB or .GLTF — max 100 MB"}
            </div>
            {kind === "model" && (
              <div
                style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}
              >
                .SKP → export as .GLB from SketchUp first
              </div>
            )}
          </>
        )}

        <input
          type="file"
          accept={accept}
          disabled={busy}
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </label>

      {err && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "var(--danger)",
          }}
        >
          {err}
        </div>
      )}
    </div>
  );
}
