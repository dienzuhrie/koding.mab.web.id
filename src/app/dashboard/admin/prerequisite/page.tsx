import { prisma } from "@/lib/prisma";
import PrerequisiteManager from "./PrerequisiteManager";

export default async function AdminPrerequisitePage() {
  const items = await prisma.kodingPrerequisite.findMany({
    orderBy: { urutan: "asc" },
  });

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold mb-1">Kelola Prerequisite</h1>
        <p className="text-sm text-muted max-w-lg">
          Daftar tools yang perlu siswa siapkan sebelum mulai koding (VS Code,
          XAMPP, dll) — tiap tools tampil sebagai satu tab di sisi siswa,
          lengkap dengan link download dan video tutorial instalasi.
        </p>
      </div>

      <PrerequisiteManager items={items} />
    </div>
  );
}
