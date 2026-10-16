"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Dashboard punya template transisi sendiri yang hanya membungkus area
  // konten (lihat app/dashboard/template.tsx) -- di sini dilewati supaya
  // Sidebar/Header/Footer tidak ikut ter-animasi saat pindah menu.
  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }
  return <ViewTransition>{children}</ViewTransition>;
}
