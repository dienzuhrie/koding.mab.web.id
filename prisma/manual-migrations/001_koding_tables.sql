-- Tabel baru khusus app "Full Stack Developer MAB" (koding.mab.web.id).
-- SEMUA tabel di sini bersifat ADDITIVE: tidak ada ALTER/DROP terhadap
-- tabel lama (user, siswa, kelas, dst) milik SIMADU. Aman dijalankan
-- sekali di database jtwodvjz_simadu yang sudah berjalan di produksi.
--
-- Jangan jalankan `prisma migrate` / `prisma db push` terhadap schema.prisma
-- proyek ini -- karena model User/Siswa/Kelas hanya memetakan sebagian kolom
-- (read-only), Prisma bisa salah mengira kolom lain harus dihapus. Gunakan
-- file SQL manual ini saja untuk membuat tabel baru.

CREATE TABLE IF NOT EXISTS `koding_user_access` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `role` ENUM('siswa','guru') NOT NULL,
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `koding_user_access_user_id_key` (`user_id`),
  CONSTRAINT `koding_user_access_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_bab` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `judul` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT NULL,
  `urutan` INT NOT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_materi` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `bab_id` INT NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `tipe` ENUM('video','dokumen') NOT NULL,
  `url_youtube` VARCHAR(512) NULL,
  `file_url` VARCHAR(512) NULL,
  `urutan` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `koding_materi_bab_id_idx` (`bab_id`),
  CONSTRAINT `koding_materi_bab_id_fkey` FOREIGN KEY (`bab_id`) REFERENCES `koding_bab` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_progress_materi` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `materi_id` INT NOT NULL,
  `status` ENUM('locked','in_progress','selesai') NOT NULL DEFAULT 'locked',
  `completed_at` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `koding_progress_materi_user_id_materi_id_key` (`user_id`, `materi_id`),
  KEY `koding_progress_materi_materi_id_idx` (`materi_id`),
  CONSTRAINT `koding_progress_materi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `koding_progress_materi_materi_id_fkey` FOREIGN KEY (`materi_id`) REFERENCES `koding_materi` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_kuis` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `bab_id` INT NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `koding_kuis_bab_id_idx` (`bab_id`),
  CONSTRAINT `koding_kuis_bab_id_fkey` FOREIGN KEY (`bab_id`) REFERENCES `koding_bab` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_soal` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kuis_id` INT NOT NULL,
  `pertanyaan` TEXT NOT NULL,
  `urutan` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `koding_soal_kuis_id_idx` (`kuis_id`),
  CONSTRAINT `koding_soal_kuis_id_fkey` FOREIGN KEY (`kuis_id`) REFERENCES `koding_kuis` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_opsi` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `soal_id` INT NOT NULL,
  `label` VARCHAR(512) NOT NULL,
  `is_correct` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `koding_opsi_soal_id_idx` (`soal_id`),
  CONSTRAINT `koding_opsi_soal_id_fkey` FOREIGN KEY (`soal_id`) REFERENCES `koding_soal` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_hasil_kuis` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `kuis_id` INT NOT NULL,
  `skor` INT NOT NULL,
  `selesai_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `koding_hasil_kuis_user_id_idx` (`user_id`),
  KEY `koding_hasil_kuis_kuis_id_idx` (`kuis_id`),
  CONSTRAINT `koding_hasil_kuis_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `koding_hasil_kuis_kuis_id_fkey` FOREIGN KEY (`kuis_id`) REFERENCES `koding_kuis` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_project` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT NULL,
  `file_url` VARCHAR(512) NULL,
  `link_demo` VARCHAR(512) NULL,
  `link_github` VARCHAR(512) NULL,
  `status` ENUM('pending','diterima','revisi') NOT NULL DEFAULT 'pending',
  `catatan_guru` TEXT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `koding_project_user_id_idx` (`user_id`),
  CONSTRAINT `koding_project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
