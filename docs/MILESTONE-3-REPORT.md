# Laporan Milestone 3 — Interactive Entrance

Project: C:\Users\ROG ALLY\Documents\EXTREME STUDIOS\PROJECT\Web Perwanida
Validasi: 15 September 2026.

Milestone ini hanya menambahkan entrance pada root. Homepage, halaman dalam, dataset sekolah, navbar, footer, galeri dan concierge slot Milestone 2 tidak didesain ulang. Tidak ada deployment atau integrasi AI.

## 1. Konsep entrance

Gerbang sekolah interaktif berbasis fotografi asli halaman Perwanida. Dua panel emerald dekoratif menjadi gerbang visual di foreground, dengan detail soft gold, frame lengkung sage, dedaunan CSS sederhana dan logo asli.

Panel ini merupakan elemen presentasi interaktif, bukan rekonstruksi atau klaim bentuk gerbang fisik sekolah. Foto halaman dipilih setelah meninjau aset halaman dan pos keamanan. Tidak ada bangunan fiktif, stock image, raster AI atau foto baru.

## 2. Aset resmi yang dipakai

| Aset | File lokal project | Resolusi sumber | Pemakaian |
|---|---|---|---|
| Logo resmi | public/images/brand/logo-kb-ra-29f14c74.jpg | 1071 × 1071 | Identitas header |
| Halaman Sekolah | public/images/facilities/20230919103332-6509168c756f0-halaman-0ed185c9.jpg | 1000 × 750 | Scene utama |

