"use client";

import { useState } from "react";
import ProtectedVideo from "@/components/ProtectedVideo";
import { RouteIcon } from "@/components/icons";

type Item = {
  id: number;
  nama: string;
  deskripsi: string | null;
  downloadUrl: string | null;
  videoUrl: string | null;
};

export default function PrerequisiteTabs({ items }: { items: Item[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);
  const active = items.find((i) => i.id === activeId) ?? null;

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted">
        Belum ada tools yang ditambahkan guru.
      </p>
    );
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={`btn-press shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              activeId === item.id
                ? "bg-brand-800 text-white"
                : "bg-white border border-border-soft text-muted hover:border-brand-300"
            }`}
          >
            <RouteIcon size={15} />
            {item.nama}
          </button>
        ))}
      </div>

      {active && (
        <div key={active.id} className="reveal bg-white border border-border-soft rounded-2xl p-6 max-w-3xl">
          <h2 className="text-xl font-extrabold mb-2">{active.nama}</h2>

          {active.deskripsi && (
            <p className="text-sm text-muted leading-relaxed mb-5 whitespace-pre-line">
              {active.deskripsi}
            </p>
          )}

          {active.downloadUrl && (
            <a
              href={active.downloadUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-press inline-flex items-center gap-2 bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-3 rounded-xl mb-6"
            >
              ⬇ Download {active.nama}
            </a>
          )}

          {active.videoUrl && (
            <div>
              <div className="text-xs font-bold text-brand-600 mb-2.5">
                VIDEO TUTORIAL INSTALASI &amp; KONFIGURASI
              </div>
              <ProtectedVideo youtubeUrl={active.videoUrl} />
            </div>
          )}

          {!active.downloadUrl && !active.videoUrl && !active.deskripsi && (
            <p className="text-sm text-muted">Belum ada detail untuk tools ini.</p>
          )}
        </div>
      )}
    </div>
  );
}
