import { prisma } from "@/lib/prisma";
import { grantAccess } from "./actions";
import AccessActions from "./AccessActions";

export default async function AdminSiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const [accessList, searchResults] = await Promise.all([
    prisma.kodingUserAccess.findMany({
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
    }),
    query.length >= 2
      ? prisma.user.findMany({
          where: {
            isActive: 1,
            OR: [
              { nama: { contains: query } },
              { email: { contains: query } },
            ],
          },
          select: {
            id: true,
            nama: true,
            email: true,
            kodingAccess: { select: { id: true } },
          },
          take: 15,
        })
      : [],
  ]);

  const grantedIds = new Set(accessList.map((a) => a.userId));

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Kelola Siswa</h1>
      <p className="text-sm text-muted mb-7">
        Cari akun SIMADU yang sudah ada lalu beri akses ke app koding ini.
        Akun yang belum diberi akses di sini tidak bisa login, meskipun
        emailnya valid di SIMADU.
      </p>

      <form className="max-w-xl mb-8" action="/dashboard/admin/siswa" method="get">
        <label className="block text-xs font-bold text-muted mb-1.5">
          Cari nama atau email (SIMADU)
        </label>
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="contoh: Rangga atau rangga@gmail.com"
            className="flex-1 px-3.5 py-2.5 rounded-lg border border-border-soft text-sm"
          />
          <button
            type="submit"
            className="bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-2.5 rounded-lg whitespace-nowrap"
          >
            Cari
          </button>
        </div>
      </form>

      {query.length > 0 && (
        <div className="max-w-xl mb-10">
          <h2 className="text-sm font-extrabold text-muted mb-3">
            Hasil pencarian untuk &quot;{query}&quot;
          </h2>
          <div className="flex flex-col gap-2">
            {searchResults.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-3 bg-white border border-border-soft rounded-xl px-4 py-3"
              >
                <div>
                  <div className="text-sm font-bold">{u.nama}</div>
                  <div className="text-xs text-muted">{u.email}</div>
                </div>
                {grantedIds.has(u.id) ? (
                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">
                    Sudah punya akses
                  </span>
                ) : (
                  <form action={grantAccess} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <select
                      name="role"
                      defaultValue="siswa"
                      className="text-xs font-bold border border-border-soft rounded-lg px-2 py-1.5"
                    >
                      <option value="siswa">Siswa</option>
                      <option value="guru">Guru</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-brand-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-full"
                    >
                      + Beri Akses
                    </button>
                  </form>
                )}
              </div>
            ))}
            {searchResults.length === 0 && (
              <p className="text-sm text-muted">Tidak ada akun ditemukan.</p>
            )}
          </div>
        </div>
      )}

      <h2 className="text-base font-extrabold mb-3.5">
        Akun dengan Akses ({accessList.length})
      </h2>
      <div className="flex flex-col gap-2 max-w-2xl">
        {accessList.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between gap-3 bg-white border border-border-soft rounded-xl px-4 py-3.5"
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
            <AccessActions accessId={a.id} role={a.role} status={a.status} />
          </div>
        ))}
        {accessList.length === 0 && (
          <p className="text-sm text-muted">Belum ada akun yang diberi akses.</p>
        )}
      </div>
    </div>
  );
}
