"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";

export async function createPertemuan(formData: FormData) {
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  if (!judul) throw new Error("Judul pertemuan wajib diisi.");

  const last = await prisma.kodingPertemuan.findFirst({
    orderBy: { urutan: "desc" },
  });
  const urutan = (last?.urutan ?? 0) + 1;

  await prisma.kodingPertemuan.create({ data: { judul, deskripsi, urutan } });
  revalidatePath("/dashboard/admin/pathway");
  revalidatePath("/dashboard/pathway");
}

export async function addBahan(formData: FormData) {
  const pertemuanId = Number(formData.get("pertemuanId"));
  const judul = String(formData.get("judul") ?? "").trim();
  const tipe = String(formData.get("tipe")) as
    | "lks"
    | "ppt"
    | "materi"
    | "lainnya";
  const file = formData.get("file") as File | null;

  if (!pertemuanId || !judul) {
    throw new Error("Pertemuan dan judul bahan ajar wajib diisi.");
  }
  if (!file || file.size === 0) {
    throw new Error("File bahan ajar wajib diupload.");
  }

  const fileUrl = await saveUpload(file, "pathway");

  const last = await prisma.kodingBahanAjar.findFirst({
    where: { pertemuanId },
    orderBy: { urutan: "desc" },
  });
  const urutan = (last?.urutan ?? 0) + 1;

  await prisma.kodingBahanAjar.create({
    data: { pertemuanId, judul, tipe, fileUrl, urutan },
  });

  revalidatePath("/dashboard/admin/pathway");
  revalidatePath("/dashboard/pathway");
}