Referensi asli: [logo](https://kbraperwanida.sch.id/assets/images/logo-kb-ra.jpeg), [foto halaman](https://kbraperwanida.sch.id/files/item_fasilitas/20230919103332-6509168c756f0-Halaman.jpg).

Kedua file sudah tersedia dari migrasi Milestone 2 dan tidak diubah. Next/Image menyajikan ukuran responsif dari file lokal. Foto scene diprioritaskan; background sage tetap terlihat jika gambar belum selesai dimuat. Aksi masuk tidak menunggu gambar.

Salinan manifest dua aset tersedia sebagai entrance-assets.json di folder laporan.

## 3. Perubahan route

- / sekarang merender Entrance sebagai halaman statis dengan metadata dan heading semantik, bukan redirect.
- /home tetap main website, bisa diakses langsung.
- Inner pages dan refresh tetap berfungsi.
- Aksi utama memakai router.push('/home'), sehingga Back kembali ke / secara normal.
- Tidak ada session flag, cookie, localStorage, history replacement atau redirect loop.
- Link navigasi main website tetap menuju halaman main; tidak memaksa entrance berulang.
- Sitemap menyertakan root bila SITE_URL dan indexing diaktifkan nanti. Konfigurasi preview noindex tetap dipertahankan.

## 4. Interaksi yang tersedia

Tombol “Masuk ke Perwanida” menyatu dengan gerbang. Mendukung klik, tap, Enter dan Space melalui button/form semantik. Klik berulang selama transisi diabaikan.

Empat hotspot membuka mini-card terlebih dahulu, kemudian CTA “Lihat lebih lanjut” menuju halaman terkait:

| Hotspot | Asal informasi | Tujuan |
|---|---|---|
| Program | Nama lima program unggulan existing | /program |
| Fasilitas | Deskripsi Halaman Sekolah existing | /profil/fasilitas |
| Galeri | Metadata empat dokumentasi asli | /galeri |
| SPMB | Tahun ajaran dan verificationNote existing | /spmb |

Ringkasan diturunkan oleh getEntranceData dari SchoolContent, bukan fakta yang disalin ulang ke komponen. Source IDs tetap dibawa. SPMB tidak mengklaim pendaftaran masih dibuka.

Link “Langsung ke website” selalu tersedia untuk melewati transisi.

## 5. Adaptasi mobile

Pada 390 × 844, seluruh komposisi satu layar: logo, copy ringkas, scene, CTA, empat hotspot dalam grid dua kolom dan visi. Hotspot dipindah ke bawah foto agar tidak bertumpuk di dalam scene sempit.

CTA tetap above the fold dan tinggi minimal 52px. Hotspot minimal 44px. Foto halaman tidak memiliki wajah penting yang terpotong. Header dan tipografi disederhanakan, bukan sekadar desktop yang dikecilkan.

Pada viewport sangat pendek seperti landscape 844 × 390 atau zoom besar, tinggi konten dapat melebihi layar dan scrolling vertikal diizinkan. Aksesibilitas tidak dikorbankan untuk memaksa satu layar. Tidak ada horizontal overflow pada ukuran yang diuji.

## 6. Accessibility

- Main landmark, satu h1, identitas dan deskripsi faktual tersedia dalam HTML awal.
- Button/form native untuk keyboard dan fallback no-JS.
- Link /home nyata tetap tersedia; noscript menambahkan link berlabel “Masuk ke Perwanida”.
- Hotspot mempunyai aria-label, aria-haspopup, aria-controls dan aria-expanded.
- Dialog native dengan backdrop inert, Escape, tombol tutup, focus containment eksplisit dan focus return ke hotspot.
- Focus ring existing dipertahankan.
- Status masuk diumumkan melalui region status yang tersembunyi secara visual.
- Kontras diuji dengan Axe; gambar memiliki alt dari data existing.
- Pengguna tidak diwajibkan hover, audio, motion, sensor atau izin perangkat.

Uji awal menemukan Tab bisa keluar dari mini-card. Pembatasan fokus eksplisit ditambahkan dan tes pengulangan lulus.

## 7. Motion dan reduced motion

Normal: panel membuka, foto maju sedikit (scale 1.06), lalu fade. Navigasi dijadwalkan 700ms setelah aktivasi. /home diprefetch untuk membantu perpindahan.

Reduced motion: parallax dan transform panel/foto dimatikan. Fade singkat sekitar 100ms; navigasi dijadwalkan pada 120ms.

Parallax hanya merespons mouse dengan fine pointer dan no-preference, maksimal sekitar ±4px horizontal/±2.5px vertikal. Tidak ada gyroscope, request sensor, interval animasi atau animasi ambient terus-menerus.

Waktu 700/120ms merupakan durasi yang dikonfigurasi sebelum navigasi. Waktu tampil halaman tujuan tetap bergantung pada cache, perangkat dan jaringan; tidak diklaim sebagai SLA jaringan.

Tidak ada audio, autoplay video, canvas, Three.js, GSAP, analytics, chatbot, Gemini, RAG, vector database atau embeddings.

## 8. Files changed

File baru:

- src/components/entrance/entrance.tsx — interaksi, form fallback, dialog dan routing.
- src/components/entrance/entrance.css — CSS scoped hanya untuk entrance.
- src/data/content/entrance.ts — editorial copy, timing dan projection konten.
- tests/browser/entrance.spec.ts — tujuh E2E entrance.
- docs/MILESTONE-3-REPORT.md — laporan ini.

File existing yang diubah:

- src/app/page.tsx — root entrance dan metadata.
- src/app/sitemap.ts — root ditambahkan saat indexable.
- tests/browser/foundation.spec.ts — ekspektasi root dari redirect menjadi entrance.
- tests/content.test.ts — satu tes integritas projection entrance.
- README.md — flow Milestone 3 dan petunjuk pemeliharaan.

Helper packaging berada di work/deliver-milestone-3.mjs, bukan runtime. package.json dan lockfile tidak berubah; dependency tambahan: nol. Seluruh file sumber homepage/inner pages, data migrasi dan aset M2 tidak diubah pada milestone ini.

## 9. Hasil test/build

| Pemeriksaan | Hasil akhir |
|---|---|
| npm run lint | Lulus |
| npm run typecheck | Lulus |
| npm test | 8/8 lulus |
| npm run build | Lulus, root statis |
| npm run test:e2e | 16/16 lulus |
| Root / dan metadata | HTTP200, title KB-RA Perwanida Surabaya, heading dan konten tersedia |
| Klik/tap/Enter/Space | Lulus; native form/link no-JS juga lulus |
| Browser Back dan masuk ulang | Kembali ke / dengan gerbang siap digunakan |
| Hotspot | Empat mini-card, focus trap/return, Escape, CTA kontekstual lulus |
| Reduced motion | Transform mati, timing singkat, navigasi lulus |
| Responsive entrance | 320×640,375×812,390×844,430×932,768×1024,1024×768,1280×800,1440×900,1920×1080,844×390 |
| CTA above fold | Lulus pada viewport portrait/desktop yang diuji dengan tinggi minimal640 |
| Accessibility otomatis | Axe WCAG2A/AA/2.1AA pada root390/1440 serta setiap dialog: tanpa violations |
| Console dan gambar | Tidak ada error pada pemeriksaan entrance; logo/foto termuat |
| Regresi Milestone 2 | Seluruh27 route,11 halaman inti ×9 lebar,galeri,37 personel,7 aktivitas,video,SPMB,kontak,navigasi dan404 lulus |

Skill Browser dipakai untuk review visual nyata desktop, mobile dan reaksi gerbang saat masuk. Screenshot hasil browser juga diperiksa manual. Pengujian otomatis tidak menggantikan audit screen reader/perangkat fisik lengkap.

## 10. Screenshot paths

Asli: test-results/milestone-3. Salinan serah-terima: folder laporan ini.

### Desktop 1440 × 900

![Entrance desktop](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-3/desktop.png>)

### Mobile 390 × 844

![Entrance mobile](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-3/mobile.png>)

### Hotspot SPMB terbuka — desktop

![Hotspot desktop](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-3/hotspot-desktop.png>)

### Reduced motion — desktop

![Reduced motion](<C:/Users/ROG ALLY/Documents/Codex/2026-09-15/aku/outputs/perwanida-milestone-3/reduced-motion.png>)

Screenshot diam reduced motion memang menyerupai tampilan normal. Perbedaannya pada perilaku transform/timing, yang diuji terpisah.

## 11. Technical debt

- Foto asli halaman terbatas1000×750. Kualitas pada layar sangat besar mengikuti sumber; tidak dilakukan AI upscale.
- Gerbang visual dekoratif; bila ingin bentuk gerbang fisik yang presisi, sekolah perlu menyediakan foto gerbang yang sesuai.
- Browser/device testing menggunakan Chrome/Chromium Windows dan emulasi mobile, belum perangkat Safari/iOS fisik.
- Belum ada pengukuran Lighthouse/Core Web Vitals produksi. Tidak ada klaim skor performa.
- Ketersediaan /home saat jaringan lambat tetap memengaruhi perpindahan. Link langsung tetap terlihat dan form/link native berfungsi tanpa JS.
- Content gaps Milestone 2 tetap berlaku, termasuk artikel berita, beberapa detail program dan status SPMB. Milestone 3 tidak memperbarui fakta tersebut.
- Hostname produksi, indexing dan deployment tetap menunggu persetujuan terpisah.

## 12. Siap untuk Milestone 4

Entrance sudah terpisah dari shell main, route /home stabil, dataset sumber dan extractor knowledge tetap utuh, serta future concierge slot masih kosong. Semua fondasi tersebut tersedia untuk scope milestone berikutnya setelah diminta.

Milestone 4 belum dimulai. Tidak ada integrasi Gemini/chatbot/provider AI atau deployment dalam pekerjaan ini.

