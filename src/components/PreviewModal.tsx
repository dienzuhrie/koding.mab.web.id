"use client";

import { useEffect } from "react";
import ProtectedVideo from "./ProtectedVideo";
import { XIcon } from "./icons";

const previewableDocs = ["ppt", "pptx", "doc", "docx"];

export default function PreviewModal({
  open,
  onClose,
  title,
  youtubeUrl,
  fileUrl,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  youtubeUrl?: string | null;
  fileUrl?: string | null;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const ext = fileUrl?.split(".").pop()?.toLowerCase();
  const absoluteUrl =
    fileUrl && typeof window !== "undefined"
      ? new URL(fileUrl, window.location.origin).toString()
      : fileUrl ?? "";

  return (
    <div
      className="reveal fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-soft">
          <div className="font-extrabold text-sm truncate pr-4">{title}</div>
          <button
            onClick={onClose}
            className="btn-press text-muted hover:text-brand-800 p-1.5 rounded-lg hover:bg-brand-50"
          >
            <XIcon size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-[#f5fbf4]">
          {youtubeUrl ? (
            <ProtectedVideo youtubeUrl={youtubeUrl} />
          ) : fileUrl ? (
            ext === "pdf" ? (
              <iframe
                src={fileUrl}
                className="w-full h-[65vh] rounded-xl border border-border-soft bg-white"
              />
            ) : previewableDocs.includes(ext ?? "") ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(absoluteUrl)}&embedded=true`}
                className="w-full h-[65vh] rounded-xl border border-border-soft bg-white"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-sm text-muted">
                Format file ini tidak bisa dipratinjau langsung.
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-press bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-2.5 rounded-xl"
                >
                  Buka / Unduh File
                </a>
              </div>
            )
          ) : (
            <div className="text-sm text-muted text-center py-10">
              Konten belum tersedia.
            </div>
          )}
        </div>
        {fileUrl && (
          <div className="px-5 py-3 border-t border-border-soft text-right">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-brand-600 hover:text-brand-800"
            >
              Buka di tab baru / Unduh →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
