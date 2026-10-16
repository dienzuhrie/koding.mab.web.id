"use client";

import { useState } from "react";
import { FileTextIcon } from "@/components/icons";
import PreviewModal from "@/components/PreviewModal";
import { markBahanViewed } from "./actions";

const tipeLabel: Record<string, string> = {
  lks: "LKS",
  ppt: "PPT",
  materi: "Materi",
  lainnya: "Lainnya",
};
const tipeClass: Record<string, string> = {
  lks: "bg-amber-50 text-amber-700",
  ppt: "bg-orange-50 text-orange-700",
  materi: "bg-blue-50 text-blue-700",
  lainnya: "bg-gray-100 text-gray-600",
};

export default function BahanCard({
  bahanId,
  judul,
  tipe,
  fileUrl,
}: {
  bahanId: number;
  judul: string;
  tipe: string;
  fileUrl: string;
}) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
    markBahanViewed(bahanId).catch(() => {});
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="card-lift flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50/60 text-left w-full"
      >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600">
          <FileTextIcon size={17} />
        </div>
        <div className="flex-1 text-sm font-bold">{judul}</div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full ${tipeClass[tipe]}`}
        >
          {tipeLabel[tipe]}
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
