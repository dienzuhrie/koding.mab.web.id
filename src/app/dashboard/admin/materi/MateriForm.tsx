"use client";

import { useState, useRef } from "react";
import { createMateri } from "./actions";

type Bab = { id: number; judul: string; urutan: number };

export default function MateriForm({ babs }: { babs: Bab[] }) {
  const [tipe, setTipe] = useState<"video" | "dokumen">("video");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-brand-900 rounded-2xl p-6 h-fit">
      <div className="text-accent-300 text-xs font-bold mb-4.5 tracking-wide">
        TAMBAH MATERI KE TOPIK
      </div>

      <form
        ref={formRef}
        action={async (formData) => {
          await createMateri(formData);
          formRef.current?.reset();
          setTipe("video");
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block text-xs font-bold text-brand-100 mb-1.5">
            Pilih BAB/Topik
          </label>
          <select
            name="babId"
            required
            className="w-full px-3 py-2.75 rounded-lg bg-[#0d3328] text-white text-sm border-none"
          >
            {babs.map((b) => (
              <option key={b.id} value={b.id}>
                BAB {b.urutan} · {b.judul}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-100 mb-1.5">
            Judul Materi
          </label>
          <input
            name="judul"
            required
            placeholder="contoh: Box Model & Spacing"
            className="w-full px-3 py-2.75 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-100 mb-2">
            Tipe Materi
          </label>
          <div className="flex gap-2 bg-[#0d3328] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTipe("video")}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold ${
                tipe === "video" ? "bg-accent-400 text-brand-800" : "text-brand-100"
              }`}
            >
              ▶ Video YouTube
            </button>
            <button
              type="button"
              onClick={() => setTipe("dokumen")}
              className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold ${
                tipe === "dokumen" ? "bg-accent-400 text-brand-800" : "text-brand-100"
              }`}
            >
              📄 Dokumen
            </button>
          </div>
          <input type="hidden" name="tipe" value={tipe} />
        </div>

        {tipe === "video" ? (
          <div>
            <label className="block text-xs font-bold text-brand-100 mb-1.5">
              Link YouTube
            </label>
            <input
              name="urlYoutube"
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2.75 rounded-lg bg-[#0d3328] text-white text-sm border-none placeholder:text-brand-100/50"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-brand-100 mb-1.5">
              Upload Dokumen (PDF/Word)
            </label>
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx"
              className="w-full text-xs text-brand-100"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-accent-400 text-brand-800 font-extrabold text-sm py-3 rounded-xl mt-1"
        >
          Simpan Materi
        </button>
      </form>
    </div>
  );
}
