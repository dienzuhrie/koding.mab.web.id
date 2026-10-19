import { prisma } from "@/lib/prisma";
import StudentRow from "./StudentRow";

export default async function ProgressSiswaPage() {
  const [accessList, materiList, bahanList] = await Promise.all([
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
    prisma.kodingMateri.findMany({
      where: { bab: { isPublished: true } },
      orderBy: [{ bab: { urutan: "asc" } }, { urutan: "asc" }],
      select: { id: true, judul: true, bab: { select: { urutan: true, judul: true } } },
    }),
    prisma.kodingBahanAjar.findMany({
      orderBy: [{ pertemuan: { urutan: "asc" } }, { urutan: "asc" }],
      select: {
        id: true,
        judul: true,
        pertemuan: { select: { urutan: true, judul: true } },
      },
    }),
  ]);

  const userIds = accessList.map((a) => a.userId);

  const [completedMateri, viewedBahan] = await Promise.all([
    prisma.kodingProgressMateri.findMany({
      where: { userId: { in: userIds }, status: "selesai" },
      select: { userId: true, materiId: true },
    }),
    prisma.kodingPathwayView.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, bahanId: true },
    }),
  ]);

  const completedSet = new Set(completedMateri.map((c) => `${c.userId}-${c.materiId}`));
  const viewedSet = new Set(viewedBahan.map((v) => `${v.userId}-${v.bahanId}`));

  const totalMateri = materiList.length;
  const totalBahan = bahanList.length;

  const rows = accessList
    .map((a) => {
      const userId = a.userId;
      const materiChecklist = materiList.map((m) => ({
        id: m.id,
        judul: m.judul,
        groupLabel: `BAB ${m.bab.urutan} · ${m.bab.judul}`,
        done: completedSet.has(`${userId}-${m.id}`),
      }));
      const bahanChecklist = bahanList.map((b) => ({
        id: b.id,
        judul: b.judul,
        groupLabel: `Pertemuan ${b.pertemuan.urutan} · ${b.pertemuan.judul}`,
        done: viewedSet.has(`${userId}-${b.id}`),
      }));

      return {
        userId,
        nama: a.user.nama,
        email: a.user.email,
        kelas: a.user.siswa?.kelas?.namaKelas ?? "—",
        materiSelesai: materiChecklist.filter((m) => m.done).length,
        pathwayViewed: bahanChecklist.filter((b) => b.done).length,
        materiChecklist,
        bahanChecklist,
      };
    })
    .sort((a, b) => a.nama.localeCompare(b.nama));

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Progress Siswa</h1>
      <p className="text-sm text-muted mb-7 max-w-xl">
        Klik siswa untuk melihat detail materi dan bahan Pathway Belajar yang
        sudah/belum dikerjakan.
      </p>

      <div className="bg-white border border-border-soft rounded-2xl overflow-hidden max-w-4xl">
        <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 px-5 py-3 bg-brand-50 text-[11px] font-bold text-brand-600 uppercase tracking-wide">
          <div>Siswa</div>
          <div className="text-center">Materi Pendukung</div>
          <div className="text-center">Pathway Dibuka</div>
          <div />
        </div>

        {rows.map((r) => (
          <StudentRow
            key={r.userId}
            nama={r.nama}
            email={r.email}
            kelas={r.kelas}
            materiSelesai={r.materiSelesai}
            totalMateri={totalMateri}
            pathwayViewed={r.pathwayViewed}
            totalBahan={totalBahan}
            materiChecklist={r.materiChecklist}
            bahanChecklist={r.bahanChecklist}
          />
        ))}

        {rows.length === 0 && (
          <p className="text-sm text-muted px-5 py-6">
            Belum ada siswa aktif yang diberi akses.
          </p>
        )}
      </div>
    </div>
  );
}
