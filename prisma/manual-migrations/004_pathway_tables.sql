-- Fitur Pathway: bahan ajar per pertemuan (LKS, PPT, materi) sebagai acuan
-- utama belajar siswa. Murni tabel baru, additive, tidak menyentuh tabel lain.

CREATE TABLE IF NOT EXISTS `koding_pertemuan` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `judul` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT NULL,
  `urutan` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `koding_bahan_ajar` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pertemuan_id` INT NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `tipe` ENUM('lks','ppt','materi','lainnya') NOT NULL,
  `file_url` VARCHAR(512) NOT NULL,
  `urutan` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `koding_bahan_ajar_pertemuan_id_idx` (`pertemuan_id`),
  CONSTRAINT `koding_bahan_ajar_pertemuan_id_fkey` FOREIGN KEY (`pertemuan_id`) REFERENCES `koding_pertemuan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
