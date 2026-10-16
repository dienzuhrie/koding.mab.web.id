"use client";

import { useRef, useState } from "react";
import { addSoal } from "../actions";

export default function SoalForm({ kuisId }: { kuisId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [correct, setCorrect] = useState(0);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addSoal(formData);
        formRef.current?.reset();
        setCorrect(0);
      }}
      className="bg-white border border-border-soft rounded-2xl p-6"
    >
      <input type="hidden" name="kuisId" value={kuisId} />

      <label className="block text-xs font-bold text-muted mb-1.5">
        Pertanyaan
      </label>
      <input
        name="pertanyaan"
        required
        placeholder="Tulis pertanyaan di sini"
        className="w-full px-3.5 py-3 rounded-lg border border-border-soft text-sm font-semibold mb-5"
      />

      <label className="block text-xs font-bold text-muted mb-2.5">
        Opsi Jawaban (pilih kunci jawaban)
      </label>
      <div className="flex flex-col gap-2.5 mb-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <input
              type="radio"
              name="correct"
              value={i}
              checked={correct === i}
              onChange={() => setCorrect(i)}
              className="w-4 h-4 accent-brand-500"
            />
            <input
              name="opsi"
              placeholder={`Opsi ${i + 1}`}
              required={i < 2}
              className={`flex-1 px-3 py-2.5 rounded-lg border text-sm ${
                correct === i
                  ? "border-brand-400 bg-brand-50 font-semibold text-brand-700"
                  : "border-border-soft"
              }`}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="bg-accent-400 text-brand-800 font-extrabold text-sm px-6 py-2.75 rounded-xl"
      >
        Simpan Soal
      </button>
    </form>
  );
}
