# Full Stack Developer MAB

Platform belajar koding untuk siswa — showcase karya siswa (publik, tanpa
login) dan pembelajaran terstruktur (materi berurutan, kuis interaktif,
upload project) untuk siswa & guru yang login.

Dibangun dengan Next.js (App Router) + Tailwind CSS, Prisma, NextAuth, dan
MySQL (database `jtwodvjz_simadu` yang sama dengan SIMADU — lihat
"Integrasi user existing" di bawah).

## Setup lokal

1. Copy `.env.example` ke `.env` lalu isi `DATABASE_URL` dan `NEXTAUTH_SECRET`
   (generate dengan `openssl rand -base64 32`).
2. `npm install`
3. `npx prisma generate`
4. `npm run dev` lalu buka http://localhost:3000

## Integrasi user existing (SIMADU)

App ini **tidak punya tabel user sendiri**. Login memakai tabel `user` yang
sudah ada di database `jtwodvjz_simadu` (dipakai bersama oleh app SIMADU,
PPDB, dan e-lib), termasuk password bcrypt yang sudah ada — tidak perlu
re-hash atau migrasi password.

Supaya tidak mengganggu skema lama, akses ke app koding dikontrol lewat
tabel baru `koding_user_access` (terpisah, hanya foreign key ke `user.id`).
User yang belum punya baris di tabel ini **tidak bisa login** ke app ini,
meskipun emailnya valid di SIMADU.

### Membuat tabel baru (sekali saja, sebelum pertama kali dipakai)

**Jangan jalankan `npx prisma migrate` atau `npx prisma db push`** —
schema.prisma di proyek ini hanya memetakan sebagian kolom dari tabel lama
(`user`, `siswa`, `kelas`) untuk keperluan baca saja, jadi tool migrasi
Prisma bisa salah mengira kolom lain harus diubah/dihapus.

Jalankan SQL manual berikut sekali lewat phpMyAdmin / mysql client di
database `jtwodvjz_simadu`:

1. `prisma/manual-migrations/001_koding_tables.sql` — membuat semua tabel
   baru (`koding_*`), murni additive, tidak menyentuh tabel lama.
2. `prisma/manual-migrations/002_seed_initial_guru.sql` — menjadikan akun
   `sukafisika@gmail.com` (user.id = 2) sebagai guru pertama supaya ada
   yang bisa langsung login dan mulai mengisi materi/kuis.

Untuk menambah akses guru/siswa lain setelahnya, insert manual ke
`koding_user_access`:

```sql
INSERT INTO koding_user_access (user_id, role, status)
VALUES (<id_user_simadu>, 'siswa', 'active');
```

## Upload file (materi dokumen & project siswa)

File disimpan ke `public/uploads/` di server (bukan ke cloud storage), jadi
hosting harus punya disk yang persisten antar-deploy. Folder ini sengaja
di-gitignore.

## Deploy

Push ke branch yang sudah dihubungkan ke auto-deploy IDCloudhost. Pastikan
environment variable `DATABASE_URL`, `NEXTAUTH_SECRET`, dan `NEXTAUTH_URL`
(ke domain production, misal `https://koding.mab.web.id`) sudah diset di
panel IDCloudhost sebelum build pertama.
