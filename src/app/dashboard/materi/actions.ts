"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function completeMateri(materiId: number, babId: number) {
  const session = await auth();
  const userId = Number(session!.user.id);

  await prisma.kodingProgressMateri.upsert({
    where: { userId_materiId: { userId, materiId } },
    update: { status: "selesai", completedAt: new Date() },
    create: { userId, materiId, status: "selesai", completedAt: new Date() },
  });

  const materiList = await prisma.kodingMateri.findMany({
    where: { babId },
    orderBy: { urutan: "asc" },
  });
  const idx = materiList.findIndex((m) => m.id === materiId);
  const next = materiList[idx + 1];

  if (next) {
    await prisma.kodingProgressMateri.upsert({
      where: { userId_materiId: { userId, materiId: next.id } },
      update: {},
      create: { userId, materiId: next.id, status: "in_progress" },
    });
    revalidatePath(`/dashboard/materi/${babId}`);
    return;
  }

  const kuis = await prisma.kodingKuis.findFirst({ where: { babId } });
  revalidatePath(`/dashboard/materi/${babId}`);
  revalidatePath("/dashboard/materi");
  if (kuis) redirect(`/dashboard/kuis/${kuis.id}`);
  redirect("/dashboard/materi");
}
