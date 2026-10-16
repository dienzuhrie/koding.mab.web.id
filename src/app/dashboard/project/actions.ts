"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";

export async function uploadProject(formData: FormData) {
  const session = await auth();
  const userId = Number(session!.user.id);

  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const linkDemo = String(formData.get("linkDemo") ?? "").trim() || null;
  const linkGithub = String(formData.get("linkGithub") ?? "").trim() || null;
  const file = formData.get("file") as File | null;

  if (!judul) throw new Error("Judul project wajib diisi.");

  let fileUrl: string | null = null;
  if (file && file.size > 0) {
    fileUrl = await saveUpload(file, "projects");
  }

  await prisma.kodingProject.create({
    data: { userId, judul, deskripsi, linkDemo, linkGithub, fileUrl },
  });

  revalidatePath("/dashboard/project");
  revalidatePath("/dashboard");
}

export async function reviewProject(
  projectId: number,
  status: "diterima" | "revisi",
  catatanGuru?: string
) {
  const session = await auth();
  if (session?.user.role !== "guru") throw new Error("Tidak diizinkan.");

  await prisma.kodingProject.update({
    where: { id: projectId },
    data: { status, catatanGuru: catatanGuru || null },
  });

  revalidatePath("/dashboard/project");
}
