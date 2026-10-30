import { prisma } from "@/lib/prisma";
import RowErrorBoundary from "@/components/RowErrorBoundary";
import BahanCard from "./BahanCard";

export default async function PathwayPage() {
  const pertemuan = await prisma.kodingPertemuan.findMany({
    orderBy: { urutan: "asc" },
    include: { bahan: { orderBy: { urutan: "asc" } } },
  });

  // Tabel target belajar (migrasi 007) -- halaman tetap jalan bila belum ada.
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
    // tanpa target
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Pathway Belajar</h1>
      <p className="text-sm text-muted mb-9 max-w-xl">
        Ini acuan utama proses belajar kamu — ikuti bahan ajar per pertemuan
        di bawah ini. Menu Materi Pendukung (video) sifatnya hanya referensi
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
            {(targetsByPertemuan.get(p.id) ?? []).length > 0 && (
              <div className="mx-3.5 mt-3.5 rounded-xl bg-accent-300/15 border border-accent-300/60 px-4 py-3">
                <div className="text-[11px] font-bold text-brand-700 mb-1.5">
                  TARGET BELAJAR
                </div>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {(targetsByPertemuan.get(p.id) ?? []).map((t, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-accent-400 text-brand-800 text-[11px] font-extrabold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="p-3.5 flex flex-col gap-1.5">
              {p.bahan.map((b) => (
                <RowErrorBoundary key={b.id}>
                  <BahanCard
                    bahanId={b.id}
                    judul={b.judul}
                    tipe={b.tipe}
                    fileUrl={b.fileUrl}
                  />
                </RowErrorBoundary>
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
