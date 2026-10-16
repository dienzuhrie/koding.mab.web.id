"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SISWA_ROLE_ID } from "@/lib/simadu-roles";

export async function searchUsers(query: string) {
  const q = query.trim();
  if (q.length < 2) return [];

  const users = await prisma.user.findMany({
    where: {
      isActive: 1,
      roleIdSimadu: SISWA_ROLE_ID,
      OR: [{ nama: { contains: q } }, { email: { contains: q } }],
    },
    select: {
      id: true,
      nama: true,
      email: true,
      kodingAccess: { select: { id: true, status: true } },
    },
    take: 15,
  });

  return users.map((u) => ({
    id: u.id,
    nama: u.nama,
    email: u.email,
    hasAccess: !!u.kodingAccess && u.kodingAccess.status === "active",
  }));
}

export async function grantAccess(formData: FormData) {
  const userId = Number(formData.get("userId"));
  if (!userId) throw new Error("Data tidak valid.");

  await prisma.kodingUserAccess.upsert({
    where: { userId },
    update: { status: "active" },
    create: { userId, status: "active" },
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
