import { prisma } from "@/lib/prisma";
import PathwayAccordion from "./PathwayAccordion";

export default async function AdminPathwayPage() {
  const pertemuan = await prisma.kodingPertemuan.findMany({
    orderBy: { urutan: "asc" },
    include: {
      bahan: {
        orderBy: { urutan: "asc" },
        select: { id: true, judul: true, tipe: true, fileUrl: true },
      },
    },
  });

  // Tabel target belajar baru (migrasi 007) -- jangan sampai halaman ini mati
  // kalau migrasinya belum dijalankan.
  const targetsByPertemuan = new Map<number, string[]>();
  try {
    const rows = await prisma.kodingTargetBelajar.findMany({
      orderBy: [{ pertemuanId: "asc" }, { urutan: "asc" }],
    });
    for (const r of rows) {
      const list = targetsByPertemuan.get(r.pertemuanId) ?? [];
      list.push(r.teks);
      targetsByPertemuan.set(r.pertemuanId, list);
    }
  } catch {
    // dianggap belum ada target
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold mb-1">Kelola Pathway Belajar</h1>
        <p className="text-sm text-muted max-w-lg">
          Upload LKS, PPT, dan materi per pertemuan — ini yang jadi acuan
          utama siswa belajar. Materi Pendukung (video) tetap ada sebagai
          referensi tambahan saja.
        </p>
      </div>

      <PathwayAccordion
        pertemuan={pertemuan.map((p) => ({
          ...p,
          targets: targetsByPertemuan.get(p.id) ?? [],
        }))}
      />
    </div>
  );
}
