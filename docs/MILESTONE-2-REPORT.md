# Laporan Milestone 2 — KB-RA Perwanida Surabaya

Tanggal audit dan validasi: 15 September 2026.
Project: C:\Users\ROG ALLY\Documents\EXTREME STUDIOS\PROJECT\Web Perwanida

Implementasi homepage dan halaman inti selesai pada cakupan konten yang tersedia. Semua validasi teknis akhir lulus. Acceptance artikel berita real belum terpenuhi karena listing sumber kosong; tidak dibuat artikel pengganti. Tidak ada deployment, splash, chatbot, Gemini, RAG, atau pekerjaan Milestone 3.

## 1. Sumber yang diaudit

Primary source [website resmi KB-RA Perwanida](https://kbraperwanida.sch.id/).

163 URL HTML diperiksa: 161 HTTP 200 dan 2 HTTP 404 (/index.html). Terdapat 43 kelompok response unik menurut status/teks konten. Angka 163 bukan jumlah halaman logis: situs mengganti token terenkripsi pada menu. Perluasan content links dan pagination berakhir dengan antrean kosong.

Cakupan: Home; Tentang Kami; Guru & Tendik; Komite; Kurikulum; lima program unggulan; Program Penunjang; seluruh program sekolah; fasilitas; galeri kategori; Daily Activity; Event; Video halaman 1–10; Kontak; PPDB/SPMB; Informasi PPDB; halaman brosur dan PDF. 37 endpoint jabatan publik diperiksa; hanya fields jabatan/tanggal relevan yang dimigrasikan. 112 tautan video memberi oEmbed 200 saat audit.

Semua 201 referensi (163 HTML, 37 endpoint, 1 PDF) dicatat. Detail: [SOURCE-INVENTORY](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/SOURCE-INVENTORY.md>).

## 2. Konten yang dimigrasikan

| Koleksi | Hasil |
|---|---|
| Profil | Identitas, logo, komitmen, visi, 3 misi, 3 tujuan, 7 butir sejarah dan timeline6 tahun |
| Program | 5 unggulan, kurikulum asli, program penunjang, 14 program sekolah, 2 sentra |
| Ekstrakurikuler | 7 nama dan deskripsi asli lengkap |
| Fasilitas | 13 nama/foto; uraian dipertahankan jika tersedia |
| Guru dan tenaga kependidikan | 37 personel: 30 guru termasuk alumni dan 7 staf; foto, nama/gelar, kategori, jabatan tambahan |
| Komite | 2 orang sebagai arsip2023-2024 |
| Galeri | 4 gambar unik dengan kategori dan source tracking |
| Video | 112 video, 12 per halaman, 10 halaman |
| Testimoni | 2 record disimpan;1 lengkap diterbitkan, 1 terpotong ditahan |
| Kontak |Alamat, telepon, WhatsApp, email, sosial dan directions berbasis alamat |
| SPMB |Tahun 2026-2027, link pendaftaran resmi, brosur, poster/jadwal sebagai arsip |
| Berita | 0 artikel tersedia; listing empty state yang jujur |

Total 209 content records termasuk satu testimoni internal yang ditahan. Data terpusat, bertipe, dan tetap dapat diekstrak ke knowledge documents tanpa provider AI. Statistik sejarah24 TH/204 disimpan pada originalBody; bukan klaim terkini. Riwayat akreditasi RA/KB terpisah.

## 3. Aset yang dimigrasikan

186 gambar asli lokal, 27.15 MB total file sumber, ditambah1 brosur PDF dua halaman.174 file gambar memiliki mapping konten;12 sisanya arsip aset sumber. Manifest menyimpan source URL, nama lokal, dimensi, ukuran byte, SHA-256 dan status duplikasi.

Folder: brand, school, facilities, teachers, programs, gallery, testimonials, video. Tidak ada stock image, gambar AI, logo baru atau hotlink gambar produksi. File dipakai ulang melalui satu path ketika digunakan di beberapa komponen.

Detail: [ASSET-INVENTORY](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/ASSET-INVENTORY.md>).

Skill PDF dipakai untuk merender dan memeriksa kedua halaman brosur. Pemeriksaan visual menemukan perbedaan visi, daftar ekstrakurikuler dan terminologi kurikulum antara brosur dan halaman web; perbedaan dicatat, bukan disatukan berdasarkan asumsi.

## 4. Content gaps

Yang penting: berita kosong; empat program unggulan minim uraian; enam aktivitas tanpa foto khusus; galeri mengaji kosong; testimoni kedua terpotong; komite/periode personel perlu konfirmasi; jadwal SPMB di poster telah berlalu; beberapa fakta brosur berbeda dari halaman utama.

Tidak ada biaya/kuota/deadline baru yang dikarang. Kontak sekolah konsisten; nomor pribadi/ID kepegawaian tidak masuk runtime.

Detail dan tindakan yang diperlukan: [CONTENT-GAPS](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/CONTENT-GAPS.md>).

## 5. Perubahan visual/design system

Dua font self-hosted melalui next/font/local: Nunito Sans untuk heading dan DM Sans untuk body/UI. Emerald, green, ivory, sage, soft gold dipertahankan; peach dan lilac lembut sebagai variasi.

Hero editorial dengan foto asli dan frame lengkung, mosaic program, section aktivitas berbasis disclosure/tap, fasilitas photography-first, portrait konsisten, galeri utuh dan testimonial editorial. Navbar/footer memakai logo resmi. Microinteraction ringan, tanpa scroll hijacking, menghormati reduced motion.

## 6. Homepage yang dibangun

/home memuat12 section:hero, identitas/visi, lima program unggulan, pengalaman sekolah, tujuh ekstrakurikuler, fasilitas, pendidik pilihan, galeri, testimoni lengkap, kanal berita, SPMB, kontak/lokasi. Footer ditingkatkan. Bagian berita menampilkan jalur ke kabar resmi tanpa card fiktif.

## 7. Inner pages yang diselesaikan

Profil overview; Tentang Kami dengan visi/misi/tujuan/sejarah; Guru & Tendik37 personel; Komite arsip; Fasilitas13 item; Program overview; Kurikulum; Program Unggulan overview; kelima detail unggulan dengan isi yang tersedia; Program Penunjang14 program; Ekstrakurikuler; Galeri beserta kategori; listing Berita/Daily Activity/Event; Multimedia/Video; Kontak; SPMB.

Registry 27 route tetap berfungsi. Path tidak dikenal404. Detail artikel berita belum dibuat tanpa artikel sumber. Galeri mengaji empty state. Halaman minim konten tidak diisi lorem ipsum.

## 8. File utama yang berubah

- src/types/content.ts — kontrak konten/media/video/arsip/verifikasi.
- src/data/content/migrated.ts, school.ts, migrated-sources.json, asset-manifest.json, video-availability.json — dataset dan bukti.
- src/data/content/presentation.ts — editorial copy terpisah.
- src/lib/content.ts dan seo.ts — extractor, publikasi testimonial, metadata page-specific.
- src/app/layout.tsx — fonts/logo metadata; halaman home dan catchall — komposisi akhir.
- src/styles/tokens.css dan experience.css — visual family M2.
- src/components/content/home-page.tsx, core-pages.tsx, gallery.tsx, activities.tsx, people.tsx, program-grid.tsx, video-library.tsx, news.tsx, contact-options.tsx, cta.tsx.
- src/components/layout/brand.tsx, navbar.tsx, footer.tsx, page-header.tsx.
- src/components/ui/responsive-image.tsx — optimasi gambar dan batas import client.
- scripts/ — crawler, importer, extractor, pemeriksaan video dan generator inventaris.
- tests/content.test.ts dan tests/browser/experience.spec.ts — regresi konten, interaksi dan screenshot.
- README.md, docs/SOURCE-INVENTORY.md, docs/ASSET-INVENTORY.md, docs/CONTENT-GAPS.md, docs/MILESTONE-2-REPORT.md.
- public/images dan public/documents; package.json/package-lock.json untuk dua font dan alat ekstraksi.

## 9. Validation results

| Perintah/pemeriksaan | Hasil akhir |
|---|---|
| npm run lint |Lulus |
| npm run typecheck |Lulus, strict TypeScript |
| npm test | 7/7 lulus |
| npm run build |Lulus, production build |
| npm run test:e2e | 9/9 lulus, sekitar 1.5 menit |
| Seluruh27 route |HTTP 200, heading/metadata; root redirect;404 path asing |
| Responsivitas | 11 halaman inti ×9 lebar: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920; tanpa horizontal overflow |
| Accessibility otomatis |Axe WCAG2A/AA/2.1AA, 11 halaman inti pada 390/1440; tidak ada violations; menu dan lightbox juga diaudit |
| Keyboard |Skip link, menu desktop/mobile, Escape, focus containment/return, galeri prev/next |
| Konten/fungsi | 37 personel, 7 deskripsi aktivitas tidak kosong, video halaman 10/404 batas, news empty/404 detail asing, PDF200, CTA kontak/pendaftaran |
| Gambar dan internal link |Gambar main yang terlihat/lazy-scrolled berhasil dimuat; tujuan link internal halaman inti mengarah ke registry/dokumen |
| Console |Tidak ada pageerror/console error pada pemeriksaan halaman inti; browser manual logs kosong |
| SEO |Title/description unik pada halaman yang dibandingkan;canonical path, OG foto aktif saat SITE_URL ditetapkan;preview noindex |
| Screenshot | 7 full-page final dengan lazy images sudah dimuat;ditinjau visual |

Pengujian menemukan timeout30 detik pada tes gabungan; batasnya dinaikkan sesuai beban audit. Review screenshot menemukan selector deskripsi ekstrakurikuler salah (.text versus p); extractor dibetulkan dan tes kini menolak paragraf kosong. Foto Program terlalu tinggi juga telah dibatasi. Semua hasil tabel adalah setelah koreksi tersebut.

Batas bukti: automated accessibility tidak menggantikan audit manusia lengkap/screen reader. Pengujian pada Chrome/Chromium Windows, bukan Safari/iOS fisik. Tidak ada klaim skor Lighthouse atau Core Web Vitals produksi.

## 10. Screenshot final

Lokasi asli project: test-results/milestone-2. Salinan serah-terima pada folder laporan ini.

### Homepage desktop1440px

![Homepage desktop](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/home-desktop.png>)

### Homepage mobile390px

![Homepage mobile](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/home-mobile.png>)

### About

![About](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/about.png>)

### Program

![Program](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/program.png>)

### Guru & Tendik

![Guru dan Tendik](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/guru-tendik.png>)

### Gallery

![Gallery](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/gallery.png>)

### SPMB

![SPMB](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-2/spmb.png>)

## 11. Technical debt

- Konfirmasi konten sekolah pada CONTENT-GAPS sebelum publikasi; terutama statusSPMB, periode personel dan konflik brosur.
- Berita listing siap menerima data, tetapi renderer/routing detail artikel real masih perlu dibuat setelah sumber tersedia.
- Crawl/extractor bergantung snapshot/selector situs lama dan token berubah; audit berikutnya perlu review manual. Snapshot work/source tidak termasuk runtime.
- Beberapa CSS/komponen dasar M1 tetap disimpan untuk kompatibilitas; tidak dilakukan refactor luas.
- SITE_URL, OG absolut, canonical host, indexing serta validasi deployment menunggu hostname dan izin publikasi.
- Foto resolusi kecil mengikuti kualitas asli. Lakukan pengujian perangkat/Safari dan performance produksi sebelum go-live.
- Availability112 video adalah snapshot oEmbed, bukan jaminan video selalu dapat diputar.
- Tidak ada CMS/backend/form submission baru; konten masih local repository.
- Project tidak diinisialisasi sebagai Git repository pada pekerjaan ini; tidak dibuat commit atau perubahan remote.

## 12. Yang siap untuk Milestone 3

Homepage /home, shared shell persisten, registry 27 route, design tokens, komponen responsif, koleksi konten source-tracked, extractor knowledge murni serta future concierge slot tetap tersedia. Root masih redirect; slot belum dirender sebagai UI palsu.

Tidak ada kode entrance/Gemini/chatbot/RAG/vector database/embeddings, deployment atau integrasi berbayar yang dibuat. Berhenti pada laporan Milestone 2; Milestone 3 belum dimulai.
