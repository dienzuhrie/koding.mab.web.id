import { prisma } from "@/lib/prisma";

export default async function ProgressSiswaPage() {
  const [accessList, totalMateri, totalBahan] = await Promise.all([
    prisma.kodingUserAccess.findMany({
      where: { status: "active" },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            siswa: { select: { kelas: { select: { namaKelas: true } } } },
          },
        },
      },
    }),
    prisma.kodingMateri.count({ where: { bab: { isPublished: true } } }),
    prisma.kodingBahanAjar.count(),
  ]);

  const userIds = accessList.map((a) => a.userId);

  const [materiSelesaiRaw, pathwayViewRaw] = await Promise.all([
    prisma.kodingProgressMateri.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds }, status: "selesai" },
      _count: { _all: true },
    }),
    prisma.kodingPathwayView.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _count: { _all: true },
    }),
  ]);

  const materiSelesaiMap = new Map(
    materiSelesaiRaw.map((r) => [r.userId, r._count._all])
  );
  const pathwayViewMap = new Map(
    pathwayViewRaw.map((r) => [r.userId, r._count._all])
  );

  const rows = accessList
    .map((a) => ({
      userId: a.userId,
      nama: a.user.nama,
      email: a.user.email,
      kelas: a.user.siswa?.kelas?.namaKelas ?? "—",
      materiSelesai: materiSelesaiMap.get(a.userId) ?? 0,
      pathwayViewed: pathwayViewMap.get(a.userId) ?? 0,
    }))
    .sort((a, b) => a.nama.localeCompare(b.nama));

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Progress Siswa</h1>
      <p className="text-sm text-muted mb-7 max-w-xl">
        Pantau materi yang sudah terbuka/selesai dan bahan ajar Pathway yang
        sudah dibuka per siswa.
      </p>

      <div className="bg-white border border-border-soft rounded-2xl overflow-hidden max-w-4xl">
        <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr] gap-3 px-5 py-3 bg-brand-50 text-[11px] font-bold text-brand-600 uppercase tracking-wide">
          <div>Siswa</div>
          <div className="text-center">Materi Pendukung</div>
          <div className="text-center">Pathway Dibuka</div>
        </div>

        {rows.map((r) => {
          const materiPct = totalMateri ? Math.round((r.materiSelesai / totalMateri) * 100) : 0;
          const pathwayPct = totalBahan ? Math.round((r.pathwayViewed / totalBahan) * 100) : 0;
          return (
            <div
              key={r.userId}
              className="card-lift grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_1fr_1fr] gap-3 px-5 py-4 border-t border-border-soft items-center"
            >
              <div className="min-w-0">
                <div className="text-sm font-bold truncate">{r.nama}</div>
                <div className="text-xs text-muted truncate">
                  {r.kelas} · {r.email}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-extrabold text-brand-800">
                  {r.materiSelesai}/{totalMateri}
                </div>
                <div className="h-1.5 w-16 mx-auto bg-[#e3eee6] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-brand-500"
                    style={{ width: `${materiPct}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-extrabold text-brand-800">
                  {r.pathwayViewed}/{totalBahan}
                </div>
                <div className="h-1.5 w-16 mx-auto bg-[#e3eee6] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-accent-400"
                    style={{ width: `${pathwayPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {rows.length === 0 && (
          <p className="text-sm text-muted px-5 py-6">
            Belum ada siswa aktif yang diberi akses.
          </p>
        )}
      </div>
    </div>
  );
}
