"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function searchUsers(query: string) {
  const q = query.trim();
  if (q.length < 2) return [];

  const users = await prisma.user.findMany({
    where: {
      isActive: 1,
      OR: [{ nama: { contains: q } }, { email: { contains: q } }],
    },
    select: {
      id: true,
      nama: true,
      email: true,
      kodingAccess: { select: { id: true } },
    },
    take: 15,
  });

  return users.map((u) => ({
    id: u.id,
    nama: u.nama,
    email: u.email,
    hasAccess: !!u.kodingAccess,
  }));
}

export async function grantAccess(formData: FormData) {
  const userId = Number(formData.get("userId"));
  const role = String(formData.get("role")) as "siswa" | "guru";
  if (!userId || (role !== "siswa" && role !== "guru")) {
    throw new Error("Data tidak valid.");
  }

  await prisma.kodingUserAccess.upsert({
    where: { userId },
    update: { role, status: "active" },
    create: { userId, role, status: "active" },
  });

  revalidatePath("/dashboard/admin/siswa");
}

export async function toggleStatus(accessId: number) {
  const access = await prisma.kodingUserAccess.findUnique({
    where: { id: accessId },
  });
  if (!access) return;

  await prisma.kodingUserAccess.update({
    where: { id: accessId },
    data: { status: access.status === "active" ? "inactive" : "active" },
  });

  revalidatePath("/dashboard/admin/siswa");
}

export async function changeRole(accessId: number, role: "siswa" | "guru") {
  await prisma.kodingUserAccess.update({
    where: { id: accessId },
    data: { role },
  });
  revalidatePath("/dashboard/admin/siswa");
}
