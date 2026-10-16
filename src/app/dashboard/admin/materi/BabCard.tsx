"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons";

export default function BabCard({
  urutan,
  judul,
  jumlahMateri,
  defaultOpen = false,
  children,
}: {
  urutan: number;
  judul: string;
  jumlahMateri: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-border-soft rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex justify-between items-center gap-3 px-4.5 py-4 bg-brand-50 text-left"
      >
        <div>
          <div className="text-[11px] font-bold text-brand-600">
            BAB {urutan} · {jumlahMateri} materi
          </div>
          <div className="text-[15px] font-extrabold">{judul}</div>
        </div>
        <ChevronDownIcon
          size={18}
          className={`shrink-0 text-brand-600 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3.5 py-2.5 flex flex-col gap-1.5">{children}</div>
        </div>
      </div>
    </div>
  );
}
