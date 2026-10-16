import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SoalForm from "./SoalForm";

export default async function KuisEditorPage({
  params,
}: {
  params: Promise<{ kuisId: string }>;
}) {
  const { kuisId: kuisIdParam } = await params;
  const kuisId = Number(kuisIdParam);

  const kuis = await prisma.kodingKuis.findUnique({
    where: { id: kuisId },
    include: {
      bab: true,
      soal: { orderBy: { urutan: "asc" }, include: { opsi: true } },
    },
  });
  if (!kuis) notFound();

  return (
    <div>
      <div className="text-xs font-bold text-brand-600 mb-1">
        BAB {kuis.bab.urutan} · {kuis.bab.judul}
      </div>
      <h1 className="text-2xl font-extrabold mb-7">{kuis.judul}</h1>

      <div className="flex flex-col gap-3 max-w-2xl mb-8">
        {kuis.soal.map((s, i) => (
          <div
            key={s.id}
            className="bg-white border border-border-soft rounded-2xl p-5"
          >
            <div className="text-xs font-bold text-muted mb-1.5">
              SOAL {i + 1}
            </div>
            <div className="font-bold text-sm mb-3">{s.pertanyaan}</div>
            <div className="flex flex-col gap-1.5">
              {s.opsi.map((o) => (
                <div
                  key={o.id}
                  className={`text-sm px-3 py-2 rounded-lg ${
                    o.isCorrect
                      ? "bg-brand-50 text-brand-700 font-bold"
                      : "text-muted"
                  }`}
                >
                  {o.label} {o.isCorrect && "✓"}
                </div>
              ))}
            </div>
          </div>
        ))}
        {kuis.soal.length === 0 && (
          <p className="text-sm text-muted">Belum ada soal. Tambahkan di bawah.</p>
        )}
      </div>

      <div className="max-w-2xl">
        <h2 className="text-base font-extrabold mb-3.5">
          + Tambah Soal Baru
        </h2>
        <SoalForm kuisId={kuisId} />
      </div>
    </div>
  );
}
