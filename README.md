# Web Perwanida — Milestone 4

Redesign website KB-RA Perwanida Surabaya. Root / adalah entrance gerbang interaktif; /home dan halaman inti dipertahankan. Sahabat Perwanida adalah concierge Gemini server-side yang hanya ada pada shell website utama; tidak ada deployment baru.

## Menjalankan

Node.js >=20.9; lingkungan validasi Node24.21.0. Gunakan lockfile.

```powershell
npm ci
npm run dev
```

Buka http://localhost:3000 untuk entrance. Akses langsung /home tetap tersedia tanpa melewati entrance. Untuk jawaban Gemini, isi `GEMINI_API_KEY` di environment server; tanpa key panel tetap memberi fallback aman.

## Validasi

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

E2E memakai Google Chrome lokal, production server pada 3215. Sebelum rebuild, hentikan server project lama supaya tes tidak memakai build sebelumnya. playwright.config.ts dapat disesuaikan jika Chrome tidak tersedia. Screenshot final di test-results/milestone-2; trace/report diabaikan Git.

## Arsitektur

- src/config/routes.ts: registry 27 route dan hierarki navigasi.
- src/app/(website)/layout.tsx: shell persisten dan mounting Sahabat Perwanida.
- src/app/(website)/home/page.tsx: homepage12 section.
- src/app/(website)/[...slug]/page.tsx: halaman terdaftar, query pagination video; path tidak dikenal404.
- src/components/content/home-page.tsx dan core-pages.tsx: komposisi halaman server-rendered.
- src/components/content/gallery.tsx: lightbox native dialog, keyboard, fokus, scroll lock.
- src/components/layout/navigation.tsx: navigasi desktop/mobile.
- src/styles/tokens.css dan experience.css: token M1 + visual M2.
- src/types/content.ts: kontrak typed; src/lib/content.ts: repository + extractor knowledge murni.
- src/lib/knowledge/retrieve.ts dan src/lib/ai: retrieval lokal, provider Gemini server-side, fallback, prompt guard, dan rate limit.
- src/app/api/concierge/route.ts: API concierge `POST` no-store dengan payload aman.
- src/data/content/migrated.ts: dataset hasil ekstraksi; school.ts: adapter typed.
- presentation.ts: microcopy editorial terpisah dari fakta.
- migrated-sources.json, asset-manifest.json, video-availability.json: bukti sumber, file dan pemeriksaan video.
- public/images: 186 file gambar asli; public/documents: brosur PDF resmi.
- tests/content.test.ts dan tests/browser: integritas data, routes, a11y, interaksi, responsivitas.

## Design system

Emerald, Perwanida green, ivory, sage dan soft gold dipertahankan; tambahan peach/lilac lembut. Dua keluarga font self-hosted melalui next/font/local: Nunito Sans (heading), DM Sans (body/UI). Tidak ada request Google Fonts.

Foto asli menjadi elemen utama. Portrait guru contain untuk menjaga wajah; poster/prestasi tidak di-crop; hero diberi crop terarah. Next/Image, ukuran responsif, lazy loading below-fold. Tidak ada masonry library, heavy animation, scroll hijacking atau iframe autoplay.

## Data dan audit

Audit resmi tanggal15September2026: 163 URL HTML (161HTTP200), 43 kelompok response unik, 37 endpoint jabatan, 112 video oEmbed 200. Jumlah URL bukan jumlah halaman logis karena token menu lama berubah.

Migrasi: 37 personel, 2 komite, 13 fasilitas, 7 ekstrakurikuler, 5 program unggulan, 14 program sekolah, 2 sentra, 4 galeri unik, 112 video, 2 testimoni (hanya1 lengkap diterbitkan), visi/misi/tujuan/sejarah/kontak/SPMB.

verified berarti sesuai sumber, bukan otomatis masih terkini. needsVerification menandai periode tidak pasti. updatedAt tidak diisi tanggal crawl. originalBody mempertahankan sejarah lama; statistik 24 TH/204 tidak diklaim terkini.

