import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createKuis } from "./actions";

export default async function AdminKuisPage() {
  const babs = await prisma.kodingBab.findMany({
    orderBy: { urutan: "asc" },
    include: { kuis: { include: { _count: { select: { soal: true } } } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Kelola Kuis</h1>
      <p className="text-sm text-muted mb-7">
        Kuis terikat pada satu BAB/Topik dan tampil setelah materi di topik
        itu selesai.
      </p>

      <div className="max-w-2xl bg-white border border-border-soft rounded-2xl p-6 mb-8">
        <div className="text-xs font-bold text-muted mb-3.5">
          BUAT KUIS BARU
        </div>
        <form action={createKuis} className="flex gap-3 flex-wrap">
          <select
            name="babId"
            required
            className="input-focus flex-1 min-w-[180px] px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          >
            {babs.map((b) => (
              <option key={b.id} value={b.id}>
                BAB {b.urutan} · {b.judul}
              </option>
            ))}
          </select>
          <input
            name="judul"
            required
            placeholder="Judul kuis"
            className="input-focus flex-1 min-w-[180px] px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          />
          <button
            type="submit"
            className="btn-press bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-2.5 rounded-lg"
          >
            Buat Kuis
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3 max-w-2xl">
        {babs.flatMap((b) =>
          b.kuis.map((k) => (
            <Link
              key={k.id}
              href={`/dashboard/admin/kuis/${k.id}`}
              className="card-lift flex justify-between items-center bg-white border border-border-soft rounded-2xl px-5 py-4 hover:shadow-md"
            >
              <div>
                <div className="text-xs font-bold text-brand-600 mb-1">
                  BAB {b.urutan}
                </div>
                <div className="font-extrabold text-sm">{k.judul}</div>
              </div>
              <span className="text-xs font-bold text-muted">
                {k._count.soal} soal →
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
