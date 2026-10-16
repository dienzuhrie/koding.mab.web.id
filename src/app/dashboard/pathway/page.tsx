import { prisma } from "@/lib/prisma";
import BahanCard from "./BahanCard";

export default async function PathwayPage() {
  const pertemuan = await prisma.kodingPertemuan.findMany({
    orderBy: { urutan: "asc" },
    include: { bahan: { orderBy: { urutan: "asc" } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Pathway</h1>
      <p className="text-sm text-muted mb-9 max-w-xl">
        Ini acuan utama proses belajar kamu — ikuti bahan ajar per pertemuan
        di bawah ini. Menu Materi Belajar (video) sifatnya hanya referensi
        tambahan.
      </p>

      <div className="flex flex-col gap-4 max-w-2xl">
        {pertemuan.map((p) => (
          <div
            key={p.id}
            className="reveal bg-white border border-border-soft rounded-2xl overflow-hidden"
          >
            <div className="px-5 py-4 bg-brand-50">
              <div className="text-[11px] font-bold text-brand-600 mb-0.5">
                PERTEMUAN {p.urutan}
              </div>
              <div className="font-extrabold">{p.judul}</div>
              {p.deskripsi && (
                <p className="text-xs text-muted mt-1">{p.deskripsi}</p>
              )}
            </div>
            <div className="p-3.5 flex flex-col gap-1.5">
              {p.bahan.map((b) => (
                <BahanCard
                  key={b.id}
                  judul={b.judul}
                  tipe={b.tipe}
                  fileUrl={b.fileUrl}
                />
              ))}
              {p.bahan.length === 0 && (
                <div className="px-3 py-2.5 text-xs text-muted">
                  Belum ada bahan ajar untuk pertemuan ini.
                </div>
              )}
            </div>
          </div>
        ))}
        {pertemuan.length === 0 && (
          <p className="text-sm text-muted">
            Belum ada pathway yang ditambahkan guru.
          </p>
        )}
      </div>
    </div>
  );
}
