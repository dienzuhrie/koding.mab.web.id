"use client";

import { useRef, useState, useTransition } from "react";
import { RouteIcon } from "@/components/icons";
import {
  createPrerequisite,
  updatePrerequisite,
  deletePrerequisite,
} from "./actions";

type Item = {
  id: number;
  nama: string;
  deskripsi: string | null;
  downloadUrl: string | null;
  videoUrl: string | null;
};

export default function PrerequisiteManager({
  items: initialItems,
}: {
  items: Item[];
}) {
  const [items, setItems] = useState(initialItems);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-3.5 mb-5">
        {items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onUpdated={(updated) =>
              setItems((prev) =>
                prev.map((x) => (x.id === updated.id ? updated : x))
              )
            }
            onDeleted={(id) =>
              setItems((prev) => prev.filter((x) => x.id !== id))
            }
          />
        ))}
        {items.length === 0 && !showAddForm && (
          <p className="text-sm text-muted">
            Belum ada tools. Tambahkan yang pertama di bawah.
          </p>
        )}
      </div>

      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="btn-press w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-border-soft text-brand-600 text-sm font-bold hover:border-brand-400 hover:bg-brand-50/60 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Tambah Tools
        </button>
      ) : (
        <AddForm
          onSaved={(item) => {
            setItems((prev) => [...prev, item]);
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

function ItemRow({
  item,
  onUpdated,
  onDeleted,
}: {
  item: Item;
  onUpdated: (item: Item) => void;
  onDeleted: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (editing) {
    return (
      <ItemForm
        item={item}
        onSaved={(updated) => {
          onUpdated(updated);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="bg-white border border-border-soft rounded-2xl p-4.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
            <RouteIcon size={18} />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-sm truncate">{item.nama}</div>
            {item.deskripsi && (
              <div className="text-xs text-muted line-clamp-1">
                {item.deskripsi}
              </div>
            )}
          </div>
        </div>

        {!confirmDelete ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              title="Edit"
              className="btn-press p-1.5 rounded-lg text-muted hover:text-brand-700 hover:bg-brand-100"
            >
              ✎
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              title="Hapus"
              className="btn-press p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50"
            >
              🗑
            </button>
          </div>
        ) : (
          <ConfirmDelete
            id={item.id}
            onCancel={() => setConfirmDelete(false)}
            onDeleted={onDeleted}
          />
        )}
      </div>
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
        await deletePrerequisite(id);
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

function AddForm({
  onSaved,
  onClose,
}: {
  onSaved: (item: Item) => void;
  onClose: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const item = await createPrerequisite(formData);
        onSaved(item);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-brand-900 rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="text-accent-300 text-xs font-bold tracking-wide">
        TAMBAH TOOLS BARU
      </div>
      <div className="reveal reveal-1">
        <label className="block text-xs font-bold text-brand-100 mb-1.5">
          Nama Tools
        </label>
        <input
          name="nama"
          required
          autoFocus
          placeholder="contoh: Visual Studio Code"
          className="input-focus w-full px-3 py-2.5 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
        />
      </div>
      <div className="reveal reveal-2">
        <label className="block text-xs font-bold text-brand-100 mb-1.5">
          Deskripsi (kenapa pakai ini)
        </label>
        <textarea
          name="deskripsi"
          rows={3}
          placeholder="contoh: Editor kode ringan dan populer untuk web development..."
          className="input-focus w-full px-3 py-2.5 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
        />
      </div>
      <div className="reveal reveal-3">
        <label className="block text-xs font-bold text-brand-100 mb-1.5">
          Link Download
        </label>
        <input
          name="downloadUrl"
          placeholder="https://code.visualstudio.com/download"
          className="input-focus w-full px-3 py-2.5 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
        />
      </div>
      <div className="reveal reveal-4">
        <label className="block text-xs font-bold text-brand-100 mb-1.5">
          Video Tutorial Instalasi (YouTube)
        </label>
        <input
          name="videoUrl"
          placeholder="https://youtube.com/watch?v=..."
          className="input-focus w-full px-3 py-2.5 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
        />
      </div>

      {error && <p className="text-xs font-semibold text-red-300">{error}</p>}

      <div className="flex gap-2.5">
        <button
          type="submit"
          disabled={isPending}
          className="btn-press flex-1 bg-accent-400 text-brand-800 font-extrabold text-sm py-2.75 rounded-xl disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Tools"}
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

function ItemForm({
  item,
  onSaved,
  onCancel,
}: {
  item: Item;
  onSaved: (item: Item) => void;
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
        const updated = await updatePrerequisite(formData);
        onSaved(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="reveal bg-brand-50 border border-brand-100 rounded-2xl p-4.5 flex flex-col gap-2.5"
    >
      <input type="hidden" name="id" value={item.id} />
      <input
        name="nama"
        required
        defaultValue={item.nama}
        autoFocus
        className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm font-semibold"
      />
      <textarea
        name="deskripsi"
        rows={2}
        defaultValue={item.deskripsi ?? ""}
        placeholder="Deskripsi"
        className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm"
      />
      <input
        name="downloadUrl"
        defaultValue={item.downloadUrl ?? ""}
        placeholder="Link download"
        className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm"
      />
      <input
        name="videoUrl"
        defaultValue={item.videoUrl ?? ""}
        placeholder="Link video tutorial YouTube"
        className="input-focus w-full px-3 py-2 rounded-lg border border-border-soft bg-white text-sm"
      />

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
