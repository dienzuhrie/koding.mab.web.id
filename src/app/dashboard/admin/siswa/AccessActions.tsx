"use client";

import { useTransition } from "react";
import { toggleStatus, changeRole } from "./actions";

export default function AccessActions({
  accessId,
  role,
  status,
}: {
  accessId: number;
  role: "siswa" | "guru";
  status: "active" | "inactive";
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={role}
        disabled={isPending}
        onChange={(e) =>
          startTransition(() =>
            changeRole(accessId, e.target.value as "siswa" | "guru")
          )
        }
        className="text-xs font-bold border border-border-soft rounded-lg px-2 py-1.5 bg-white"
      >
        <option value="siswa">Siswa</option>
        <option value="guru">Guru</option>
      </select>
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
    </div>
  );
}
