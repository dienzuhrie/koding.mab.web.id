"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  HomeIcon,
  BookIcon,
  HelpIcon,
  BriefcaseIcon,
  LayersIcon,
  ClipboardCheckIcon,
  LogoutIcon,
} from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
};

const siswaNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/materi", label: "Materi Belajar", icon: BookIcon },
  { href: "/dashboard/kuis", label: "Kuis", icon: HelpIcon },
  { href: "/dashboard/project", label: "Project", icon: BriefcaseIcon },
];

const guruNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/admin/materi", label: "Kelola Materi", icon: LayersIcon },
  { href: "/dashboard/admin/kuis", label: "Kelola Kuis", icon: ClipboardCheckIcon },
  { href: "/dashboard/project", label: "Review Project", icon: BriefcaseIcon },
];

export default function Sidebar({ role }: { role: "siswa" | "guru" }) {
  const pathname = usePathname();
  const items = role === "guru" ? guruNav : siswaNav;

  return (
    <aside className="w-60 shrink-0 bg-brand-900 px-4 py-6 flex flex-col min-h-full">
      <div className="flex items-center gap-2.5 px-1.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-accent-400 flex items-center justify-center font-extrabold text-brand-800 text-sm">
          M
        </div>
        <span className="text-white font-extrabold text-sm">MAB Coding</span>
      </div>

      {role === "guru" && (
        <span className="mx-1.5 mb-6 inline-block w-fit text-[10px] font-extrabold tracking-wide text-accent-300 bg-accent-400/10 px-2.5 py-1 rounded-full">
          MODE GURU
        </span>
      )}

      <nav className="flex flex-col gap-1 flex-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? "bg-accent-400/15 text-accent-300 font-bold"
                  : "text-brand-100 hover:bg-white/5"
              }`}
            >
              <Icon className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-100 hover:bg-white/5 transition-colors mt-4"
      >
        <LogoutIcon className="shrink-0" />
        Keluar
      </button>
    </aside>
  );
}
