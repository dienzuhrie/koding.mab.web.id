"use client";

import { useState, useTransition } from "react";
import { ChevronDownIcon } from "@/components/icons";
import RowErrorBoundary from "@/components/RowErrorBoundary";
import {
  updatePertemuan,
  deletePertemuan,
  saveTargetBelajar,
} from "./actions";
import BahanRow, { type Bahan } from "./BahanRow";

export default function PertemuanCard({
  pertemuanId,
  urutan,
  judul,
  bahan: bahanList,
  targets,
  onTargetsSaved,
  isOpen,
  onToggle,
  onPertemuanUpdated,
  onPertemuanDeleted,
  onBahanUpdated,
  onBahanDeleted,
}: {
  pertemuanId: number;
  urutan: number;
  judul: string;
  bahan: Bahan[];
  targets: string[];
  onTargetsSaved: (targets: string[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  onPertemuanUpdated: (p: { id: number; judul: string }) => void;
  onPertemuanDeleted: (id: number) => void;
  onBahanUpdated: (bahan: Bahan) => void;
  onBahanDeleted: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
      {editing ? (
        <PertemuanEditForm
          pertemuanId={pertemuanId}
          judul={judul}
          onSaved={(p) => {
            onPertemuanUpdated(p);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
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
              PERTEMUAN {urutan} · {bahanList.length} bahan
            </div>
            <div className="text-[15px] font-extrabold truncate">{judul}</div>
          </button>

          {!confirmDelete ? (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setEditing(true)}
                title="Edit Pertemuan"
                className="btn-press p-1.5 rounded-lg text-brand-600 hover:bg-brand-100"
              >
                ✎
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                title="Hapus Pertemuan"
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
            <PertemuanDeleteConfirm
              pertemuanId={pertemuanId}
              onCancel={() => setConfirmDelete(false)}
              onDeleted={onPertemuanDeleted}
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
            <TargetEditor
              pertemuanId={pertemuanId}
              targets={targets}
              onSaved={onTargetsSaved}
            />
            {bahanList.map((b) => (
              <RowErrorBoundary key={b.id}>
                <BahanRow
                  bahan={b}
                  onUpdated={onBahanUpdated}
                  onDeleted={onBahanDeleted}
                />
              </RowErrorBoundary>
            ))}
            {bahanList.length === 0 && (
              <div className="px-2.5 py-2 text-xs text-muted">
                Belum ada bahan ajar ditambahkan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TargetEditor({
  pertemuanId,
  targets,
  onSaved,
}: {
  pertemuanId: number;
  targets: string[];
  onSaved: (targets: string[]) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        onSaved(await saveTargetBelajar(pertemuanId, text));
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-accent-300/60 bg-accent-300/10 px-3 py-2.5 mb-1">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-bold text-brand-700">
          TARGET BELAJAR · {targets.length}
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setText(targets.join("\n"));
              setEditing(true);
            }}
            className="btn-press text-xs font-bold text-brand-700 px-2.5 py-1 rounded-lg hover:bg-white"
          >
            {targets.length ? "Ubah" : "+ Atur Target"}
          </button>
        )}
      </div>

      {editing ? (
        <div className="reveal mt-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            rows={5}
            placeholder={
              "Satu baris = satu target, contoh:\nMemahami struktur dasar PHP\nMampu membuat formulir dan membaca inputnya"
            }
            className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm"
          />
          {error && (
            <p className="text-xs font-semibold text-red-600 mt-1">{error}</p>
          )}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="btn-press bg-brand-700 text-white text-xs font-bold px-3 py-2 rounded-lg disabled:opacity-60"
            >
              {isPending ? "..." : "Simpan Target"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={isPending}
              className="btn-press text-xs font-bold text-muted px-3 py-2 rounded-lg hover:bg-white"
            >
              Batal
            </button>
          </div>
        </div>
      ) : targets.length > 0 ? (
        <ul className="mt-1.5 flex flex-col gap-1 text-xs">
          {targets.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-brand-600 font-bold">{i + 1}.</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-xs text-muted">
          Belum ada target belajar untuk pertemuan ini.
        </p>
      )}
    </div>
  );
}

function PertemuanEditForm({
  pertemuanId,
  judul,
  onSaved,
  onCancel,
}: {
  pertemuanId: number;
  judul: string;
  onSaved: (p: { id: number; judul: string }) => void;
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
        const p = await updatePertemuan(formData);
        onSaved(p);
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
      <input type="hidden" name="id" value={pertemuanId} />
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

function PertemuanDeleteConfirm({
  pertemuanId,
  onCancel,
  onDeleted,
}: {
  pertemuanId: number;
  onCancel: () => void;
  onDeleted: (id: number) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deletePertemuan(pertemuanId);
        onDeleted(pertemuanId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menghapus.");
      }
    });
  }

  return (
    <div className="reveal flex items-center gap-2 shrink-0">
      {error && <span className="text-[10px] text-red-600 max-w-[160px]">{error}</span>}
      <span className="text-xs font-bold text-muted whitespace-nowrap">Hapus?</span>
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
