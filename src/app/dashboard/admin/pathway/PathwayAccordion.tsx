"use client";

import { useRef, useState, useTransition } from "react";
import PertemuanCard from "./PertemuanCard";
import BahanForm from "./BahanForm";
import { createPertemuan } from "./actions";
import type { Bahan } from "./BahanRow";

type Pertemuan = { id: number; urutan: number; judul: string; bahan: Bahan[] };

export default function PathwayAccordion({
  pertemuan: initialPertemuan,
}: {
  pertemuan: Pertemuan[];
}) {
  const [pertemuan, setPertemuan] = useState(initialPertemuan);
  const [openId, setOpenId] = useState<number | null>(
    initialPertemuan[0]?.id ?? null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCreatePertemuan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const p = await createPertemuan(formData);
        setPertemuan((prev) => [...prev, { ...p, bahan: [] }]);
        setOpenId(p.id);
        formRef.current?.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <div>
      <form
        ref={formRef}
        onSubmit={handleCreatePertemuan}
        className="flex gap-2 mb-6 items-start"
      >
        <div className="flex-1">
          <input
            name="judul"
            required
            placeholder="Judul pertemuan baru"
            className="input-focus w-full px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          />
          {error && <p className="text-xs font-semibold text-red-600 mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="btn-press bg-accent-400 text-brand-800 font-extrabold text-sm px-4 py-2.5 rounded-lg whitespace-nowrap disabled:opacity-60"
        >
          {isPending ? "..." : "+ Tambah Pertemuan"}
        </button>
      </form>

      <div className="flex flex-wrap gap-6">
      <div className="flex-1 min-w-[320px] flex flex-col gap-3.5">
        {pertemuan.map((p) => (
          <PertemuanCard
            key={p.id}
            pertemuanId={p.id}
            urutan={p.urutan}
            judul={p.judul}
            initialBahan={p.bahan}
            isOpen={openId === p.id}
            onToggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))}
            onPertemuanUpdated={(updated) =>
              setPertemuan((prev) =>
                prev.map((x) =>
                  x.id === updated.id ? { ...x, judul: updated.judul } : x
                )
              )
            }
            onPertemuanDeleted={(id) => {
              setPertemuan((prev) => prev.filter((x) => x.id !== id));
              setOpenId((cur) => (cur === id ? null : cur));
            }}
          />
        ))}
        {pertemuan.length === 0 && (
          <p className="text-sm text-muted">
            Belum ada pertemuan. Tambahkan pertemuan pertama di atas.
          </p>
        )}
      </div>

      <div className="flex-1 min-w-[300px]">
        {pertemuan.length > 0 ? (
          <BahanForm
            pertemuan={pertemuan}
            onAdded={(pertemuanId, bahan) => {
              setPertemuan((prev) =>
                prev.map((p) =>
                  p.id === pertemuanId ? { ...p, bahan: [...p.bahan, bahan] } : p
                )
              );
              setOpenId(pertemuanId);
            }}
          />
        ) : (
          <p className="text-sm text-muted">
            Tambahkan minimal satu pertemuan sebelum menambahkan bahan ajar.
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
