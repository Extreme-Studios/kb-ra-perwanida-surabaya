# Performance Review — Milestone 5

Tanggal: 15 September 2026. Review dilakukan pada production build lokal.

## Temuan

- Konten halaman inti tetap server-rendered; client boundary terbatas pada entrance, navigation, gallery dialog, dan concierge.
- Concierge tidak mengirim request AI/prefetch ke endpoint sebelum pengguna mengirim pertanyaan.
- Foto memakai `next/image` dengan width/height/sizes. Hero homepage dan entrance adalah satu-satunya gambar above-the-fold yang diberi `priority`; koleksi guru, galeri dan video tidak eager secara global.
- Nunito Sans dan DM Sans self-hosted menggunakan `next/font/local` dengan `display: swap` dan hanya satu variable font tiap keluarga.
- Production build berhasil tanpa warning aplikasi dan route statis/dinamis sesuai kebutuhan: `/api/concierge` tetap runtime Node, bukan static export.

## Lighthouse / Web Vitals

CLI Lighthouse tidak tersedia di workspace ini dan tidak diinstal hanya untuk menghasilkan angka. Karena itu tidak ada skor Lighthouse, LCP/FCP/INP/TBT atau CLS yang diklaim. Sebagai pengganti yang benar-benar dijalankan: responsive, Axe, keyboard/dialog, asset completion, image dimensions, production build, dan browser E2E pada root, home, about, program, guru, gallery, SPMB, contact, 404 dan concierge.

## Rekomendasi produksi

Jalankan Lighthouse di URL deployment final setelah domain/CDN dan cache hosting aktif, minimal untuk `/`, `/home`, `/profil/tentang-kami`, `/program`, `/profil/guru-tendik`, `/galeri`, dan `/spmb`; ukur mobile+desktop untuk root/home. Tinjau real-user Web Vitals hanya bila analytics yang sesuai kebijakan sekolah disetujui.

## Tidak dilakukan

Tidak ada redesign, penggantian font, AI-upscale, lazy loading yang mengubah UX, bundle refactor besar, atau dependensi performa baru.
