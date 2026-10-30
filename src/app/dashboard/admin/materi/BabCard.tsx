"use client";

import { useState, useTransition } from "react";
import { ChevronDownIcon } from "@/components/icons";
import RowErrorBoundary from "@/components/RowErrorBoundary";
import { createMateri, updateBab, deleteBab } from "./actions";
import MateriRow, { type Materi } from "./MateriRow";

export default function BabCard({
  babId,
  urutan,
  judul,
  initialMateri,
  isOpen,
  onToggle,
  onBabUpdated,
  onBabDeleted,
}: {
  babId: number;
  urutan: number;
  judul: string;
  initialMateri: Materi[];
  isOpen: boolean;
  onToggle: () => void;
  onBabUpdated: (bab: { id: number; judul: string }) => void;
  onBabDeleted: (id: number) => void;
}) {
  const [materiList, setMateriList] = useState(initialMateri);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBab, setEditingBab] = useState(false);
  const [confirmDeleteBab, setConfirmDeleteBab] = useState(false);

  return (
    <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
      {editingBab ? (
        <BabEditForm
          babId={babId}
          judul={judul}
          onSaved={(bab) => {
            onBabUpdated(bab);
            setEditingBab(false);
          }}
          onCancel={() => setEditingBab(false)}
        />
      ) : (
        <div className="group w-full flex justify-between items-center gap-3 px-4.5 py-4 bg-brand-50">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex-1 min-w-0 text-left"
          >
            <div className="text-[11px] font-bold text-brand-600">
              BAB {urutan} · {materiList.length} materi
            </div>
            <div className="text-[15px] font-extrabold truncate">{judul}</div>
          </button>

          {!confirmDeleteBab ? (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setEditingBab(true)}
                title="Edit BAB"
                className="btn-press p-1.5 rounded-lg text-brand-600 hover:bg-brand-100"
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteBab(true)}
                title="Hapus BAB"
                className="btn-press p-1.5 rounded-lg text-brand-600 hover:text-red-600 hover:bg-red-50"
              >
                🗑
              </button>
              <button type="button" onClick={onToggle} className="p-1.5">
                <ChevronDownIcon
                  size={18}
                  className={`shrink-0 text-brand-600 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          ) : (
            <BabDeleteConfirm
              babId={babId}
              onCancel={() => setConfirmDeleteBab(false)}
              onDeleted={onBabDeleted}
            />
          )}
        </div>
      )}

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3.5 py-2.5 flex flex-col gap-1.5">
            {materiList.map((m) => (
              <RowErrorBoundary key={m.id}>
                <MateriRow
                  materi={m}
                  onUpdated={(updated) =>
                    setMateriList((prev) =>
                      prev.map((x) => (x.id === updated.id ? updated : x))
                    )
                  }
                  onDeleted={(id) =>
                    setMateriList((prev) => prev.filter((x) => x.id !== id))
                  }
                />
              </RowErrorBoundary>
            ))}
            {materiList.length === 0 && (
              <div className="px-2.5 py-2 text-xs text-muted">
                Belum ada materi ditambahkan
              </div>
            )}
          </div>

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
                onSaved={(materi) => {
                  setMateriList((prev) => [...prev, materi]);
                  setShowAddForm(false);
                }}
                onClose={() => setShowAddForm(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BabEditForm({
  babId,
  judul,
  onSaved,
  onCancel,
}: {
  babId: number;
  judul: string;
  onSaved: (bab: { id: number; judul: string }) => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const bab = await updateBab(formData);
        onSaved(bab);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-4.5 py-3.5 bg-brand-50"
    >
      <input type="hidden" name="id" value={babId} />
      <input
        name="judul"
        required
        autoFocus
        defaultValue={judul}
        className="input-focus flex-1 min-w-0 px-3 py-2 rounded-lg border border-border-soft bg-white text-sm font-bold"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button
        type="submit"
        disabled={isPending}
        className="btn-press bg-brand-700 text-white text-xs font-bold px-3 py-2 rounded-lg disabled:opacity-60"
      >
        {isPending ? "..." : "Simpan"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="btn-press text-xs font-bold text-muted px-3 py-2 rounded-lg hover:bg-white"
      >
        Batal
      </button>
    </form>
  );
}

function BabDeleteConfirm({
  babId,
  onCancel,
  onDeleted,
}: {
  babId: number;
  onCancel: () => void;
  onDeleted: (id: number) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteBab(babId);
        onDeleted(babId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menghapus.");
      }
    });
  }

  return (
    <div className="reveal flex items-center gap-2 shrink-0">
      {error && <span className="text-[10px] text-red-600 max-w-[160px]">{error}</span>}
      <span className="text-xs font-bold text-muted whitespace-nowrap">Hapus BAB?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="btn-press text-xs font-bold text-white bg-red-600 px-2.5 py-1.5 rounded-lg disabled:opacity-60"
      >
        {isPending ? "..." : "Ya"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="btn-press text-xs font-bold text-muted px-2.5 py-1.5 rounded-lg hover:bg-white"
      >
        Batal
      </button>
    </div>
  );
}

function AddMateriForm({
  babId,
  onSaved,
  onClose,
}: {
  babId: number;
  onSaved: (materi: Materi) => void;
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
        const materi = await createMateri(formData);
        onSaved(materi);
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
