"use client";

import { useRef, useState, useTransition } from "react";
import FileDropzone from "@/components/FileDropzone";
import { addBahan } from "./actions";
import type { Bahan } from "./BahanRow";

type Pertemuan = { id: number; judul: string; urutan: number };

const tipeOptions = [
  { value: "lks", label: "Lembar Kerja Siswa (LKS)" },
  { value: "ppt", label: "Slide/PPT" },
  { value: "materi", label: "Materi" },
  { value: "lainnya", label: "Lainnya" },
];

export default function BahanForm({
  pertemuan,
  onAdded,
}: {
  pertemuan: Pertemuan[];
  onAdded: (pertemuanId: number, bahan: Bahan) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const pertemuanId = Number(formData.get("pertemuanId"));
    startTransition(async () => {
      try {
        const bahan = await addBahan(formData);
        onAdded(pertemuanId, bahan);
        formRef.current?.reset();
        setDropzoneKey((k) => k + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal menyimpan.");
      }
    });
  }

  return (
    <div className="bg-brand-900 rounded-2xl p-6 h-fit">
      <div className="text-accent-300 text-xs font-bold mb-4.5 tracking-wide">
        TAMBAH BAHAN AJAR
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block text-xs font-bold text-brand-100 mb-1.5">
            Pertemuan
          </label>
          <select
            name="pertemuanId"
            required
            className="input-focus w-full px-3 py-2.75 rounded-lg bg-[#0d3328] text-white text-sm border-none"
          >
            {pertemuan.map((p) => (
              <option key={p.id} value={p.id}>
                Pertemuan {p.urutan} · {p.judul}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-100 mb-1.5">
            Judul Bahan Ajar
          </label>
          <input
            name="judul"
            required
            placeholder="contoh: LKS Variabel & Tipe Data"
            className="input-focus w-full px-3 py-2.75 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-100 mb-1.5">
            Jenis Bahan
          </label>
          <select
            name="tipe"
            required
            className="input-focus w-full px-3 py-2.75 rounded-lg bg-[#0d3328] text-white text-sm border-none"
          >
            {tipeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-100 mb-1.5">
            Upload File (PDF/PPT/Word/ZIP)
          </label>
          <FileDropzone
            key={dropzoneKey}
            name="file"
            required
            accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
            hint="maks 25 MB"
          />
        </div>

        {error && <p className="text-xs font-semibold text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="btn-press w-full bg-accent-400 text-brand-800 font-extrabold text-sm py-3 rounded-xl mt-1 disabled:opacity-60"
        >
          {isPending ? "Menyimpan..." : "Simpan Bahan Ajar"}
        </button>
      </form>
    </div>
  );
}
