"use client";

import { useEffect } from "react";

export type ToastState = { msg: string; type: "success" | "danger" } | null;

type Props = {
  toast: ToastState;
  onDismiss: () => void;
};

export default function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 2800);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background:
          toast.type === "danger" ? "var(--danger)" : "var(--fg)",
        color: "#fff",
        padding: "12px 22px",
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        animation: "goviz-toast-in 0.3s ease",
      }}
    >
      {toast.msg}
    </div>
  );
}
