"use client";

import { useEffect, useRef, useState } from "react";

export type OfficeKind = "docx" | "pptx" | "xlsx";

type SheetView = { name: string; rows: string[][]; truncated: boolean };

const MAX_ROWS = 500;
const MAX_COLS = 40;

function cellToString(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toLocaleDateString("id-ID");
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  return String(v);
}

export default function OfficeViewer({
  fileUrl,
  kind,
}: {
  fileUrl: string;
  kind: OfficeKind;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [sheets, setSheets] = useState<SheetView[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const host = hostRef.current;

    async function run() {
      try {
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (cancelled || !host) return;

        if (kind === "docx") {
          const { renderAsync } = await import("docx-preview");
          if (cancelled) return;
          host.innerHTML = "";
          await renderAsync(buf, host, undefined, {
            className: "docx",
            inWrapper: true,
            breakPages: true,
          });
        } else if (kind === "pptx") {
          const { init } = await import("pptx-preview");
          if (cancelled) return;
          host.innerHTML = "";
          const width = Math.max(320, Math.min(host.clientWidth - 24, 1100));
          const previewer = init(host, {
            width,
            height: Math.round((width * 9) / 16),
            mode: "list",
          });
          cleanup = () => {
            try {
              previewer.destroy();
            } catch {
              // abaikan: DOM sudah dilepas
            }
          };
          await previewer.preview(buf);
        } else {
          const { default: readXlsxFile } = await import(
            "read-excel-file/universal"
          );
          const parsed = await readXlsxFile(buf);
          if (cancelled) return;
          setSheets(
            parsed.map((s) => ({
              name: s.sheet,
              rows: s.data
                .slice(0, MAX_ROWS)
                .map((row) => row.slice(0, MAX_COLS).map(cellToString)),
              truncated:
                s.data.length > MAX_ROWS ||
                s.data.some((row) => row.length > MAX_COLS),
            }))
          );
        }

        if (!cancelled) setStatus("ready");
      } catch (err) {
        console.error("[OfficeViewer]", err);
        if (!cancelled) setStatus("error");
      }
    }

    run();

    return () => {
      cancelled = true;
      cleanup?.();
      if (host) host.innerHTML = "";
    };
  }, [fileUrl, kind]);

  const sheet = sheets[activeSheet];

  return (
    <div className="relative h-[85vh] overflow-auto rounded-xl border border-border-soft bg-white">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          Memuat dokumen...
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-muted">
          Dokumen tidak bisa ditampilkan di sini.
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-press bg-accent-400 text-brand-800 font-extrabold text-sm px-5 py-2.5 rounded-xl"
          >
            Buka / Unduh File
          </a>
        </div>
      )}

      <div ref={hostRef} className={kind === "xlsx" ? "hidden" : "min-h-full"} />

      {kind === "xlsx" && status === "ready" && sheet && (
        <div>
          {sheets.length > 1 && (
            <div className="sticky top-0 z-10 flex gap-1.5 overflow-x-auto bg-white border-b border-border-soft px-3 py-2">
              {sheets.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setActiveSheet(i)}
                  className={`btn-press shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold ${
                    i === activeSheet
                      ? "bg-brand-800 text-white"
                      : "bg-brand-50 text-brand-700 hover:bg-brand-100"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
          <table className="text-xs border-collapse">
            <tbody>
              {sheet.rows.map((row, r) => (
                <tr key={r} className={r === 0 ? "bg-brand-50 font-bold" : ""}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="border border-border-soft px-2.5 py-1.5 whitespace-nowrap"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {sheet.truncated && (
            <p className="px-3 py-2 text-xs text-muted">
              Hanya menampilkan {MAX_ROWS} baris &amp; {MAX_COLS} kolom pertama —
              unduh file untuk melihat seluruhnya.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
