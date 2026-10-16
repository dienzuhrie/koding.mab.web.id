"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogoutIcon, ChevronDownIcon } from "@/components/icons";

export default function Header({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: "siswa" | "guru";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = name.slice(0, 2).toUpperCase();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/90 backdrop-blur border-b border-border-soft">
      <div className="text-sm font-bold text-brand-800">
        Halo, {name.split(" ")[0]} 👋
      </div>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="btn-press flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-brand-50 transition-colors"
        >
          <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-extrabold text-xs shrink-0">
            {initials}
          </div>
          <ChevronDownIcon
            size={14}
            className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="reveal absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border-soft overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border-soft">
              <div className="text-sm font-bold truncate">{name}</div>
              <div className="text-xs text-muted truncate">{email}</div>
              <span className="inline-block mt-1.5 text-[10px] font-extrabold tracking-wide text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                {role === "guru" ? "GURU" : "SISWA"}
              </span>
            </div>
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-50 transition-colors"
            >
              Profil Saya
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon size={16} />
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
