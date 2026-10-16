import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckIcon, UploadIcon } from "@/components/icons";

export default async function DashboardPage() {
  const session = await auth();
  const user = session!.user;

  if (user.role === "guru") {
    return <GuruDashboard />;
  }
  return <SiswaDashboard userId={Number(user.id)} userName={user.name ?? ""} />;
}

async function SiswaDashboard({
  userId,
  userName,
}: {
  userId: number;
  userName: string;
}) {
  const [totalMateri, selesaiCount, hasilKuis, projectCount, nextProgress] =
    await Promise.all([
      prisma.kodingMateri.count({ where: { bab: { isPublished: true } } }),
      prisma.kodingProgressMateri.count({
        where: { userId, status: "selesai" },
      }),
      prisma.kodingHasilKuis.findMany({ where: { userId } }),
      prisma.kodingProject.count({ where: { userId } }),
      prisma.kodingProgressMateri.findFirst({
        where: { userId, status: "in_progress" },
        include: { materi: { include: { bab: true } } },
      }),
    ]);

  const rataKuis = hasilKuis.length
    ? Math.round(hasilKuis.reduce((a, b) => a + b.skor, 0) / hasilKuis.length)
    : null;

  const recentProjects = await prisma.kodingProject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const recentKuis = await prisma.kodingHasilKuis.findMany({
    where: { userId },
    orderBy: { selesaiAt: "desc" },
    take: 3,
    include: { kuis: true },
  });

  const activity = [
    ...recentKuis.map((h) => ({
      type: "kuis" as const,
      label: `Menyelesaikan Kuis "${h.kuis.judul}"`,
      detail: `Skor ${h.skor}/100`,
      date: h.selesaiAt,
    })),
    ...recentProjects.map((p) => ({
      type: "project" as const,
      label: `Upload Project "${p.judul}"`,
      detail:
        p.status === "pending"
          ? "Menunggu review guru"
          : p.status === "diterima"
          ? "Diterima guru"
          : "Perlu revisi",
      date: p.createdAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-7 flex-wrap gap-3">
        <div>
          <div className="text-sm text-muted font-semibold">
            Selamat datang kembali,
          </div>
          <h1 className="text-2xl font-extrabold mt-0.5">{userName}</h1>
        </div>
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-accent-300 font-extrabold">
          {userName.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 mb-8">
        <StatCard
          label="MATERI SELESAI"
          value={`${selesaiCount} / ${totalMateri}`}
        />
        <StatCard
          label="RATA-RATA KUIS"
          value={rataKuis !== null ? `${rataKuis}/100` : "—"}
        />
        <StatCard label="PROJECT DIUPLOAD" value={String(projectCount)} />
      </div>

      {nextProgress && (
        <div className="bg-gradient-to-br from-brand-800 to-brand-900 rounded-2xl p-6 flex justify-between items-center flex-wrap gap-4 mb-8">
          <div>
            <div className="text-accent-300 text-xs font-bold mb-1.5">
              LANJUTKAN BELAJAR
            </div>
            <div className="text-white text-lg font-extrabold">
              BAB {nextProgress.materi.bab.urutan}: {nextProgress.materi.bab.judul}{" "}
              — {nextProgress.materi.judul}
            </div>
          </div>
          <Link
            href={`/dashboard/materi/${nextProgress.materi.babId}`}
            className="bg-accent-400 text-brand-800 font-extrabold text-sm px-5.5 py-3 rounded-xl whitespace-nowrap"
          >
            Lanjut Belajar →
          </Link>
        </div>
      )}

      <h2 className="text-[17px] font-extrabold mb-3.5">Aktivitas Terbaru</h2>
      <div className="flex flex-col gap-2.5">
        {activity.length === 0 && (
          <p className="text-sm text-muted">Belum ada aktivitas.</p>
        )}
        {activity.map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white border border-border-soft rounded-xl px-4 py-3.5"
          >
            <div
              className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center ${
                a.type === "kuis"
                  ? "bg-brand-50 text-brand-600"
                  : "bg-accent-400/15 text-accent-500"
              }`}
            >
              {a.type === "kuis" ? <CheckIcon size={16} /> : <UploadIcon size={16} />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold">{a.label}</div>
              <div className="text-xs text-muted">{a.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function GuruDashboard() {
  const [babCount, materiCount, pendingProject, aksesSiswa] = await Promise.all([
    prisma.kodingBab.count(),
    prisma.kodingMateri.count(),
    prisma.kodingProject.count({ where: { status: "pending" } }),
    prisma.kodingUserAccess.count({ where: { role: "siswa", status: "active" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-7">Dashboard Guru</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-8">
        <StatCard label="TOTAL BAB" value={String(babCount)} />
        <StatCard label="TOTAL MATERI" value={String(materiCount)} />
        <StatCard label="PROJECT MENUNGGU REVIEW" value={String(pendingProject)} />
        <StatCard label="SISWA AKTIF" value={String(aksesSiswa)} />
      </div>
      <div className="flex gap-3 flex-wrap">
        <Link
          href="/dashboard/admin/materi"
          className="bg-brand-800 text-white font-bold text-sm px-5 py-3 rounded-xl"
        >
          Kelola Materi
        </Link>
        <Link
          href="/dashboard/admin/kuis"
          className="bg-white border border-border-soft font-bold text-sm px-5 py-3 rounded-xl"
        >
          Kelola Kuis
        </Link>
        <Link
          href="/dashboard/project"
          className="bg-white border border-border-soft font-bold text-sm px-5 py-3 rounded-xl"
        >
          Review Project
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-border-soft">
      <div className="text-xs text-muted font-bold mb-2">{label}</div>
      <div className="text-[28px] font-extrabold text-brand-800">{value}</div>
    </div>
  );
}
