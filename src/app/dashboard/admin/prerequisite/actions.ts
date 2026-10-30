"use server";

import { prisma } from "@/lib/prisma";

export async function createPrerequisite(formData: FormData) {
  const nama = String(formData.get("nama") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const downloadUrl = String(formData.get("downloadUrl") ?? "").trim() || null;
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null;

  if (!nama) throw new Error("Nama tools wajib diisi.");

  const last = await prisma.kodingPrerequisite.findFirst({
    orderBy: { urutan: "desc" },
  });
  const urutan = (last?.urutan ?? 0) + 1;

  return prisma.kodingPrerequisite.create({
    data: { nama, deskripsi, downloadUrl, videoUrl, urutan },
  });
}

export async function updatePrerequisite(formData: FormData) {
  const id = Number(formData.get("id"));
  const nama = String(formData.get("nama") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  const downloadUrl = String(formData.get("downloadUrl") ?? "").trim() || null;
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null;

  if (!id || !nama) throw new Error("Nama tools wajib diisi.");

  return prisma.kodingPrerequisite.update({
    where: { id },
    data: { nama, deskripsi, downloadUrl, videoUrl },
  });
}

export async function deletePrerequisite(id: number) {
  try {
    await prisma.kodingPrerequisite.delete({ where: { id } });
  } catch {
    throw new Error("Gagal menghapus tools. Coba lagi.");
  }
}
