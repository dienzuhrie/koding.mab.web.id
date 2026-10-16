"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BookIcon,
  HelpIcon,
  BriefcaseIcon,
  LayersIcon,
  ClipboardCheckIcon,
  UsersIcon,
  RouteIcon,
  TrendUpIcon,
  PanelToggleIcon,
} from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
};

const siswaNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/pathway", label: "Pathway", icon: RouteIcon },
  { href: "/dashboard/materi", label: "Materi Belajar", icon: BookIcon },
  { href: "/dashboard/kuis", label: "Kuis", icon: HelpIcon },
  { href: "/dashboard/project", label: "Project", icon: BriefcaseIcon },
];

const guruNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/dashboard/admin/pathway", label: "Kelola Pathway", icon: RouteIcon },
  { href: "/dashboard/admin/materi", label: "Kelola Materi", icon: LayersIcon },
  { href: "/dashboard/admin/kuis", label: "Kelola Kuis", icon: ClipboardCheckIcon },
  { href: "/dashboard/admin/siswa", label: "Kelola Siswa", icon: UsersIcon },
  { href: "/dashboard/admin/progress-siswa", label: "Progress Siswa", icon: TrendUpIcon },
  { href: "/dashboard/project", label: "Review Project", icon: BriefcaseIcon },
];

const STORAGE_KEY = "mab-sidebar-collapsed";

export default function Sidebar({ role }: { role: "siswa" | "guru" }) {
  const pathname = usePathname();
  const items = role === "guru" ? guruNav : siswaNav;
  const [collapsed, setCollapsed] = useState(false);
  const hydrated = useRef(false);

  // Muat preferensi tersimpan sekali saat mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "1") setCollapsed(true);
    } catch {
      // abaikan, localStorage tidak tersedia
    } finally {
      hydrated.current = true;
    }
  }, []);

  // Auto-collapse saat siswa membuka Materi Belajar, supaya video lebih lega.
  useEffect(() => {
    if (pathname.startsWith("/dashboard/materi")) {
      setCollapsed(true);
    }
  }, [pathname]);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // abaikan
      }
      return next;
    });
  }

  return (
    <aside
      className={`sticky top-0 h-screen overflow-y-auto shrink-0 bg-brand-900 py-6 flex flex-col transition-[width] duration-300 ease-in-out ${
        collapsed ? "w-[76px] px-3" : "w-60 px-4"
      }`}
    >
      <div
        className={`flex items-center mb-3 ${
          collapsed ? "justify-center" : "justify-between px-1.5"
        }`}
      >
        <div className={`flex items-center gap-2.5 ${collapsed ? "" : ""}`}>
          <div className="w-8 h-8 rounded-lg bg-accent-400 flex items-center justify-center font-extrabold text-brand-800 text-sm shrink-0">
            M
          </div>
          {!collapsed && (
            <span className="text-white font-extrabold text-sm whitespace-nowrap">
              MAB Coding
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={toggle}
            title="Ciutkan menu"
            className="btn-press text-brand-100 hover:text-white hover:bg-white/5 rounded-lg p-1.5 transition-colors"
          >
            <PanelToggleIcon size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={toggle}
          title="Perluas menu"
          className="btn-press mx-auto mb-3 text-brand-100 hover:text-white hover:bg-white/5 rounded-lg p-1.5 transition-colors"
        >
          <PanelToggleIcon size={16} />
        </button>
      )}

      {!collapsed && role === "guru" && (
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
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                collapsed ? "justify-center px-0" : "px-3.5"
              } ${
                active
                  ? "bg-accent-400/15 text-accent-300 font-bold"
                  : "text-brand-100 hover:bg-white/5"
              }`}
            >
              <Icon className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
