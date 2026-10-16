-- Skema akses diubah: Administrator & GTK kini otomatis dapat akses "guru"
-- dari role_id_simadu (lihat src/lib/simadu-roles.ts), tidak lagi lewat
-- tabel ini. Tabel koding_user_access sekarang HANYA daftar siswa yang
-- dipilih admin, jadi kolom `role` sudah tidak relevan.
--
-- Hapus dulu baris lama berisi role='guru' (akun admin/guru yang dulu
-- diseed lewat tabel ini), baru hapus kolomnya.

DELETE FROM `koding_user_access` WHERE `role` = 'guru';
ALTER TABLE `koding_user_access` DROP COLUMN `role`;
