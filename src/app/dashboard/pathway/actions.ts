"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markBahanViewed(bahanId: number) {
  const session = await auth();
  if (!session?.user || session.user.role !== "siswa") return;

  const userId = Number(session.user.id);
  await prisma.kodingPathwayView.upsert({
    where: { userId_bahanId: { userId, bahanId } },
    update: { viewedAt: new Date() },
    create: { userId, bahanId },
  });
}
