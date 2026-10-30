"use client";

import { useRef, useState } from "react";
import { UploadIcon, XIcon } from "@/components/icons";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileDropzone({
  name,
  accept,
  required = false,
  maxMB = 25,
  hint,
}: {
  name: string;
  accept: string;
  required?: boolean;
  maxMB?: number;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allowedExts = accept
    .split(",")
    .map((e) => e.trim().toLowerCase().replace(/^\./, ""));

  function validate(f: File): string | null {
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowedExts.includes(ext)) {
      return `Format .${ext || "?"} tidak didukung (boleh: ${allowedExts.join(", ")}).`;
    }
    if (f.size > maxMB * 1024 * 1024) {
      return `Ukuran file melebihi ${maxMB} MB.`;
    }
    return null;
  }

  function applyFile(f: File | null) {
    const input = inputRef.current;
    if (!input) return;

    if (!f) {
      input.value = "";
      setFile(null);
      setError(null);
      return;
    }

    const problem = validate(f);
    if (problem) {
      input.value = "";
      setFile(null);
      setError(problem);
      return;
    }

    const dt = new DataTransfer();
    dt.items.add(f);
    input.files = dt.files;
    setFile(f);
    setError(null);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          applyFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`relative rounded-xl border-2 border-dashed px-4 py-5 text-center transition-all duration-200 ${
          dragging
            ? "border-accent-400 bg-accent-400/10 scale-[1.02]"
            : file
            ? "border-brand-400 bg-brand-400/10"
            : "border-white/25 bg-[#0d3328] hover:border-white/45"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          required={required}
          onChange={(e) => applyFile(e.target.files?.[0] ?? null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Pilih file"
        />

        {file ? (
          <div className="relative z-10 flex items-center justify-between gap-3 pointer-events-none">
            <div className="text-left min-w-0">
              <div className="text-sm font-bold text-white truncate">{file.name}</div>
              <div className="text-xs text-brand-100">{formatSize(file.size)}</div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                applyFile(null);
              }}
              className="btn-press pointer-events-auto shrink-0 p-1.5 rounded-lg text-brand-100 hover:text-white hover:bg-white/10"
              title="Hapus file"
            >
              <XIcon size={16} />
            </button>
          </div>
        ) : (
          <div className="pointer-events-none">
            <div
              className={`flex justify-center mb-1.5 transition-transform duration-200 ${
                dragging ? "text-accent-300 -translate-y-1" : "text-brand-100"
              }`}
            >
              <UploadIcon size={24} />
            </div>
            <div className="text-sm font-bold text-white">
              {dragging ? "Lepaskan file di sini" : "Tarik & lepas file ke sini"}
            </div>
            <div className="text-xs text-brand-100 mt-0.5">
              atau klik untuk memilih
              {hint ? ` · ${hint}` : ""}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="reveal text-xs font-semibold text-red-300 mt-1.5">{error}</p>
      )}
    </div>
  );
}
