"use client";

import { useState } from "react";
import { FileTextIcon } from "@/components/icons";
import PreviewModal from "@/components/PreviewModal";

const tipeLabel: Record<string, string> = {
  lks: "LKS",
  ppt: "PPT",
  materi: "Materi",
  lainnya: "Lainnya",
};

export default function BahanItem({
  judul,
  tipe,
  fileUrl,
}: {
  judul: string;
  tipe: string;
  fileUrl: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg transition-colors hover:bg-brand-50/60 text-left w-full"
      >
        <div className="w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
          <FileTextIcon size={15} />
        </div>
        <div className="flex-1 text-sm font-bold">{judul}</div>
        <span className="text-[10px] text-muted">
          {tipeLabel[tipe]} · Pratinjau
        </span>
      </button>

      <PreviewModal
        open={open}
        onClose={() => setOpen(false)}
        title={judul}
        fileUrl={fileUrl}
      />
    </>
  );
}
