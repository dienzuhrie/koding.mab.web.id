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
      <p className="text-sm text-muted mb-9 max-w-xl">
        Selesaikan materi secara berurutan — materi berikutnya terbuka setelah
        yang sebelumnya selesai, seperti peta perjalanan game.
      </p>

      <div className="max-w-xl mx-auto">
        {withStatus.map(({ materi, status }, i) => (
          <div key={materi.id}>
            <div
              className={`flex items-center gap-5 mb-2 ${
                status === "locked" ? "opacity-65" : ""
              }`}
            >
              <div
                className={`w-[84px] h-[84px] rounded-full flex items-center justify-center shrink-0 font-extrabold text-xl ${
                  status === "selesai"
                    ? "bg-gradient-to-br from-brand-400 to-brand-800 text-white shadow-lg"
                    : status === "current"
                    ? "bg-accent-400 text-brand-800 shadow-[0_0_0_6px_rgba(250,204,21,0.25)]"
                    : "bg-[#dfeee3] border-[3px] border-dashed border-[#b7d9c0] text-brand-100"
                }`}
              >
                {status === "selesai" ? (
                  <CheckIcon size={26} />
                ) : status === "current" ? (
                  "▶"
                ) : (
                  <LockIcon size={26} className="text-[#7fa98d]" />
                )}
              </div>
              <div
                className={`flex-1 rounded-2xl px-4.5 py-3.5 ${
                  status === "current"
                    ? "bg-white border-2 border-accent-400"
                    : status === "selesai"
                    ? "bg-white border border-border-soft"
                    : "bg-[#eef6f0] border border-border-soft"
                }`}
              >
                <div
                  className={`text-[11px] font-bold mb-0.5 ${
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
                    ? "SEDANG BERJALAN"
                    : "TERKUNCI"}{" "}
                  · {materi.tipe === "video" ? "VIDEO" : "DOKUMEN"}
                </div>
                <div
                  className={`text-[15px] font-bold ${
                    status === "locked" ? "text-[#4c6d5b]" : ""
                  }`}
                >
                  {i + 1}. {materi.judul}
                </div>
              </div>
            </div>
            {i < withStatus.length - 1 && (
              <div className="w-[3px] h-11 bg-[#e3eee6] ml-[40px] mb-2" />
            )}
          </div>
        ))}
      </div>

      {current && (
        <div className="max-w-xl mx-auto mt-10 bg-brand-900 rounded-2xl p-5.5">
          <div className="text-accent-300 text-xs font-bold mb-2.5">
            MATERI SAAT INI
          </div>

          {current.tipe === "video" && current.urlYoutube ? (
            <ProtectedVideo youtubeUrl={current.urlYoutube} />
          ) : current.fileUrl ? (
            <a
              href={current.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center h-40 rounded-xl bg-white/5 text-white/80 text-sm font-semibold hover:bg-white/10"
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
              className="inline-block mt-4 bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-2.75 rounded-xl"
            >
              Tandai Selesai &amp; Lanjut →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
