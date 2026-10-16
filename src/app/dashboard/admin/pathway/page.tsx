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

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold mb-1">Kelola Pathway</h1>
        <p className="text-sm text-muted max-w-lg">
          Upload LKS, PPT, dan materi per pertemuan — ini yang jadi acuan
          utama siswa belajar. Materi Belajar (video) tetap ada sebagai
          referensi tambahan saja.
        </p>
      </div>

      <PathwayAccordion pertemuan={pertemuan} />
    </div>
  );
}
