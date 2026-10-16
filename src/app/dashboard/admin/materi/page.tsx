import { prisma } from "@/lib/prisma";
import { createBab } from "./actions";
import MateriForm from "./MateriForm";

export default async function AdminMateriPage() {
  const babs = await prisma.kodingBab.findMany({
    orderBy: { urutan: "asc" },
    include: { materi: { orderBy: { urutan: "asc" } } },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Kelola Materi</h1>
          <p className="text-sm text-muted">
            Kelompokkan materi ke dalam BAB/Topik, lalu isi dengan video
            YouTube atau dokumen.
          </p>
        </div>
        <form action={createBab} className="flex gap-2">
          <input
            name="judul"
            required
            placeholder="Judul BAB baru"
            className="px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          />
          <button
            type="submit"
            className="bg-accent-400 text-brand-800 font-extrabold text-sm px-4 py-2.5 rounded-lg whitespace-nowrap"
          >
            + Tambah BAB
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[320px] flex flex-col gap-3.5">
          {babs.map((bab) => (
            <div
              key={bab.id}
              className="bg-white border border-border-soft rounded-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center px-4.5 py-4 bg-brand-50">
                <div>
                  <div className="text-[11px] font-bold text-brand-600">
                    BAB {bab.urutan}
                  </div>
                  <div className="text-[15px] font-extrabold">{bab.judul}</div>
                </div>
              </div>
              <div className="px-3.5 py-2.5 flex flex-col gap-1.5">
                {bab.materi.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg"
                  >
                    <div
                      className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        m.tipe === "video"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {m.tipe === "video" ? "▶" : "📄"}
                    </div>
                    <div className="flex-1 text-sm font-bold">{m.judul}</div>
                    <span className="text-[10px] text-muted">
                      {m.tipe === "video" ? "Video" : "Dokumen"}
                    </span>
                  </div>
                ))}
                {bab.materi.length === 0 && (
                  <div className="px-2.5 py-2 text-xs text-muted">
                    Belum ada materi ditambahkan
                  </div>
                )}
              </div>
            </div>
          ))}
          {babs.length === 0 && (
            <p className="text-sm text-muted">
              Belum ada BAB. Tambahkan BAB pertama di atas.
            </p>
          )}
        </div>

        <div className="flex-1 min-w-[300px]">
          {babs.length > 0 ? (
            <MateriForm babs={babs} />
          ) : (
            <p className="text-sm text-muted">
              Tambahkan minimal satu BAB sebelum menambahkan materi.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
