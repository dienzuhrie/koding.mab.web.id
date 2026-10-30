-- Fitur Target Belajar: daftar target/tujuan belajar per pertemuan yang diatur
-- guru/admin dan ditampilkan di halaman Pathway Belajar siswa.
-- Murni tabel baru, additive. Terhapus otomatis bila pertemuannya dihapus.

CREATE TABLE IF NOT EXISTS `koding_target_belajar` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pertemuan_id` INT NOT NULL,
  `teks` VARCHAR(500) NOT NULL,
  `urutan` INT NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `koding_target_belajar_pertemuan_id_idx` (`pertemuan_id`),
  CONSTRAINT `koding_target_belajar_pertemuan_fk`
    FOREIGN KEY (`pertemuan_id`) REFERENCES `koding_pertemuan` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
