-- Melacak bahan ajar Pathway yang sudah dibuka/dilihat siswa, untuk halaman
-- "Progress Siswa". Murni tabel baru, additive.

CREATE TABLE IF NOT EXISTS `koding_pathway_view` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `bahan_id` INT NOT NULL,
  `viewed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `koding_pathway_view_user_id_bahan_id_key` (`user_id`, `bahan_id`),
  KEY `koding_pathway_view_bahan_id_idx` (`bahan_id`),
  CONSTRAINT `koding_pathway_view_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `koding_pathway_view_bahan_id_fkey` FOREIGN KEY (`bahan_id`) REFERENCES `koding_bahan_ajar` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
