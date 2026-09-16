# Content gaps — Milestone 2

Audit: 15 September 2026. Semua gap dibiarkan eksplisit; tidak diganti asumsi.

| Gap | Bukti sumber | Penanganan pada website / data | Perlu dari sekolah |
|---|---|---|---|
| Berita real dan detail artikel | Home, Daily Activity, Event memiliki listing kosong; tidak ditemukan URL artikel | /berita dan kategori menampilkan empty state + kanal resmi. Tidak ada fake card, tanggal, atau detail fiktif | Artikel asli, judul, tanggal, teks dan foto |
| Detail empat program unggulan | Character Building, Cinta Budaya Indonesia, Gerakan Literasi, Green School berisi judul dan tanda “-” | body kosong, halaman berisi nama dan CTA informasi; tidak mengklaim penjelasan tersedia | Deskripsi program yang disahkan |
| Mengaji UMMI | Sumber hanya memberi deskripsi singkat kerja sama dengan Ummi Foundation | Hanya isi yang tersedia diterbitkan | Detail kegiatan/metode bila ingin memperluas |
| Foto enam ekstrakurikuler | Futsal memiliki foto; Menyanyi, Menari, Melukis, Rebana, Wushu, Drumband tidak memiliki foto khusus yang dapat dipetakan | Seluruh tujuh deskripsi asli tersedia, enam aktivitas text-first tanpa gambar pengganti | Dokumentasi berlabel aktivitas |
| Galeri mengaji | Tidak ada foto kategori tersendiri di halaman yang dapat diakses | Empty state, bukan stock photography | Foto asli beserta konteks |
| Detail fasilitas | 13 nama + foto tersedia, beberapa hanya deskripsi “-” | Nama/foto tetap muncul tanpa uraian fiktif | Deskripsi fasilitas yang belum terisi |
| Program sekolah | 14 nama tersedia, sebagian tidak mempunyai uraian | Daftar nama asli, tanpa jadwal jam buatan | Penjelasan tambahan bila diperlukan |
| Testimoni Papa Novan & Mama Nia | Teks HTML asli sudah terpotong pada “KB-RA Perwanida Su”; tidak ditemukan lanjutan | Disimpan internal complete:false/status pending, tidak ditampilkan atau masuk knowledge | Teks lengkap dan konfirmasi publikasi |
| Testimoni Papa Ditto & Mama Winda | Paragraf lengkap dipublikasikan pada homepage sumber | Diterbitkan dengan publicationBasis:official-public-source; consentConfirmed tidak diklaim | Sekolah dapat mengonfirmasi persetujuan publikasi ulang |
| Status SPMB terkini | Heading tahun 2026-2027; poster: Inden 05–30 November 2025, Reguler 05 Januari 2026 | needsVerification; poster/jadwal di bagian arsip, opensAt/closesAt null, CTA konfirmasi sekolah | Penerimaan aktif, kuota, biaya, deadline dan syarat terkini |
| Klaim diskon poster | Poster menyebut promosi tetapi ketentuan dan keberlakuan sekarang tidak jelas | Tidak diangkat menjadi klaim CTA; PDF/poster asli tetap arsip | Ketentuan jika masih berlaku |
| Sejarah “24 TH” dan “sekarang 204 siswa” | Halaman About tidak memberi tanggal rujukan untuk statistik ini | originalBody utuh; display menghapus usia basi dan jumlah “terkini”; foundingYear1999 | Jumlah murid yang telah diperbarui dan tanggal datanya |
| Riwayat akreditasi | RA A2008/A2019, KB A2024 pada teks sejarah | Ditampilkan sebagai riwayat terpisah, bukan badge akreditasi aktif gabungan | Sertifikat/status aktif bila ingin membuat klaim masa kini |
| Susunan personel | 37 personel tersedia, termasuk Guru Alumni; periode aktif tidak dijelaskan | Kategori asli lengkap; kebutuhan verifikasi tahun ajaran ditandai | Susunan dan jabatan tahun berjalan |
| Komite periode terbaru | Dua orang pada 2023-2024; heading2024-2025 dan 2025-2026 tidak berisi personel | Arsip2023-2024, tidak diganti label periode terkini | Pengurus komite tahun berjalan |
| Perbedaan visi brosur | Brosur: “Menjadi Generasi Islam yang Cerdas, Kreatif dan Berakhlak Mulia”; About: “Terwujudnya Generasi Islam yang Berilmu, Beramal dan Berakhlaq Mulia.” | Visi About yang juga diwajibkan brief dipertahankan. PDF asli tersedia, tidak ditimpa | Versi resmi yang berlaku |
| Perbedaan ekstrakurikuler brosur | Brosur menyebut Musik dan Angklung; daftar web memiliki Menyanyi dan tujuh aktivitas | Daftar tujuh pada web dipertahankan; tidak digabung spekulatif | Daftar aktif terkini |
| Perbedaan terminologi brosur | Brosur menulis BBCT; halaman Kurikulum menulis BCCT / Beyond Center and Circle Time | Terminologi halaman Kurikulum dipertahankan | Koreksi resmi brosur |
| Program/jadwal brosur | Brosur menambah Renang, menggabungkan tes; memuat jam KB/RA | Dokumen asli arsip, bukan jadwal jam pada homepage | Konfirmasi jadwal/program tahun berjalan |
| Tanggal publikasi konten | Banyak halaman tidak menampilkan tanggal update | updatedAt:null; accessedAt dipisahkan. Endpoint jabatan memakai updated_at asli | Tanggal konten jika perlu |
| Kualitas foto | Aset asli bervariasi, beberapa portrait kecil | Tidak di-stretch/AI-upscale; portrait contain, Next/Image responsif | File resolusi tinggi bila tersedia |
| Link sumber rusak | Dua response /index.html menghasilkan404 pada snapshot | Tidak diteruskan sebagai link baru | Perbaikan pada situs lama di luar scope |
| Video eksternal | 112 URL YouTube memberi oEmbed 200 saat audit | Tautan eksternal + thumbnail lokal, pagination12, tanpa autoplay | Periksa ulang sebelum publikasi karena status bisa berubah |
| Canonical/OG produksi | Hostname redesign belum ditetapkan | SITE_URL kosong; canonical path tersedia; noindex default. OG foto lokal aktif setelah SITE_URL dikonfigurasi | Hostname dan persetujuan publikasi |

## Batas data pribadi

Endpoint jabatan publik juga mengandung nomor pribadi dan ID kepegawaian. Keduanya sengaja tidak diimpor ke runtime/knowledge. Nomor sekolah utama dan WhatsApp sekolah cocok antara website dan poster; tidak ditemukan konflik nomor utama. Alamat “Kota SBY” dinormalisasi penulisan menjadi “Surabaya”; lokasi geografis tidak ditebak.

## Arti status

verified berarti cocok dengan sumber saat audit, bukan jaminan informasi masih berlaku sekarang. needsVerification mempertahankan konteks data lama atau terbatas. Record pending tidak masuk extractor. SOURCE-INVENTORY.md menyimpan URL lengkap; ASSET-INVENTORY.md menyimpan mapping setiap file.

## Acceptance yang memang tertahan sumber

Poin “news listing/detail menggunakan real content” belum dapat dipenuhi sebagai artikel terisi karena tidak ada artikel real yang tersedia. Infrastruktur listing dan empty state sudah berjalan; detail artikel belum diimplementasikan tanpa dataset sumber. Ini gap konten, bukan klaim bahwa artikel telah selesai.
