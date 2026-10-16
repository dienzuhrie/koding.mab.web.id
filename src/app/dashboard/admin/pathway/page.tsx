import { prisma } from "@/lib/prisma";
import { FileTextIcon } from "@/components/icons";
import { createPertemuan } from "./actions";
import BahanForm from "./BahanForm";
import PertemuanCard from "./PertemuanCard";

const tipeLabel: Record<string, string> = {
  lks: "LKS",
  ppt: "PPT",
  materi: "Materi",
  lainnya: "Lainnya",
};

export default async function AdminPathwayPage() {
  const pertemuan = await prisma.kodingPertemuan.findMany({
    orderBy: { urutan: "asc" },
    include: { bahan: { orderBy: { urutan: "asc" } } },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Kelola Pathway</h1>
          <p className="text-sm text-muted max-w-lg">
            Upload LKS, PPT, dan materi per pertemuan — ini yang jadi acuan
            utama siswa belajar. Materi Belajar (video) tetap ada sebagai
            referensi tambahan saja.
          </p>
        </div>
        <form action={createPertemuan} className="flex gap-2">
          <input
            name="judul"
            required
            placeholder="Judul pertemuan baru"
            className="input-focus px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          />
          <button
            type="submit"
            className="btn-press bg-accent-400 text-brand-800 font-extrabold text-sm px-4 py-2.5 rounded-lg whitespace-nowrap"
          >
            + Tambah Pertemuan
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[320px] flex flex-col gap-3.5">
          {pertemuan.map((p, i) => (
            <PertemuanCard
              key={p.id}
              urutan={p.urutan}
              judul={p.judul}
              jumlahBahan={p.bahan.length}
              defaultOpen={i === 0}
            >
              {p.bahan.map((b) => (
                <a
                  key={b.id}
                  href={b.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-colors hover:bg-brand-50/60"
                >
                  <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
                    <FileTextIcon size={15} />
                  </div>
                  <div className="flex-1 text-sm font-bold">{b.judul}</div>
                  <span className="text-[10px] text-muted">
                    {tipeLabel[b.tipe]}
                  </span>
                </a>
              ))}
              {p.bahan.length === 0 && (
                <div className="px-2.5 py-2 text-xs text-muted">
                  Belum ada bahan ajar ditambahkan
                </div>
              )}
            </PertemuanCard>
          ))}
          {pertemuan.length === 0 && (
            <p className="text-sm text-muted">
              Belum ada pertemuan. Tambahkan pertemuan pertama di atas.
            </p>
          )}
        </div>

        <div className="flex-1 min-w-[300px]">
          {pertemuan.length > 0 ? (
            <BahanForm pertemuan={pertemuan} />
          ) : (
            <p className="text-sm text-muted">
              Tambahkan minimal satu pertemuan sebelum menambahkan bahan ajar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
