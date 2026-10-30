"use server";

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

  return prisma.kodingPertemuan.create({ data: { judul, deskripsi, urutan } });
}

export async function updatePertemuan(formData: FormData) {
  const id = Number(formData.get("id"));
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;
  if (!id || !judul) throw new Error("Judul pertemuan wajib diisi.");

  return prisma.kodingPertemuan.update({
    where: { id },
    data: { judul, deskripsi },
  });
}

export async function saveTargetBelajar(pertemuanId: number, text: string) {
  if (!pertemuanId) throw new Error("Pertemuan tidak valid.");

  // Satu baris = satu target; buang bullet/nomor di awal, baris kosong, duplikat.
  const targets = Array.from(
    new Set(
      text
        .split(/\r?\n/)
        .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
        .filter(Boolean)
        .map((line) => line.slice(0, 500))
    )
  ).slice(0, 30);

  try {
    await prisma.$transaction([
      prisma.kodingTargetBelajar.deleteMany({ where: { pertemuanId } }),
      prisma.kodingTargetBelajar.createMany({
        data: targets.map((teks, i) => ({ pertemuanId, teks, urutan: i + 1 })),
      }),
    ]);
  } catch {
    throw new Error(
      "Gagal menyimpan target belajar. Pastikan migrasi 007_target_belajar.sql sudah dijalankan."
    );
  }
  return targets;
}

export async function deletePertemuan(id: number) {
  try {
    await prisma.kodingPertemuan.delete({ where: { id } });
  } catch {
    throw new Error(
      "Pertemuan tidak bisa dihapus — hapus dulu semua bahan ajar di dalamnya."
    );
  }
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

  return prisma.kodingBahanAjar.create({
    data: { pertemuanId, judul, tipe, fileUrl, urutan },
  });
}

export async function updateBahan(formData: FormData) {
  const id = Number(formData.get("id"));
  const judul = String(formData.get("judul") ?? "").trim();
  const tipe = String(formData.get("tipe")) as
    | "lks"
    | "ppt"
    | "materi"
    | "lainnya";
  const file = formData.get("file") as File | null;

  if (!id || !judul) throw new Error("Judul bahan ajar wajib diisi.");

  let newFileUrl: string | null = null;
  if (file && file.size > 0) {
    newFileUrl = await saveUpload(file, "pathway");
  }

  return prisma.kodingBahanAjar.update({
    where: { id },
    data: {
      judul,
      tipe,
      ...(newFileUrl ? { fileUrl: newFileUrl } : {}),
    },
  });
}

export async function deleteBahan(id: number) {
  try {
    // koding_pathway_view mencatat siswa yang sudah membuka bahan ini --
    // itu cuma data pelacakan, aman dihapus bareng saat bahan ajarnya dihapus.
    await prisma.$transaction([
      prisma.kodingPathwayView.deleteMany({ where: { bahanId: id } }),
      prisma.kodingBahanAjar.delete({ where: { id } }),
    ]);
  } catch {
    throw new Error("Gagal menghapus bahan ajar. Coba lagi.");
  }
}
