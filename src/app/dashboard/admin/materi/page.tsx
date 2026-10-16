import { prisma } from "@/lib/prisma";
import { createBab } from "./actions";
import MateriAccordion from "./MateriAccordion";

export default async function AdminMateriPage() {
  const babs = await prisma.kodingBab.findMany({
    orderBy: { urutan: "asc" },
    include: {
      materi: {
        orderBy: { urutan: "asc" },
        select: {
          id: true,
          judul: true,
          tipe: true,
          urlYoutube: true,
          fileUrl: true,
        },
      },
    },
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
            className="input-focus px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          />
          <button
            type="submit"
            className="btn-press bg-accent-400 text-brand-800 font-extrabold text-sm px-4 py-2.5 rounded-lg whitespace-nowrap"
          >
            + Tambah BAB
          </button>
        </form>
      </div>

      <MateriAccordion babs={babs} />
    </div>
  );
}
