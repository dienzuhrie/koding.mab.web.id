"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { searchUsers, grantAccess } from "./actions";

type Result = {
  id: number;
  nama: string;
  email: string;
  hasAccess: boolean;
};

export default function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const res = await searchUsers(query);
        setResults(res);
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="max-w-xl mb-10">
      <label className="block text-xs font-bold text-muted mb-1.5">
        Cari siswa aktif (nama atau email SIMADU)
      </label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="contoh: Rangga atau rangga@gmail.com"
        className="w-full px-3.5 py-2.5 rounded-lg border border-border-soft text-sm mb-3"
      />

      {query.trim().length >= 2 && (
        <div className="flex flex-col gap-2">
          {isPending && results.length === 0 && (
            <p className="text-xs text-muted">Mencari...</p>
          )}
          {results.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 bg-white border border-border-soft rounded-xl px-4 py-3"
            >
              <div>
                <div className="text-sm font-bold">{u.nama}</div>
                <div className="text-xs text-muted">{u.email}</div>
              </div>
              {u.hasAccess ? (
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
          {!isPending && results.length === 0 && (
            <p className="text-sm text-muted">Tidak ada akun ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}
