import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckIcon, LockIcon } from "@/components/icons";
import ProtectedVideo from "@/components/ProtectedVideo";
import { completeMateri } from "../actions";

type Status = "selesai" | "current" | "locked";

export default async function BabDetailPage({
  params,
}: {
  params: Promise<{ babId: string }>;
}) {
  const { babId: babIdParam } = await params;
  const babId = Number(babIdParam);
  const session = await auth();
  const userId = Number(session!.user.id);

  const babs = await prisma.kodingBab.findMany({
    where: { isPublished: true },
    orderBy: { urutan: "asc" },
    include: { materi: { include: { progress: { where: { userId } } } } },
  });
  const babIndex = babs.findIndex((b) => b.id === babId);
  const bab = babs[babIndex];
  if (!bab) notFound();

  const prevBab = babs[babIndex - 1];
  const prevBabDone =
    !prevBab || prevBab.materi.every((m) => m.progress[0]?.status === "selesai");
  if (!prevBabDone) redirect("/dashboard/materi");

  const materiList = await prisma.kodingMateri.findMany({
    where: { babId },
    orderBy: { urutan: "asc" },
    include: { progress: { where: { userId } } },
  });

  if (
    materiList.length > 0 &&
    materiList.every((m) => m.progress.length === 0)
  ) {
    await prisma.kodingProgressMateri.create({
      data: { userId, materiId: materiList[0].id, status: "in_progress" },
    });
    materiList[0].progress = [
      {
        id: 0,
        userId,
        materiId: materiList[0].id,
        status: "in_progress",
        completedAt: null,
      },
    ];
  }

  let foundCurrent = false;
  const withStatus = materiList.map((m) => {
    const dbStatus = m.progress[0]?.status;
    let status: Status = "locked";
    if (dbStatus === "selesai") status = "selesai";
    else if (dbStatus === "in_progress" && !foundCurrent) {
      status = "current";
      foundCurrent = true;
    }
    return { materi: m, status };
  });
  const current = withStatus.find((w) => w.status === "current")?.materi ?? null;

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">
        BAB {bab.urutan} · {bab.judul}
      </h1>
      <p className="text-sm text-muted mb-7 max-w-xl">
        Selesaikan materi secara berurutan — materi berikutnya terbuka setelah
        yang sebelumnya selesai, seperti peta perjalanan game.
      </p>

      <div className="flex flex-col xl:flex-row gap-7 items-start">
        {/* Timeline ringkas */}
        <div className="w-full xl:w-[260px] shrink-0">
          {withStatus.map(({ materi, status }, i) => (
            <div key={materi.id}>
              <div
                className={`flex items-center gap-2.5 mb-1 ${
                  status === "locked" ? "opacity-65" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] ${
                    status === "selesai"
                      ? "bg-gradient-to-br from-brand-400 to-brand-800 text-white shadow"
                      : status === "current"
                      ? "bg-accent-400 text-brand-800 shadow-[0_0_0_3px_rgba(250,204,21,0.25)]"
                      : "bg-[#dfeee3] border-2 border-dashed border-[#b7d9c0] text-brand-100"
                  }`}
                >
                  {status === "selesai" ? (
                    <CheckIcon size={13} />
                  ) : status === "current" ? (
                    "▶"
                  ) : (
                    <LockIcon size={12} className="text-[#7fa98d]" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-lg px-2.5 py-1.5 ${
                    status === "current"
                      ? "bg-white border border-accent-400"
                      : status === "selesai"
                      ? "bg-white border border-border-soft"
                      : "bg-[#eef6f0] border border-border-soft"
                  }`}
                >
                  <div
                    className={`text-[9px] font-bold leading-tight ${
                      status === "selesai"
                        ? "text-brand-600"
                        : status === "current"
                        ? "text-amber-700"
                        : "text-[#7fa98d]"
                    }`}
                  >
                    {status === "selesai"
                      ? "SELESAI"
                      : status === "current"
                      ? "BERJALAN"
                      : "TERKUNCI"}{" "}
                    · {materi.tipe === "video" ? "VIDEO" : "DOKUMEN"}
                  </div>
                  <div
                    className={`text-xs font-bold leading-tight ${
                      status === "locked" ? "text-[#4c6d5b]" : ""
                    }`}
                  >
                    {i + 1}. {materi.judul}
                  </div>
                </div>
              </div>
              {i < withStatus.length - 1 && (
                <div className="w-[2px] h-3 bg-[#e3eee6] ml-[13px] mb-1" />
              )}
            </div>
          ))}
        </div>

        {/* Panel materi saat ini */}
        <div className="flex-1 min-w-0 w-full xl:sticky xl:top-6">
          {current ? (
            <div className="reveal bg-brand-900 rounded-2xl p-5.5">
              <div className="text-accent-300 text-xs font-bold mb-2.5">
                MATERI SAAT INI · {current.judul}
              </div>

              {current.tipe === "video" && current.urlYoutube ? (
                <ProtectedVideo youtubeUrl={current.urlYoutube} />
              ) : current.fileUrl ? (
                <a
                  href={current.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-press flex items-center justify-center h-40 rounded-xl bg-white/5 text-white/80 text-sm font-semibold hover:bg-white/10"
                >
                  📄 Buka Dokumen
                </a>
              ) : (
                <div className="flex items-center justify-center h-40 rounded-xl bg-white/5 text-white/60 text-sm">
                  Materi belum tersedia
                </div>
              )}

              <form
                action={async () => {
                  "use server";
                  await completeMateri(current!.id, babId);
                }}
              >
                <button
                  type="submit"
                  className="btn-press inline-block mt-4 bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-2.75 rounded-xl"
                >
                  Tandai Selesai &amp; Lanjut →
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-border-soft rounded-2xl p-8 text-center text-sm text-muted">
              Semua materi di BAB ini sudah selesai 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
