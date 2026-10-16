"use client";

import { useRef } from "react";
import { addBahan } from "./actions";

type Pertemuan = { id: number; judul: string; urutan: number };

const tipeOptions = [
  { value: "lks", label: "Lembar Kerja Siswa (LKS)" },
  { value: "ppt", label: "Slide/PPT" },
  { value: "materi", label: "Materi" },
  { value: "lainnya", label: "Lainnya" },
];

export default function BahanForm({ pertemuan }: { pertemuan: Pertemuan[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-brand-900 rounded-2xl p-6 h-fit">
      <div className="text-accent-300 text-xs font-bold mb-4.5 tracking-wide">
        TAMBAH BAHAN AJAR
      </div>

      <form
        ref={formRef}
        action={async (formData) => {
          await addBahan(formData);
          formRef.current?.reset();
        }}
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
          <input
            type="file"
            name="file"
            required
            accept=".pdf,.ppt,.pptx,.doc,.docx,.zip"
            className="w-full text-xs text-brand-100"
          />
        </div>

        <button
          type="submit"
          className="btn-press w-full bg-accent-400 text-brand-800 font-extrabold text-sm py-3 rounded-xl mt-1"
        >
          Simpan Bahan Ajar
        </button>
      </form>
    </div>
  );
}
