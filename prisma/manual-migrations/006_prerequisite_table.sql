-- Fitur Prerequisite: daftar tools persiapan environment koding (VS Code,
-- XAMPP, dst) dengan link download, deskripsi, dan video tutorial instalasi.
-- Murni tabel baru, additive.

CREATE TABLE IF NOT EXISTS `koding_prerequisite` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT NULL,
  `download_url` VARCHAR(512) NULL,
  `video_url` VARCHAR(512) NULL,
  `urutan` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