Testimoni lengkap yang telah diterbitkan sumber memakai publicationBasis:official-public-source tanpa mengklaim consent baru. Testimoni terpotong tidak dipublikasikan/masuk extractor. Nomor pribadi dan ID kepegawaian dari endpoint jabatan tidak masuk runtime.

Lihat docs/SOURCE-INVENTORY.md, docs/ASSET-INVENTORY.md dan docs/CONTENT-GAPS.md. Dokumen AUDIT.md/VALIDATION.md lama merupakan arsip M1; laporan M2 terpisah.

## Scripts migrasi

Scripts di scripts/ adalah perangkat audit manual, bukan build step. migrate-content.mjs memakai snapshot work/source (diabaikan Git). Runtime/test tidak tergantung snapshot. Crawl berikutnya perlu audit selector dan URL terenkripsi; jangan menjalankan ulang tanpa meninjau hasil/diff. write-inventories.ts menghasilkan tabel dokumentasi dari snapshot dan data.

## SEO dan batas publikasi

SITE_URL diisi setelah hostname redesign disepakati. Canonical path ada, OG foto asli memakai URL absolut setelah konfigurasi tersebut. SITE_INDEXABLE=false default; noindex/robots disallow/sitemap kosong dipertahankan sampai publikasi disetujui.

Berita sumber kosong: listing menampilkan empty state, tidak ada detail artikel fiktif. Galeri mengaji juga terbatas. SPMB 2026-2027 ditampilkan dengan konfirmasi status; poster jadwal lama tersedia sebagai arsip. Lihat content gaps sebelum publikasi.

## Concierge Milestone 4

Sahabat Perwanida menjawab hanya dari knowledge publik yang diproyeksikan dari dataset website. Kueri tanpa data, biaya, atau di luar topik sekolah tidak dihalusinasikan; pengguna diarahkan ke admin resmi. SPMB selalu menyertakan catatan verifikasi ketika dokumen terkait dipakai. History disimpan hanya di `sessionStorage` tab yang sama.

Konfigurasi server:

```powershell
$env:GEMINI_API_KEY='isi-key-di-runtime-saja'
$env:GEMINI_MODEL='gemini-2.5-flash' # opsional
```

Lihat `docs/MILESTONE-4-REPORT.md` untuk arsitektur, guardrail, batas, dan bukti validasi.

## Siap untuk milestone berikutnya

Entrance tetap terpisah dari shell utama. Route /home, route registry, konten knowledge-ready dengan sumber/ketidakpastian, reusable components, dan concierge Gemini server-side siap untuk konfigurasi key di runtime.

## Entrance Milestone 3

- src/app/page.tsx: root berisi metadata dan server-side content projection, bukan redirect.
- src/data/content/entrance.ts: microcopy, timing, dan empat hotspot yang mengambil data sekolah existing.
- src/components/entrance/entrance.tsx dan entrance.css: satu client component, CSS scoped, foto halaman asli dan dua panel dekoratif.
- src/app/sitemap.ts: menyertakan root jika indexing nanti disetujui.
- tests/browser/entrance.spec.ts: root, klik/tap/keyboard, Back, hotspot, reduced motion, no-JS dan screenshot.

Normal: gate opening + zoom/fade 700ms sebelum router.push('/home'). Reduced motion: tanpa parallax/gate transform, fade singkat dan navigasi 120ms. Prefetch /home membantu respons; kondisi jaringan tetap memengaruhi waktu navigasi nyata.

Native form action /home dan link nyata menjaga akses tanpa JavaScript. Tidak ada flag penyimpanan, tracking, audio, video autoplay, sensor, canvas atau dependency animasi baru. Pada viewport sangat pendek/zoom besar, scrolling vertikal diizinkan supaya akses tidak terpotong.

Laporan Milestone 3: docs/MILESTONE-3-REPORT.md. Screenshot: test-results/milestone-3. Laporan dan data gap Milestone 2 tetap berlaku.
