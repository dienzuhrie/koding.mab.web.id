"use client";

import { useState, useTransition, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { createMateri } from "./actions";

export default function BabCard({
  babId,
  urutan,
  judul,
  jumlahMateri,
  defaultOpen = false,
  children,
}: {
  babId: number;
  urutan: number;
  judul: string;
  jumlahMateri: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex justify-between items-center gap-3 px-4.5 py-4 bg-brand-50 text-left transition-colors hover:bg-brand-100"
      >
        <div>
          <div className="text-[11px] font-bold text-brand-600">
            BAB {urutan} · {jumlahMateri} materi
          </div>
          <div className="text-[15px] font-extrabold">{judul}</div>
        </div>
        <ChevronDownIcon
          size={18}
          className={`shrink-0 text-brand-600 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3.5 py-2.5 flex flex-col gap-1.5">{children}</div>

          <div className="px-3.5 pb-3.5">
            {!showAddForm ? (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="btn-press w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border-soft text-brand-600 text-sm font-bold hover:border-brand-400 hover:bg-brand-50/60 transition-colors"
              >
                <span className="text-lg leading-none">+</span> Tambah Materi
              </button>
            ) : (
              <AddMateriForm
                babId={babId}
                onClose={() => setShowAddForm(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddMateriForm({
  babId,
  onClose,
}: {
  babId: number;
  onClose: () => void;
}) {
  const [tipe, setTipe] = useState<"video" | "dokumen">("video");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createMateri(formData);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan materi.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-900 rounded-xl p-5 flex flex-col gap-3.5"
    >
      <input type="hidden" name="babId" value={babId} />
      <input type="hidden" name="tipe" value={tipe} />

      <div className="reveal reveal-1">
        <label className="block text-xs font-bold text-brand-100 mb-1.5">
          Judul Materi
        </label>
        <input
          name="judul"
          required
          autoFocus
          placeholder="contoh: Box Model & Spacing"
          className="input-focus w-full px-3 py-2.5 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
        />
      </div>

      <div className="reveal reveal-2">
        <label className="block text-xs font-bold text-brand-100 mb-2">
          Tipe Materi
        </label>
        <div className="flex gap-2 bg-[#0d3328] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTipe("video")}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              tipe === "video"
                ? "bg-accent-400 text-brand-800 scale-[1.03]"
                : "text-brand-100 hover:bg-white/5"
            }`}
          >
            ▶ Video YouTube
          </button>
          <button
            type="button"
            onClick={() => setTipe("dokumen")}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              tipe === "dokumen"
                ? "bg-accent-400 text-brand-800 scale-[1.03]"
                : "text-brand-100 hover:bg-white/5"
            }`}
          >
            📄 Dokumen
          </button>
        </div>
      </div>

      <div className="reveal reveal-3">
        {tipe === "video" ? (
          <>
            <label className="block text-xs font-bold text-brand-100 mb-1.5">
              Link YouTube
            </label>
            <input
              name="urlYoutube"
              placeholder="https://youtube.com/watch?v=..."
              className="input-focus w-full px-3 py-2.5 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
            />
          </>
        ) : (
          <>
            <label className="block text-xs font-bold text-brand-100 mb-1.5">
              Upload Dokumen (PDF/Word)
            </label>
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx"
              className="w-full text-xs text-brand-100"
            />
          </>
        )}
      </div>

      {error && (
        <p className="reveal text-xs font-semibold text-red-300">{error}</p>
      )}

      <div className="reveal reveal-4 flex gap-2.5">
        <button
          type="submit"
          disabled={isPending}
          className="btn-press flex-1 bg-accent-400 text-brand-800 font-extrabold text-sm py-2.75 rounded-xl disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Materi"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="btn-press px-4 py-2.75 rounded-xl text-sm font-bold text-brand-100 hover:bg-white/5"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
