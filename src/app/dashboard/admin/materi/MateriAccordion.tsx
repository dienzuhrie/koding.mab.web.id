"use client";

import { useState } from "react";
import BabCard from "./BabCard";
import type { Materi } from "./MateriRow";

type Bab = { id: number; urutan: number; judul: string; materi: Materi[] };

export default function MateriAccordion({ babs: initialBabs }: { babs: Bab[] }) {
  const [babs, setBabs] = useState(initialBabs);
  const [openId, setOpenId] = useState<number | null>(initialBabs[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-3.5 max-w-3xl">
      {babs.map((bab) => (
        <BabCard
          key={bab.id}
          babId={bab.id}
          urutan={bab.urutan}
          judul={bab.judul}
          initialMateri={bab.materi}
          isOpen={openId === bab.id}
          onToggle={() => setOpenId((cur) => (cur === bab.id ? null : bab.id))}
          onBabUpdated={(updated) =>
            setBabs((prev) =>
              prev.map((b) => (b.id === updated.id ? { ...b, judul: updated.judul } : b))
            )
          }
          onBabDeleted={(id) => {
            setBabs((prev) => prev.filter((b) => b.id !== id));
            setOpenId((cur) => (cur === id ? null : cur));
          }}
        />
      ))}
      {babs.length === 0 && (
        <p className="text-sm text-muted">
          Belum ada BAB. Tambahkan BAB pertama di atas.
        </p>
      )}
    </div>
  );
}
