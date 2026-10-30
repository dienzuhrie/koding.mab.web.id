"use client";

import { useState, useTransition } from "react";
import PreviewModal from "@/components/PreviewModal";
import { EyeIcon, FileTextIcon } from "@/components/icons";
import { getFileTypeMeta } from "@/lib/fileType";
import { updateBahan, deleteBahan } from "./actions";

export type Bahan = {
  id: number;
  judul: string;
  tipe: "lks" | "ppt" | "materi" | "lainnya";
  fileUrl: string;
};

const tipeLabel: Record<string, string> = {
  lks: "LKS",
  ppt: "PPT",
  materi: "Materi",
  lainnya: "Lainnya",
};
const tipeOptions = [
  { value: "lks", label: "Lembar Kerja Siswa (LKS)" },
  { value: "ppt", label: "Slide/PPT" },
  { value: "materi", label: "Materi" },
  { value: "lainnya", label: "Lainnya" },
];

export default function BahanRow({
  bahan,
  onUpdated,
  onDeleted,
}: {
  bahan: Bahan;
  onUpdated: (bahan: Bahan) => void;
  onDeleted: (id: number) => void;
}) {
  const [preview, setPreview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (editing) {
    return (
      <BahanEditForm
        bahan={bahan}
        onSaved={(updated) => {
          onUpdated(updated);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  const fileMeta = getFileTypeMeta(bahan.fileUrl);

  return (
    <div className="group flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-colors hover:bg-brand-50/60">
      <button
        type="button"
        onClick={() => setPreview(true)}
        className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
      >
        <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 ${fileMeta.bg} ${fileMeta.text}`}>
          <FileTextIcon size={15} />
        </div>
        <div className="flex-1 min-w-0 text-sm font-bold truncate">
          {bahan.judul}
        </div>
        <span className="text-[10px] text-muted shrink-0 hidden sm:inline">
          {tipeLabel[bahan.tipe]}
        </span>
      </button>

      {!confirmingDelete ? (
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setPreview(true)}
            title="Pratinjau"
            className="btn-press p-1.5 rounded-lg text-muted hover:text-brand-700 hover:bg-brand-100"
          >
            <EyeIcon size={15} />
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Edit"
            className="btn-press p-1.5 rounded-lg text-muted hover:text-brand-700 hover:bg-brand-100 text-sm"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            title="Hapus"
            className="btn-press p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 text-sm"
          >
            🗑
          </button>
        </div>
      ) : (
        <ConfirmDelete
          id={bahan.id}
          onCancel={() => setConfirmingDelete(false)}
          onDeleted={onDeleted}
        />
      )}

      <PreviewModal
        open={preview}
        onClose={() => setPreview(false)}
        title={bahan.judul}
        fileUrl={bahan.fileUrl}
      />
    </div>
  );
}

function ConfirmDelete({
  id,
  onCancel,
  onDeleted,
}: {
  id: number;
  onCancel: () => void;
  onDeleted: (id: number) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteBahan(id);
        onDeleted(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menghapus.");
      }
    });
  }

  return (
    <div className="reveal flex items-center gap-2 shrink-0">
      {error && <span className="text-[10px] text-red-600">{error}</span>}
      <span className="text-xs font-bold text-muted whitespace-nowrap">Hapus?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="btn-press text-xs font-bold text-white bg-red-600 px-2.5 py-1 rounded-lg disabled:opacity-60"
      >
        {isPending ? "..." : "Ya"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="btn-press text-xs font-bold text-muted px-2.5 py-1 rounded-lg hover:bg-gray-100"
      >
        Batal
      </button>
    </div>
  );
}

function BahanEditForm({
  bahan,
  onSaved,
  onCancel,
}: {
  bahan: Bahan;
  onSaved: (bahan: Bahan) => void;
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
        const updated = await updateBahan(formData);
        onSaved(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="reveal bg-brand-50 border border-brand-100 rounded-xl p-3.5 flex flex-col gap-2.5"
    >
      <input type="hidden" name="id" value={bahan.id} />

      <input
        name="judul"
        required
        defaultValue={bahan.judul}
        autoFocus
        className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm font-semibold"
      />

      <select
        name="tipe"
        defaultValue={bahan.tipe}
        className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm"
      >
        {tipeOptions.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <div>
        <input
          type="file"
          name="file"
          accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
          className="w-full text-xs text-muted"
        />
        <p className="text-[10px] text-muted mt-1">
          Kosongkan kalau tidak ingin ganti file.
        </p>
      </div>

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-press flex-1 bg-accent-400 text-brand-800 font-extrabold text-xs py-2.5 rounded-lg disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="btn-press px-3 py-2.5 rounded-lg text-xs font-bold text-muted hover:bg-gray-100"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
