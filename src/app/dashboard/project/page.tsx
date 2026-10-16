import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UploadIcon } from "@/components/icons";
import { uploadProject } from "./actions";
import ReviewButtons from "./ReviewButtons";

const statusLabel: Record<string, string> = {
  pending: "Direview",
  diterima: "Diterima ✓",
  revisi: "Perlu Revisi",
};
const statusClass: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  diterima: "bg-brand-50 text-brand-700",
  revisi: "bg-red-50 text-red-600",
};

export default async function ProjectPage() {
  const session = await auth();
  const user = session!.user;

  if (user.role === "guru") return <GuruProjectReview />;
  return <SiswaProjectPage userId={Number(user.id)} />;
}

async function SiswaProjectPage({ userId }: { userId: number }) {
  const projects = await prisma.kodingProject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-7">Project Saya</h1>

      <form
        action={uploadProject}
        className="border-2 border-dashed border-[#b7d9c0] rounded-2xl p-7 bg-[#eef6f0] mb-9 flex flex-col gap-3.5 max-w-xl"
      >
        <div className="flex justify-center text-brand-600">
          <UploadIcon size={30} />
        </div>
        <input
          name="judul"
          required
          placeholder="Judul project"
          className="w-full px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
        />
        <textarea
          name="deskripsi"
          placeholder="Deskripsi singkat (opsional)"
          rows={2}
          className="w-full px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
        />
        <div className="flex gap-3 flex-wrap">
          <input
            name="linkDemo"
            placeholder="Link demo (opsional)"
            className="flex-1 min-w-[180px] px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          />
          <input
            name="linkGithub"
            placeholder="Link GitHub (opsional)"
            className="flex-1 min-w-[180px] px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          />
        </div>
        <input
          type="file"
          name="file"
          accept=".zip,.pdf,.doc,.docx"
          className="text-sm"
        />
        <button
          type="submit"
          className="self-start bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-2.5 rounded-xl"
        >
          Upload Project
        </button>
      </form>

      <h2 className="text-base font-extrabold mb-4">Riwayat Project</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-border-soft rounded-2xl p-4.5"
          >
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <div className="font-extrabold text-sm">{p.judul}</div>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${statusClass[p.status]}`}
              >
                {statusLabel[p.status]}
              </span>
            </div>
            <div className="text-xs text-muted">
              {p.createdAt.toLocaleDateString("id-ID")}
            </div>
            {p.catatanGuru && (
              <p className="text-xs text-muted mt-2 italic">
                Catatan guru: {p.catatanGuru}
              </p>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-muted">Belum ada project diupload.</p>
        )}
      </div>
    </div>
  );
}

async function GuruProjectReview() {
  const projects = await prisma.kodingProject.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { nama: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-7">Review Project Siswa</h1>
      <div className="flex flex-col gap-3 max-w-2xl">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center gap-3 bg-white border border-border-soft rounded-2xl px-5 py-4"
          >
            <div>
              <div className="font-extrabold text-sm">{p.judul}</div>
              <div className="text-xs text-muted">
                {p.user.nama} · {p.createdAt.toLocaleDateString("id-ID")}
              </div>
            </div>
            {p.status === "pending" ? (
              <ReviewButtons projectId={p.id} />
            ) : (
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${statusClass[p.status]}`}
              >
                {statusLabel[p.status]}
              </span>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-muted">Belum ada project yang diupload siswa.</p>
        )}
      </div>
    </div>
  );
}
