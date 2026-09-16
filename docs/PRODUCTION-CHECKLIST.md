# Production Checklist

Gunakan saat target hosting dan domain sudah disetujui. Milestone 5 tidak melakukan deployment.

## Domain dan environment

- [ ] Domain final dikonfigurasi dan HTTPS aktif.
- [ ] `GEMINI_API_KEY` diisi hanya pada secret store hosting.
- [ ] `GEMINI_MODEL` dikonfirmasi (default `gemini-2.5-flash`).
- [ ] `SITE_URL` memakai URL HTTPS final tanpa path internal.
- [ ] `ALLOW_INDEXING=true` hanya untuk public production; preview/staging tetap `false`.
- [ ] `SITE_INDEXABLE` legacy tidak dipakai untuk environment baru.

## Content

- [ ] Status SPMB, jadwal, kuota, biaya, dan tautan formulir dikonfirmasi sekolah.
- [ ] Personel dan komite dikonfirmasi untuk tahun ajaran berjalan.
- [ ] Kontak, WhatsApp, Maps, sosial, PDF/brosur dan link eksternal diperiksa lagi.
- [ ] Known gaps (berita kosong, deskripsi program terbatas, arsip) diterima pemilik konten.

## Security dan AI

- [ ] Header keamanan diverifikasi di hostname production.
- [ ] API concierge memakai same-origin dan limiter platform/distributed bila multi-instance.
- [ ] Live Gemini smoke test dijalankan di hosting production.
- [ ] Biaya tidak dihalusinasikan; SPMB tetap meminta konfirmasi; prompt injection ditolak.
- [ ] Tidak ada secret di source, build artifact, atau log.

## SEO dan QA

- [ ] Canonical, robots, sitemap dan OG diperiksa setelah `SITE_URL` aktif.
- [ ] Lighthouse production direkam untuk root/home mobile+desktop.
- [ ] Mobile, desktop, 404, entrance, menu, gallery, chatbot, Back dan refresh diuji.
- [ ] Build command: `npm run build`; start command: `npm run start`.

## Release operasi

- [ ] Source/backup release tersedia (project ini belum Git repository).
- [ ] Node.js 20+ tersedia pada hosting.
- [ ] Hosting mendukung Next.js server runtime dan image optimization; jangan static export karena `/api/concierge` memerlukan server runtime.
- [ ] Rollback deployment terdokumentasi oleh operator hosting.
