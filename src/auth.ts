import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { GTK_ADMIN_ROLE_IDS, SISWA_ROLE_ID } from "@/lib/simadu-roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "siswa" | "guru";
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // Skema akses: lihat README "Integrasi user existing".
        // - Administrator & GTK (role_id_simadu) -> otomatis "guru".
        // - Siswa -> harus dipilih admin lewat koding_user_access dulu.
        let user;
        try {
          user = await prisma.user.findFirst({
            where: { email, isActive: 1 },
            include: { kodingAccess: true },
          });
        } catch (err) {
          console.error(
            "[auth] Query ke tabel user/koding_user_access gagal — sudah jalankan prisma/manual-migrations/*.sql?",
            err
          );
          return null;
        }

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        let role: "siswa" | "guru" | null = null;
        if (GTK_ADMIN_ROLE_IDS.includes(user.roleIdSimadu)) {
          role = "guru";
        } else if (
          user.roleIdSimadu === SISWA_ROLE_ID &&
          user.kodingAccess?.status === "active"
        ) {
          role = "siswa";
        }

        if (!role) return null;

        return {
          id: String(user.id),
          name: user.nama,
          email: user.email,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: "siswa" | "guru" }).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "siswa" | "guru";
      return session;
    },
  },
});
