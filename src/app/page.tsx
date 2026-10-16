import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LockIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProjects, babs] = await Promise.all([
    prisma.kodingProject.findMany({
      where: { status: "diterima" },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 6,
      include: { user: { select: { nama: true } } },
    }),
    prisma.kodingBab.findMany({
      where: { isPublished: true },
      orderBy: { urutan: "asc" },
      take: 4,
    }),
  ]);

  return (
    <div className="w-full">
      <nav className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-brand-900/95 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent-400 flex items-center justify-center font-extrabold text-brand-800">
            M
          </div>
          <span className="text-white font-extrabold">
            Full Stack Developer <span className="text-accent-400">MAB</span>
          </span>
        </div>
        <div className="flex items-center gap-7">
          <a href="#karya" className="text-brand-100 text-sm font-semibold hidden sm:inline">
            Karya Siswa
          </a>
          <a href="#materi" className="text-brand-100 text-sm font-semibold hidden sm:inline">
            Materi
          </a>
          <Link
            href="/login"
            className="btn-press bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-2.5 rounded-full"
          >
            Masuk
          </Link>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-brand-900 px-8 pt-22 pb-18 rounded-b-3xl">
        <div className="pointer-events-none absolute -top-20 -left-16 w-[380px] h-[380px] rounded-full bg-white opacity-25 blur-3xl animate-aurora-1" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 w-[420px] h-[420px] rounded-full bg-white opacity-15 blur-3xl animate-aurora-2" />
        <div className="pointer-events-none absolute top-[35%] left-1/2 w-72 h-72 rounded-full bg-brand-300 opacity-20 blur-3xl animate-aurora-3" />

        <div className="reveal relative max-w-2xl mx-auto sm:mx-0">
          <div className="inline-block bg-accent-400/15 border border-accent-400/40 text-accent-300 text-xs font-bold px-3.5 py-1.5 rounded-full mb-5">
            BELAJAR KODING BARENG MAB
          </div>
          <h1 className="text-[2.75rem] leading-[1.1] font-extrabold text-white mb-4">
            Kelas Coding untuk Siswa,{" "}
            <span className="text-accent-400">Karya Nyata</span> untuk
            Portofolio
          </h1>
          <p className="text-[17px] leading-relaxed text-brand-100 mb-7 max-w-lg">
            Lihat hasil karya siswa dari pembelajaran koding, atau masuk untuk
            belajar materi terstruktur, kuis interaktif, dan kumpulkan project
            kamu sendiri.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <a
              href="#karya"
              className="btn-press bg-accent-400 text-brand-800 font-extrabold text-[15px] px-6.5 py-3.5 rounded-xl"
            >
              Lihat Karya Siswa
            </a>
            <Link
              href="/login"
              className="btn-press bg-white/10 border border-white/25 text-white font-bold text-[15px] px-6.5 py-3.5 rounded-xl"
            >
              Masuk Belajar →
            </Link>
          </div>
        </div>
      </header>

      <section id="karya" className="px-8 pt-16 pb-4 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-7 flex-wrap gap-2">
          <h2 className="text-[26px] font-extrabold text-brand-900">
            Karya Siswa Terbaru
          </h2>
          <span className="text-muted text-sm font-semibold">
            Terbuka untuk umum, tanpa login
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5.5">
          {featuredProjects.map((p) => (
            <div
              key={p.id}
              className="card-lift bg-white rounded-2xl overflow-hidden border border-border-soft shadow-sm hover:shadow-lg hover:border-brand-300"
            >
              <div className="h-[150px] bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-accent-300 font-extrabold text-sm">
                {p.linkDemo ? (
                  <a href={p.linkDemo} target="_blank" rel="noreferrer">
                    LIHAT DEMO →
                  </a>
                ) : (
                  "PROJECT SISWA"
                )}
              </div>
              <div className="p-4">
                <div className="font-bold text-[15px] mb-1">{p.judul}</div>
                <div className="text-[13px] text-muted">oleh {p.user.nama}</div>
              </div>
            </div>
          ))}
          {featuredProjects.length === 0 &&
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="skeleton rounded-2xl overflow-hidden border border-border-soft"
              >
                <div className="h-[150px] bg-[#dcefe1]" />
                <div className="p-4">
                  <div className="h-3.5 w-2/3 bg-[#d6ecdc] rounded mb-2.5" />
                  <div className="h-2.5 w-1/2 bg-[#e2f3e6] rounded" />
                </div>
              </div>
            ))}
        </div>
      </section>

      <section id="materi" className="px-8 pt-14 pb-20 max-w-6xl mx-auto">
        <div className="mb-7">
          <h2 className="text-[26px] font-extrabold text-brand-900 mb-1.5">
            Materi Pembelajaran
          </h2>
          <span className="text-muted text-sm font-semibold">
            Klik salah satu untuk masuk ke kelas (perlu login)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4.5">
          {babs.map((bab) => (
            <Link
              key={bab.id}
              href="/login"
              className="card-lift group relative block rounded-2xl overflow-hidden border border-border-soft hover:shadow-lg hover:border-brand-300"
            >
              <div className="h-[100px] bg-gradient-to-br from-brand-700 to-brand-900" />
              <div className="absolute inset-0 bg-brand-900/45 flex items-center justify-center">
                <LockIcon
                  size={22}
                  className="text-accent-300 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6"
                />
              </div>
              <div className="p-3 bg-white">
                <div className="text-[13px] font-bold">
                  BAB {bab.urutan}: {bab.judul}
                </div>
              </div>
            </Link>
          ))}
          {babs.length === 0 && (
            <p className="text-sm text-muted col-span-full">
              Materi akan segera hadir.
            </p>
          )}
        </div>
      </section>

      <footer className="px-8 py-7 bg-brand-900 text-brand-100 text-sm text-center rounded-t-3xl">
        MA Bilingual Muslimat NU Sidoarjo. Developed by sukafisika.
      </footer>
    </div>
  );
}
