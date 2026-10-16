"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createKuis(formData: FormData) {
  const babId = Number(formData.get("babId"));
  const judul = String(formData.get("judul") ?? "").trim();
  if (!babId || !judul) throw new Error("BAB dan judul kuis wajib diisi.");

  await prisma.kodingKuis.create({ data: { babId, judul } });
  revalidatePath("/dashboard/admin/kuis");
}

export async function addSoal(formData: FormData) {
  const kuisId = Number(formData.get("kuisId"));
  const pertanyaan = String(formData.get("pertanyaan") ?? "").trim();
  const opsiLabels = formData.getAll("opsi").map((v) => String(v).trim());
  const correctIndex = Number(formData.get("correct"));

  if (!kuisId || !pertanyaan || opsiLabels.filter(Boolean).length < 2) {
    throw new Error("Pertanyaan dan minimal 2 opsi wajib diisi.");
  }

  const last = await prisma.kodingSoal.findFirst({
    where: { kuisId },
    orderBy: { urutan: "desc" },
  });
  const urutan = (last?.urutan ?? 0) + 1;

  await prisma.kodingSoal.create({
    data: {
      kuisId,
      pertanyaan,
      urutan,
      opsi: {
        create: opsiLabels
          .filter((label) => label.length > 0)
          .map((label, i) => ({ label, isCorrect: i === correctIndex })),
      },
    },
  });

  revalidatePath(`/dashboard/admin/kuis/${kuisId}`);
}
