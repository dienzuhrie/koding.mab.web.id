"use client";

import { useState } from "react";
import Link from "next/link";
import { submitKuis } from "../actions";

type Opsi = { id: number; label: string };
type Soal = { id: number; pertanyaan: string; opsi: Opsi[] };

export default function KuisClient({
  kuisId,
  judul,
  babLabel,
  soal,
}: {
  kuisId: number;
  judul: string;
  babLabel: string;
  soal: Soal[];
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{
    skor: number;
    correct: number;
    total: number;
    correctOpsiIds: Record<number, number>;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const current = soal[index];
  const isLast = index === soal.length - 1;
  const picked = answers[current?.id];

  function pick(opsiId: number) {
    if (result) return;
    setAnswers((a) => ({ ...a, [current.id]: opsiId }));
  }

  async function handleNext() {
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    const res = await submitKuis(kuisId, answers);
    setResult(res);
    setSubmitting(false);
  }

  if (soal.length === 0) {
    return <p className="text-sm text-muted">Kuis ini belum memiliki soal.</p>;
  }

  if (result) {
    return (
      <div className="max-w-xl mx-auto text-center py-10">
        <div className="text-xs font-bold text-brand-600 mb-2">{babLabel}</div>
        <h1 className="text-xl font-extrabold mb-6">{judul} — Selesai!</h1>
        <div className="reveal inline-flex items-center justify-center w-32 h-32 rounded-full bg-brand-50 text-brand-700 text-4xl font-extrabold mb-4">
          {result.skor}
        </div>
        <p className="text-sm text-muted mb-7">
          Benar {result.correct} dari {result.total} soal
        </p>
        <Link
          href="/dashboard/kuis"
          className="btn-press inline-block bg-accent-400 text-brand-800 font-extrabold text-sm px-6 py-3 rounded-xl"
        >
          Kembali ke Daftar Kuis
        </Link>
      </div>
    );
  }

  return (
    <div key={index} className="reveal max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-xs font-bold text-muted">{babLabel}</span>
        <span className="text-xs font-bold text-muted">
          Soal {index + 1} dari {soal.length}
        </span>
      </div>
      <div className="h-2 bg-[#e3eee6] rounded-full overflow-hidden mb-7">
        <div
          className="h-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${((index + 1) / soal.length) * 100}%` }}
        />
      </div>

      <h1 className="text-xl font-extrabold mb-6 leading-snug">
        {current.pertanyaan}
      </h1>

      <div className="flex flex-col gap-3 mb-7">
        {current.opsi.map((o) => (
          <button
            key={o.id}
            onClick={() => pick(o.id)}
            className={`btn-press block w-full text-left px-4.5 py-4 rounded-xl text-[15px] font-semibold border-2 transition-colors ${
              picked === o.id
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-border-soft bg-white hover:border-brand-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={picked === undefined || submitting}
          className="btn-press bg-accent-400 text-brand-800 font-extrabold text-sm px-7 py-3 rounded-xl disabled:opacity-50"
        >
          {submitting
            ? "Menilai..."
            : isLast
            ? "Selesai Kuis"
            : "Soal Selanjutnya →"}
        </button>
      </div>
    </div>
  );
}
