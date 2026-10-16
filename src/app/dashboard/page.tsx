import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  CheckIcon,
  UploadIcon,
  LayersIcon,
  BookIcon,
  ClipboardCheckIcon,
  BriefcaseIcon,
  UsersIcon,
  TrendUpIcon,
} from "@/components/icons";

export default async function DashboardPage() {
  const session = await auth();
  const user = session!.user;

  if (user.role === "guru") {
    return <GuruDashboard userName={user.name ?? ""} />;
  }
  return <SiswaDashboard userId={Number(user.id)} userName={user.name ?? ""} />;
}

function AuroraBanner({
  eyebrow,
  title,
  subtitle,
  initials,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  initials: string;
}) {
  return (
    <div className="reveal relative overflow-hidden bg-brand-900 rounded-3xl px-7 py-8 mb-8">
      <div className="pointer-events-none absolute -top-16 -left-10 w-72 h-72 rounded-full bg-white opacity-20 blur-3xl animate-aurora-1" />
      <div className="pointer-events-none absolute -bottom-20 -right-6 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl animate-aurora-2" />
      <div className="relative flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="text-accent-300 text-xs font-extrabold tracking-wide mb-1.5">
            {eyebrow}
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">{title}</h1>
          <p className="text-sm text-brand-100">{subtitle}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-3">
          {initials}
        </div>
      </div>
    </div>
  );
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
      <AuroraBanner
        eyebrow="SELAMAT DATANG KEMBALI"
        title={userName}
        subtitle="Ayo lanjutkan progress belajar koding kamu hari ini."
        initials={userName.slice(0, 2).toUpperCase()}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 mb-8">
        <StatCard
          icon={BookIcon}
          tint="brand"
          label="MATERI SELESAI"
          value={`${selesaiCount} / ${totalMateri}`}
          className="reveal reveal-1"
        />
        <StatCard
          icon={TrendUpIcon}
          tint="accent"
          label="RATA-RATA KUIS"
          value={rataKuis !== null ? `${rataKuis}/100` : "—"}
          className="reveal reveal-2"
        />
        <StatCard
          icon={BriefcaseIcon}
          tint="brand"
          label="PROJECT DIUPLOAD"
          value={String(projectCount)}
          className="reveal reveal-3"
        />
      </div>

      {nextProgress && (
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-6 flex justify-between items-center flex-wrap gap-4 mb-8">
          <div className="pointer-events-none absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white opacity-10 blur-3xl" />
          <div className="relative">
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
            className="btn-press relative bg-accent-400 text-brand-800 font-extrabold text-sm px-5.5 py-3 rounded-xl whitespace-nowrap hover:bg-accent-300 transition-colors"
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
            className="card-lift flex items-center gap-3 bg-white border border-border-soft rounded-xl px-4 py-3.5 hover:shadow-sm"
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

async function GuruDashboard({ userName }: { userName: string }) {
  const [babCount, materiCount, pendingProject, aksesSiswa] = await Promise.all([
    prisma.kodingBab.count(),
    prisma.kodingMateri.count(),
    prisma.kodingProject.count({ where: { status: "pending" } }),
    prisma.kodingUserAccess.count({ where: { status: "active" } }),
  ]);

  const quickActions = [
    {
      href: "/dashboard/admin/materi",
      icon: LayersIcon,
      title: "Kelola Materi",
      desc: "Atur BAB, video YouTube, dan dokumen",
    },
    {
      href: "/dashboard/admin/kuis",
      icon: ClipboardCheckIcon,
      title: "Kelola Kuis",
      desc: "Buat soal dan kunci jawaban",
    },
    {
      href: "/dashboard/admin/siswa",
      icon: UsersIcon,
      title: "Kelola Siswa",
      desc: "Beri akses login ke akun SIMADU",
    },
    {
      href: "/dashboard/project",
      icon: BriefcaseIcon,
      title: "Review Project",
      desc: "Terima atau minta revisi project siswa",
    },
  ];

  return (
    <div>
      <AuroraBanner
        eyebrow="DASHBOARD GURU"
        title={`Halo, ${userName}`}
        subtitle="Kelola materi, kuis, dan project siswa dari sini."
        initials={userName.slice(0, 2).toUpperCase()}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-8">
        <StatCard icon={LayersIcon} tint="brand" label="TOTAL BAB" value={String(babCount)} className="reveal reveal-1" />
        <StatCard icon={BookIcon} tint="brand" label="TOTAL MATERI" value={String(materiCount)} className="reveal reveal-2" />
        <StatCard
          icon={BriefcaseIcon}
          tint="accent"
          label="PROJECT MENUNGGU REVIEW"
          value={String(pendingProject)}
          className="reveal reveal-3"
        />
        <StatCard icon={UsersIcon} tint="brand" label="SISWA AKTIF" value={String(aksesSiswa)} className="reveal reveal-4" />
      </div>

      <h2 className="text-[17px] font-extrabold mb-3.5">Aksi Cepat</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="card-lift group flex items-center gap-4 bg-white border border-border-soft rounded-2xl p-5 hover:border-brand-400 hover:shadow-md"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 transition-all duration-200 group-hover:bg-brand-700 group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
              <a.icon size={20} />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-sm">{a.title}</div>
              <div className="text-xs text-muted">{a.desc}</div>
            </div>
            <span className="text-muted group-hover:text-brand-700 group-hover:translate-x-1 transition-all">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  tint,
  label,
  value,
  className = "",
}: {
  icon: (props: { className?: string; size?: number }) => React.ReactElement;
  tint: "brand" | "accent";
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`card-lift group bg-white rounded-2xl p-5 border border-border-soft hover:shadow-md ${className}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 ${
          tint === "brand" ? "bg-brand-50 text-brand-700" : "bg-accent-400/15 text-accent-500"
        }`}
      >
        <Icon size={19} />
      </div>
      <div className="text-xs text-muted font-bold mb-1.5">{label}</div>
      <div className="text-[26px] font-extrabold text-brand-800">{value}</div>
    </div>
  );
}
