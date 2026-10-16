"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function submitKuis(
  kuisId: number,
  answers: Record<number, number>
) {
  const session = await auth();
  const userId = Number(session!.user.id);

  const soalList = await prisma.kodingSoal.findMany({
    where: { kuisId },
    include: { opsi: true },
  });

  let correct = 0;
  const correctOpsiIds: Record<number, number> = {};
  for (const soal of soalList) {
    const correctOpsi = soal.opsi.find((o) => o.isCorrect);
    if (correctOpsi) {
      correctOpsiIds[soal.id] = correctOpsi.id;
      if (answers[soal.id] === correctOpsi.id) correct++;
    }
  }

  const skor = soalList.length
    ? Math.round((correct / soalList.length) * 100)
    : 0;

  await prisma.kodingHasilKuis.create({ data: { userId, kuisId, skor } });

  revalidatePath(`/dashboard/kuis/${kuisId}`);
  revalidatePath("/dashboard/kuis");
  revalidatePath("/dashboard");

  return { skor, correctOpsiIds, total: soalList.length, correct };
}
