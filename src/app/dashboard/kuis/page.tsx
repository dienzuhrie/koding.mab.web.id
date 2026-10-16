import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function KuisListPage() {
  const session = await auth();
  const userId = Number(session!.user.id);

  const kuisList = await prisma.kodingKuis.findMany({
    orderBy: { bab: { urutan: "asc" } },
    include: {
      bab: true,
      hasil: { where: { userId }, orderBy: { selesaiAt: "desc" }, take: 1 },
      _count: { select: { soal: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Kuis</h1>
      <p className="text-sm text-muted mb-7">
        Uji pemahaman kamu setelah menyelesaikan materi di tiap BAB.
      </p>

      <div className="flex flex-col gap-3 max-w-2xl">
        {kuisList.map((k) => {
          const hasil = k.hasil[0];
          return (
            <Link
              key={k.id}
              href={`/dashboard/kuis/${k.id}`}
              className="flex items-center justify-between bg-white border border-border-soft rounded-2xl px-5 py-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="text-xs font-bold text-brand-600 mb-1">
                  BAB {k.bab.urutan} · {k._count.soal} SOAL
                </div>
                <div className="font-extrabold">{k.judul}</div>
              </div>
              {hasil ? (
                <span className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">
                  Skor {hasil.skor}
                </span>
              ) : (
                <span className="text-sm font-bold text-accent-500">
                  Mulai →
                </span>
              )}
            </Link>
          );
        })}
        {kuisList.length === 0 && (
          <p className="text-sm text-muted">Belum ada kuis tersedia.</p>
        )}
      </div>
    </div>
  );
}
