"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-900 flex items-center justify-center p-8">
      <div className="pointer-events-none absolute -top-24 -left-20 w-96 h-96 rounded-full bg-white opacity-25 blur-3xl animate-aurora-1" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 w-[26rem] h-[26rem] rounded-full bg-white opacity-15 blur-3xl animate-aurora-2" />
      <div className="pointer-events-none absolute top-[30%] left-[55%] w-64 h-64 rounded-full bg-brand-300 opacity-20 blur-3xl animate-aurora-3" />

      <div className="relative w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-xl bg-accent-400 flex items-center justify-center font-extrabold text-brand-800">
            M
          </div>
          <span className="font-extrabold text-sm">Full Stack Developer MAB</span>
        </div>

        <h1 className="text-2xl font-extrabold mb-1.5">Selamat datang kembali</h1>
        <p className="text-sm text-muted mb-6">
          Masuk untuk melanjutkan materi, kuis, dan project kamu.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@sekolah.sch.id"
              className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-border-soft text-sm outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5" htmlFor="password">
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-border-soft text-sm outline-none focus:border-brand-500"
            />
          </div>

          {state?.error && (
            <p className="text-sm font-semibold text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 bg-accent-400 text-brand-800 font-extrabold text-sm py-3 rounded-xl hover:bg-accent-300 transition-colors disabled:opacity-60"
          >
            {pending ? "Memeriksa..." : "Masuk"}
          </button>

          <Link
            href="/"
            className="text-center text-sm font-semibold text-muted hover:text-brand-700"
          >
            ← Kembali ke Home
          </Link>
        </form>
      </div>
    </div>
  );
}
