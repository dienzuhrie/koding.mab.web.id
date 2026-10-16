import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();
  const userId = Number(session!.user.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      nama: true,
      email: true,
      siswa: { select: { kelas: { select: { namaKelas: true } } } },
    },
  });

  const role = session!.user.role;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-extrabold mb-1">Profil Saya</h1>
      <p className="text-sm text-muted mb-7">
        Data ini mengikuti akun SIMADU kamu. Untuk mengubahnya, hubungi admin
        SIMADU — bukan lewat halaman ini.
      </p>

      <div className="reveal bg-white border border-border-soft rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
            {(user?.nama ?? "").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-extrabold text-lg">{user?.nama}</div>
            <span className="inline-block text-[10px] font-extrabold tracking-wide text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              {role === "guru" ? "GURU" : "SISWA"}
            </span>
          </div>
        </div>

        <dl className="flex flex-col gap-4">
          <div>
            <dt className="text-xs font-bold text-muted mb-0.5">Email</dt>
            <dd className="text-sm font-semibold">{user?.email}</dd>
          </div>
          {user?.siswa?.kelas && (
            <div>
              <dt className="text-xs font-bold text-muted mb-0.5">Kelas</dt>
              <dd className="text-sm font-semibold">{user.siswa.kelas.namaKelas}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
