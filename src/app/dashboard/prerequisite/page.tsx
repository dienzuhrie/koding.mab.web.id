import { prisma } from "@/lib/prisma";
import PrerequisiteTabs from "./PrerequisiteTabs";

export default async function PrerequisitePage() {
  const items = await prisma.kodingPrerequisite.findMany({
    orderBy: { urutan: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Prerequisite</h1>
      <p className="text-sm text-muted mb-7 max-w-xl">
        Siapkan tools di bawah ini sebelum mulai belajar koding. Klik tab
        untuk lihat cara download dan video tutorial instalasinya.
      </p>

      <PrerequisiteTabs items={items} />
    </div>
  );
}
