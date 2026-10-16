// Mapping role_id_simadu (tabel `user_role`, app='simadu') ke akses app koding.
// Administrator + semua GTK bisa login otomatis sebagai "guru" di app ini,
// tanpa perlu baris apapun di koding_user_access.
export const GTK_ADMIN_ROLE_IDS = [
  11, // Administrator
  12, // Kepala Madrasah
  13, // Tatausaha
  14, // TU Administrasi
  15, // Waka Kurikulum
  16, // Waka Kesiswaan
  17, // Waka Humas
  18, // Waka Sarpras
  19, // Guru BK
  20, // Wali Kelas
  21, // Guru
];

// Siswa perlu dipilih dulu oleh admin (lihat koding_user_access) baru bisa login.
export const SISWA_ROLE_ID = 23;
