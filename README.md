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

Siapa yang bisa login ditentukan oleh `role_id_simadu` (lihat
`src/lib/simadu-roles.ts`):

- **Administrator & semua GTK** (Kepala Madrasah, Tatausaha, TU Administrasi,
  Waka Kurikulum/Kesiswaan/Humas/Sarpras, Guru BK, Wali Kelas, Guru) —
  otomatis masuk sebagai **guru** di app ini, tidak perlu diatur manual.
- **Siswa** — harus dipilih dulu oleh admin lewat halaman **Kelola Siswa**
  (`/dashboard/admin/siswa`), yang menyimpan pilihan ke tabel baru
  `koding_user_access` (hanya berisi daftar siswa terpilih + status
  aktif/nonaktif, foreign key ke `user.id`). Siswa yang belum/tidak ada di
  tabel ini **tidak bisa login**, meskipun emailnya valid di SIMADU.
- **Wali Murid, Alumni**, dan role dari app lain (`ppdb`, `elib`) — tidak
  bisa login sama sekali ke app ini.

### Membuat tabel baru (sekali saja, sebelum pertama kali dipakai)

**Jangan jalankan `npx prisma migrate` atau `npx prisma db push`** —
schema.prisma di proyek ini hanya memetakan sebagian kolom dari tabel lama
(`user`, `siswa`, `kelas`) untuk keperluan baca saja, jadi tool migrasi
Prisma bisa salah mengira kolom lain harus diubah/dihapus.

Jalankan SQL manual berikut berurutan sekali lewat phpMyAdmin / mysql
client di database `jtwodvjz_simadu`:

1. `prisma/manual-migrations/001_koding_tables.sql` — membuat semua tabel
   baru (`koding_*`), murni additive, tidak menyentuh tabel lama.
2. `prisma/manual-migrations/003_simplify_koding_user_access.sql` —
   menyederhanakan `koding_user_access` jadi murni daftar siswa terpilih
   (file `002` sudah superseded, lihat isinya).
3. `prisma/manual-migrations/004_pathway_tables.sql` — tabel untuk fitur
   Pathway (bahan ajar per pertemuan).

Memilih siswa dilakukan lewat UI (Kelola Siswa), tidak perlu insert SQL
manual lagi untuk operasional sehari-hari.

## Pathway vs Materi Belajar

- **Pathway** (`/dashboard/pathway`, dikelola di `/dashboard/admin/pathway`)
  adalah acuan utama belajar siswa: LKS, PPT, dan materi diupload guru per
  pertemuan, lalu diunduh langsung oleh siswa — tidak ada sistem kunci
  berurutan di sini, murni daftar per pertemuan.
- **Materi Belajar** (roadmap video `koding_bab`/`koding_materi`) sekarang
  berstatus referensi tambahan saja, tetap jalan dengan sistem BAB
  berurutan + progress tracking seperti sebelumnya.

## Upload file (materi dokumen & project siswa)

File disimpan ke `public/uploads/` di server (bukan ke cloud storage), jadi
hosting harus punya disk yang persisten antar-deploy. Folder ini sengaja
di-gitignore.

## Deploy

Push ke branch yang sudah dihubungkan ke auto-deploy IDCloudhost. Pastikan
environment variable `DATABASE_URL`, `NEXTAUTH_SECRET`, dan `NEXTAUTH_URL`
(ke domain production, misal `https://koding.mab.web.id`) sudah diset di
panel IDCloudhost sebelum build pertama.
