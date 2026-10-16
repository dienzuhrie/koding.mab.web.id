"use client";

import { useState } from "react";
import BabCard from "./BabCard";

type Materi = {
  id: number;
  judul: string;
  tipe: "video" | "dokumen";
  urlYoutube: string | null;
  fileUrl: string | null;
};
type Bab = { id: number; urutan: number; judul: string; materi: Materi[] };

export default function MateriAccordion({ babs }: { babs: Bab[] }) {
  const [openId, setOpenId] = useState<number | null>(babs[0]?.id ?? null);

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
