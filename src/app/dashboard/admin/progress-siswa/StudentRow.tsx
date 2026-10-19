"use client";

import { useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@/components/icons";

type ChecklistItem = { id: number; judul: string; groupLabel: string; done: boolean };

export default function StudentRow({
  nama,
  email,
  kelas,
  materiSelesai,
  totalMateri,
  pathwayViewed,
  totalBahan,
  materiChecklist,
  bahanChecklist,
}: {
  nama: string;
  email: string;
  kelas: string;
  materiSelesai: number;
  totalMateri: number;
  pathwayViewed: number;
  totalBahan: number;
  materiChecklist: ChecklistItem[];
  bahanChecklist: ChecklistItem[];
}) {
  const [open, setOpen] = useState(false);
  const materiPct = totalMateri ? Math.round((materiSelesai / totalMateri) * 100) : 0;
  const pathwayPct = totalBahan ? Math.round((pathwayViewed / totalBahan) * 100) : 0;

  return (
    <div className="border-t border-border-soft">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="card-lift w-full grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 px-5 py-4 items-center text-left"
      >
        <div className="min-w-0">
          <div className="text-sm font-bold truncate">{nama}</div>
          <div className="text-xs text-muted truncate">
            {kelas} · {email}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-extrabold text-brand-800">
            {materiSelesai}/{totalMateri}
          </div>
          <div className="h-1.5 w-16 mx-auto bg-[#e3eee6] rounded-full overflow-hidden mt-1">
            <div className="h-full bg-brand-500" style={{ width: `${materiPct}%` }} />
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-extrabold text-brand-800">
            {pathwayViewed}/{totalBahan}
          </div>
          <div className="h-1.5 w-16 mx-auto bg-[#e3eee6] rounded-full overflow-hidden mt-1">
            <div className="h-full bg-accent-400" style={{ width: `${pathwayPct}%` }} />
          </div>
        </div>
        <ChevronDownIcon
          size={18}
          className={`shrink-0 text-muted transition-transform duration-300 ${
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
          <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ChecklistBlock title="Materi Pendukung" items={materiChecklist} tint="brand" />
            <ChecklistBlock title="Pathway Belajar" items={bahanChecklist} tint="accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistBlock({
  title,
  items,
  tint,
}: {
  title: string;
  items: ChecklistItem[];
  tint: "brand" | "accent";
}) {
  let lastGroup = "";
  return (
    <div className="bg-[#f5fbf4] rounded-xl p-3.5">
      <div className="text-xs font-bold text-muted mb-2.5">{title}</div>
      <div className="flex flex-col gap-0.5 max-h-72 overflow-y-auto">
        {items.map((item) => {
          const showGroup = item.groupLabel !== lastGroup;
          lastGroup = item.groupLabel;
          return (
            <div key={item.id}>
              {showGroup && (
                <div className="text-[10px] font-bold text-muted uppercase tracking-wide mt-2 mb-1 first:mt-0">
                  {item.groupLabel}
                </div>
              )}
              <div className="flex items-center gap-2 py-1">
                <div
                  className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ${
                    item.done
                      ? tint === "brand"
                        ? "bg-brand-500 text-white"
                        : "bg-accent-400 text-brand-800"
                      : "bg-gray-200 text-transparent"
                  }`}
                >
                  <CheckIcon size={10} />
                </div>
                <span
                  className={`text-xs ${
                    item.done ? "font-semibold" : "text-muted"
                  }`}
                >
                  {item.judul}
                </span>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="text-xs text-muted">Belum ada data.</p>
        )}
      </div>
    </div>
  );
}
