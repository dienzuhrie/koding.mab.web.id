import { prisma } from "@/lib/prisma";
import AccessActions from "./AccessActions";
import LiveSearch from "./LiveSearch";

export default async function AdminSiswaPage() {
  const accessList = await prisma.kodingUserAccess.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          nama: true,
          email: true,
          siswa: { select: { kelas: { select: { namaKelas: true } } } },
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Kelola Siswa</h1>
      <p className="text-sm text-muted mb-7">
        Administrator dan semua GTK otomatis bisa login tanpa perlu diatur di
        sini. Siswa aktif perlu dipilih dulu di bawah ini sebelum bisa login,
        meskipun emailnya valid di SIMADU.
      </p>

      <LiveSearch />

      <h2 className="text-base font-extrabold mb-3.5">
        Akun dengan Akses ({accessList.length})
      </h2>
      <div className="flex flex-col gap-2 max-w-2xl">
        {accessList.map((a) => (
          <div
            key={a.id}
            className="card-lift flex items-center justify-between gap-3 bg-white border border-border-soft rounded-xl px-4 py-3.5 hover:shadow-sm"
          >
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                {a.user.nama}
                {a.status === "inactive" && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    NONAKTIF
                  </span>
                )}
              </div>
              <div className="text-xs text-muted">
                {a.user.email}
                {a.user.siswa?.kelas && ` · ${a.user.siswa.kelas.namaKelas}`}
              </div>
            </div>
            <AccessActions accessId={a.id} status={a.status} />
          </div>
        ))}
        {accessList.length === 0 && (
          <p className="text-sm text-muted">Belum ada akun yang diberi akses.</p>
        )}
      </div>
    </div>
  );
}
