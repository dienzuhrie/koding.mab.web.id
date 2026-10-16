"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/upload";

export async function createBab(formData: FormData) {
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  if (!judul) throw new Error("Judul BAB wajib diisi.");

  const last = await prisma.kodingBab.findFirst({ orderBy: { urutan: "desc" } });
  const urutan = (last?.urutan ?? 0) + 1;

  await prisma.kodingBab.create({ data: { judul, deskripsi, urutan } });
  revalidatePath("/dashboard/admin/materi");
}

export async function createMateri(formData: FormData) {
  const babId = Number(formData.get("babId"));
  const judul = String(formData.get("judul") ?? "").trim();
  const tipe = String(formData.get("tipe")) as "video" | "dokumen";
  const urlYoutube = String(formData.get("urlYoutube") ?? "").trim() || null;
  const file = formData.get("file") as File | null;

  if (!babId || !judul) throw new Error("BAB dan judul materi wajib diisi.");

  let fileUrl: string | null = null;
  if (tipe === "dokumen" && file && file.size > 0) {
    fileUrl = await saveUpload(file, "materi");
  }

  const last = await prisma.kodingMateri.findFirst({
    where: { babId },
    orderBy: { urutan: "desc" },
  });
  const urutan = (last?.urutan ?? 0) + 1;

  const materi = await prisma.kodingMateri.create({
    data: {
      babId,
      judul,
      tipe,
      urlYoutube: tipe === "video" ? urlYoutube : null,
      fileUrl: tipe === "dokumen" ? fileUrl : null,
      urutan,
    },
  });

  // Tidak revalidatePath di sini: list di client sudah di-update optimis
  // (lihat BabCard), biar simpan materi terasa instan tanpa animasi
  // transisi halaman yang ikut terpicu oleh refresh RSC.
  return materi;
}
