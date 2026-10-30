"use client";

import { useEffect, useState } from "react";

const CHECK_EVERY_MS = 2 * 60 * 1000;
const RELOAD_GUARD_KEY = "mab-reloaded-for";

function isEditing() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    (el as HTMLElement).isContentEditable
  );
}

// Menyegarkan tab yang sedang terbuka setelah ada deploy baru. Klik menu
// pertama setelah deploy sudah ditangani Next.js sendiri (deploymentId ->
// hard navigation); komponen ini menutup celah untuk tab yang didiamkan.
export default function VersionWatcher() {
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-dpl-id");
    if (!current) return; // fitur mati (mis. mode dev)

    let stopped = false;

    async function check() {
      if (stopped || document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const { id } = (await res.json()) as { id: string | null };
        if (!id || id === current) return;

        // Pengaman: jangan reload berulang untuk ID yang sama.
        let alreadyTried = false;
        try {
          alreadyTried = sessionStorage.getItem(RELOAD_GUARD_KEY) === id;
        } catch {
          // sessionStorage tidak tersedia -- lanjut tanpa pengaman
        }

        if (isEditing() || alreadyTried) {
          setUpdateReady(true);
          return;
        }
        try {
          sessionStorage.setItem(RELOAD_GUARD_KEY, id);
        } catch {
          // abaikan
        }
        window.location.reload();
      } catch {
        // offline / server sedang restart -- coba lagi di putaran berikutnya
      }
    }

    const interval = setInterval(check, CHECK_EVERY_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    check();

    return () => {
      stopped = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, []);

  if (!updateReady) return null;

  return (
    <div className="reveal fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 rounded-2xl bg-brand-900 text-white shadow-2xl px-4 py-3 text-sm">
      <span className="font-semibold">Versi baru tersedia.</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn-press bg-accent-400 text-brand-800 font-extrabold text-xs px-3.5 py-1.5 rounded-lg"
      >
        Perbarui sekarang
      </button>
    </div>
  );
}
