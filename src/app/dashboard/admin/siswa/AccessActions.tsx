"use client";

import { useTransition } from "react";
import { toggleStatus } from "./actions";

export default function AccessActions({
  accessId,
  status,
}: {
  accessId: number;
  status: "active" | "inactive";
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleStatus(accessId))}
      disabled={isPending}
      className={`text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-50 ${
        status === "active"
          ? "bg-red-50 text-red-600"
          : "bg-brand-50 text-brand-700"
      }`}
    >
      {status === "active" ? "Nonaktifkan" : "Aktifkan"}
    </button>
  );
}
