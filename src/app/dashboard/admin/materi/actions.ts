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

export async function updateBab(formData: FormData) {
  const id = Number(formData.get("id"));
  const judul = String(formData.get("judul") ?? "").trim();
  if (!id || !judul) throw new Error("Judul BAB wajib diisi.");

  return prisma.kodingBab.update({ where: { id }, data: { judul } });
}

export async function deleteBab(id: number) {
  try {
    await prisma.kodingBab.delete({ where: { id } });
  } catch {
    throw new Error(
      "BAB tidak bisa dihapus — hapus dulu semua materi & kuis di dalamnya."
    );
  }
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

export async function updateMateri(formData: FormData) {
  const id = Number(formData.get("id"));
  const judul = String(formData.get("judul") ?? "").trim();
  const tipe = String(formData.get("tipe")) as "video" | "dokumen";
  const urlYoutube = String(formData.get("urlYoutube") ?? "").trim() || null;
  const file = formData.get("file") as File | null;

  if (!id || !judul) throw new Error("Judul materi wajib diisi.");

  let newFileUrl: string | null = null;
  if (tipe === "dokumen" && file && file.size > 0) {
    newFileUrl = await saveUpload(file, "materi");
  }

  return prisma.kodingMateri.update({
    where: { id },
    data: {
      judul,
      tipe,
      urlYoutube: tipe === "video" ? urlYoutube : null,
      ...(tipe === "video"
        ? { fileUrl: null }
        : newFileUrl
        ? { fileUrl: newFileUrl }
        : {}),
    },
  });
}

export async function deleteMateri(id: number) {
  try {
    await prisma.kodingMateri.delete({ where: { id } });
  } catch {
    throw new Error(
      "Materi tidak bisa dihapus — kemungkinan masih ada progress siswa yang terkait."
    );
  }
}
