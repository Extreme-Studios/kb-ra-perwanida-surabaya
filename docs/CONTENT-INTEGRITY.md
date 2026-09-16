# Editorial contract
- Sumber resmi adalah source of truth; brief pengguna memberi data awal.
- Stable id tidak berubah saat judul berubah. Slug untuk URL disimpan pada route registry.
- status verified berarti field yang terisi didukung sumber, bukan seluruh item lengkap.
- summary null dan body kosong berarti deskripsi belum diimpor. Jangan menghasilkan klaim dari nama program.
- sourceIds wajib untuk record verified.
- updatedAt adalah waktu edit konten yang diketahui, bukan waktu build atau crawl.
- Koleksi kosong adalah belum diimpor; jangan menyatakan sekolah tidak memiliki guru/kegiatan.
- Tanggal, biaya dan status penerimaan selalu pending sampai diperiksa.
- Kontak adalah informasi publik yang terlihat di sumber resmi saat pemeriksaan.
- Foto pada preview adalah placeholder eksplisit. Wordmark teks sementara bukan logo baru.
- Data dapat dipindah ke CMS dengan mengganti ContentRepository; UI tetap memakai SchoolContent.
- Kontrak knowledge dibuat dari record yang juga dipakai halaman. Belum ada provider/backend AI.

