import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LockIcon } from "@/components/icons";

export default async function MateriListPage() {
  const session = await auth();
  const userId = Number(session!.user.id);

  const babs = await prisma.kodingBab.findMany({
    where: { isPublished: true },
    orderBy: { urutan: "asc" },
    include: {
      materi: {
        orderBy: { urutan: "asc" },
        include: { progress: { where: { userId } } },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Materi Pendukung</h1>
      <p className="text-sm text-muted mb-7 max-w-lg">
        Video referensi tambahan, bukan acuan utama — untuk bahan ajar
        pertemuan (LKS, PPT, materi) buka menu <strong>Pathway Belajar</strong>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {babs.map((bab, i) => {
          const total = bab.materi.length;
          const selesai = bab.materi.filter(
            (m) => m.progress[0]?.status === "selesai"
          ).length;
          const prevBab = babs[i - 1];
          const prevDone =
            !prevBab ||
            prevBab.materi.every((m) => m.progress[0]?.status === "selesai");
          const locked = !prevDone;

          const cardClass = `rounded-2xl border p-5 bg-white transition-shadow block ${
            locked
              ? "border-border-soft opacity-60 cursor-not-allowed"
              : "border-border-soft hover:shadow-md"
          }`;

          const content = (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-brand-600">
                  BAB {bab.urutan}
                </span>
                {locked && <LockIcon size={16} className="text-brand-100" />}
              </div>
              <h2 className="text-lg font-extrabold mb-2">{bab.judul}</h2>
              <div className="h-2 bg-[#e3eee6] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-brand-500"
                  style={{ width: `${total ? (selesai / total) * 100 : 0}%` }}
                />
              </div>
              <div className="text-xs text-muted font-semibold">
                {selesai}/{total} materi selesai
              </div>
            </>
          );

          if (locked) {
            return (
              <div key={bab.id} className={cardClass}>
                {content}
              </div>
            );
          }
          return (
            <Link key={bab.id} href={`/dashboard/materi/${bab.id}`} className={cardClass}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
