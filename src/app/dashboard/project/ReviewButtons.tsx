"use client";

import { useState, useTransition } from "react";
import { reviewProject } from "./actions";

export default function ReviewButtons({ projectId }: { projectId: number }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState<"diterima" | "revisi" | null>(null);

  function review(status: "diterima" | "revisi") {
    startTransition(async () => {
      await reviewProject(projectId, status);
      setDone(status);
    });
  }

  if (done) {
    return (
      <span className="text-xs font-bold text-brand-600">
        {done === "diterima" ? "Diterima ✓" : "Diminta revisi"}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => review("diterima")}
        disabled={isPending}
        className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full disabled:opacity-50"
      >
        Terima
      </button>
      <button
        onClick={() => review("revisi")}
        disabled={isPending}
        className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full disabled:opacity-50"
      >
        Minta Revisi
      </button>
    </div>
  );
}
