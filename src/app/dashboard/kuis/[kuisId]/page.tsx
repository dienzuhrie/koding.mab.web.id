import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import KuisClient from "./KuisClient";

export default async function KuisDetailPage({
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
      soal: {
        orderBy: { urutan: "asc" },
        include: { opsi: { select: { id: true, label: true } } },
      },
    },
  });

  if (!kuis) notFound();

  return (
    <KuisClient
      kuisId={kuis.id}
      judul={kuis.judul}
      babLabel={`BAB ${kuis.bab.urutan} · ${kuis.bab.judul.toUpperCase()}`}
      soal={kuis.soal.map((s) => ({
        id: s.id,
        pertanyaan: s.pertanyaan,
        opsi: s.opsi,
      }))}
    />
  );
}
