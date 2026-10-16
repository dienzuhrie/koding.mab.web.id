-- Menjadikan akun kamu (sukafisika@gmail.com, user.id = 2 di tabel `user`)
-- sebagai guru pertama di app koding, supaya ada akun yang bisa login dan
-- mengelola materi/kuis sejak awal. Aman dijalankan berulang (upsert).

INSERT INTO `koding_user_access` (`user_id`, `role`, `status`)
VALUES (2, 'guru', 'active')
ON DUPLICATE KEY UPDATE `role` = VALUES(`role`), `status` = VALUES(`status`);
