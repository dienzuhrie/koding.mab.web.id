"use client";

import { useState, useTransition } from "react";
import PreviewModal from "@/components/PreviewModal";
import { EyeIcon } from "@/components/icons";
import { updateMateri, deleteMateri } from "./actions";

export type Materi = {
  id: number;
  judul: string;
  tipe: "video" | "dokumen";
  urlYoutube: string | null;
  fileUrl: string | null;
};

export default function MateriRow({
  materi,
  onUpdated,
  onDeleted,
}: {
  materi: Materi;
  onUpdated: (materi: Materi) => void;
  onDeleted: (id: number) => void;
}) {
  const [preview, setPreview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (editing) {
    return (
      <MateriEditForm
        materi={materi}
        onSaved={(updated) => {
          onUpdated(updated);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="group flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-colors hover:bg-brand-50/60">
      <button
        type="button"
        onClick={() => setPreview(true)}
        className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
      >
        <div
          className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
            materi.tipe === "video"
              ? "bg-red-50 text-red-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {materi.tipe === "video" ? "▶" : "📄"}
        </div>
        <div className="flex-1 min-w-0 text-sm font-bold truncate">
          {materi.judul}
        </div>
        <span className="text-[10px] text-muted shrink-0 hidden sm:inline">
          {materi.tipe === "video" ? "Video" : "Dokumen"}
        </span>
      </button>

      {!confirmingDelete ? (
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
          id={materi.id}
          onCancel={() => setConfirmingDelete(false)}
          onDeleted={onDeleted}
        />
      )}

      <PreviewModal
        open={preview}
        onClose={() => setPreview(false)}
        title={materi.judul}
        youtubeUrl={materi.urlYoutube}
        fileUrl={materi.fileUrl}
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
        await deleteMateri(id);
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

function MateriEditForm({
  materi,
  onSaved,
  onCancel,
}: {
  materi: Materi;
  onSaved: (materi: Materi) => void;
  onCancel: () => void;
}) {
  const [tipe, setTipe] = useState<"video" | "dokumen">(materi.tipe);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const updated = await updateMateri(formData);
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
      <input type="hidden" name="id" value={materi.id} />
      <input type="hidden" name="tipe" value={tipe} />

      <input
        name="judul"
        required
        defaultValue={materi.judul}
        autoFocus
        className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm font-semibold"
      />

      <div className="flex gap-2 bg-white p-1 rounded-lg border border-border-soft">
        <button
          type="button"
          onClick={() => setTipe("video")}
          className={`flex-1 text-center py-2 rounded-md text-xs font-bold transition-all ${
            tipe === "video" ? "bg-brand-700 text-white" : "text-muted"
          }`}
        >
          ▶ Video
        </button>
        <button
          type="button"
          onClick={() => setTipe("dokumen")}
          className={`flex-1 text-center py-2 rounded-md text-xs font-bold transition-all ${
            tipe === "dokumen" ? "bg-brand-700 text-white" : "text-muted"
          }`}
        >
          📄 Dokumen
        </button>
      </div>

      {tipe === "video" ? (
        <input
          name="urlYoutube"
          defaultValue={materi.urlYoutube ?? ""}
          placeholder="https://youtube.com/watch?v=..."
          className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm"
        />
      ) : (
        <div>
          <input
            type="file"
            name="file"
            accept=".pdf,.doc,.docx"
            className="w-full text-xs text-muted"
          />
          {materi.fileUrl && (
            <p className="text-[10px] text-muted mt-1">
              Kosongkan kalau tidak ingin ganti file.
            </p>
          )}
        </div>
      )}

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
