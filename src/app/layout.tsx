import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import VersionWatcher from "@/components/VersionWatcher";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Full Stack Developer MAB",
  description:
    "Platform belajar koding untuk siswa: materi terstruktur, kuis interaktif, dan showcase project.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <VersionWatcher />
      </body>
    </html>
  );
}
