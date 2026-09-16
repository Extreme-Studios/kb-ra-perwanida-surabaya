# Milestone 5 — Production Hardening & Release Readiness

Tanggal final: 15 September 2026.

## 1. Audit summary

Project Next.js 16.3.5 memakai content server-rendered, empat client boundary yang memang interaktif, local `next/image`, font self-hosted, route Node untuk concierge, root entrance terpisah dan website utama di `/home`. Project bukan Git repository; tidak diinisialisasi atau dipush.

## 2. Security changes

Provider kini abortable pada timeout 12 detik. Limiter memiliki interface pengganti dan hash identifier. API mewajibkan JSON POST, error user aman/no-store, dan error boundary branded tersedia.

## 3. Security headers

Header CSP, `X-Content-Type-Options`, Referrer/Permissions Policy, HSTS, X-Frame-Options, COOP dan CORP ditambahkan global. CSP tidak memakai `unsafe-eval`; kebutuhan `'unsafe-inline'` Next terdokumentasi di [SECURITY-REVIEW.md](./SECURITY-REVIEW.md).

## 4. API hardening

GET mendapat 405, `text/plain` mendapat 415, payload tanpa message mendapat 400. Endpoint tidak memiliki CORS wildcard dan tidak pernah menyimpan response AI di public cache.

## 5. Rate limiting status

Fallback saat ini 15 request/5 menit per process dengan cleanup window dan identifier ter-hash. Siap diganti melalui `RateLimitStore`; limiter distributed belum dipasang karena target hosting belum dipilih.

## 6. Gemini live verification

`GEMINI_API_KEY` tersedia di environment runtime (nilai tidak diakses/ditulis). Smoke test 10/10 lulus: Wushu, perpustakaan, guru Kelompok B, metode, dan SPMB menggunakan knowledge+source; biaya/cuaca/general knowledge/prompt injection/API key ditolak atau fallback. SPMB memberi konfirmasi, bukan klaim buka.

## 7. Performance findings

Tidak ada fetch AI sebelum pertanyaan. Image/font/client boundary sesuai fungsi dan build tidak memperlihatkan warning aplikasi. Detail dan batas pengukuran di [PERFORMANCE-REVIEW.md](./PERFORMANCE-REVIEW.md).

## 8. Lighthouse / Web Vitals

Lighthouse CLI tidak tersedia sehingga tidak ada skor atau CWV palsu. Production-local browser validation menggantikan angka pada milestone ini; Lighthouse nyata menjadi item wajib pre-launch setelah domain/CDN final.

## 9. Accessibility results

Axe WCAG 2 A/AA/2.1 AA lulus pada entrance, home, about, program, guru, gallery, SPMB, contact dan concierge open. Keyboard Escape/dialog telah dicakup E2E.

## 10. SEO readiness

Preview default tetap noindex. Indexing mensyaratkan `SITE_URL` dan `ALLOW_INDEXING=true`; robots+sitemap mengikuti state tersebut. Canonical/metadata memakai `site.url` bila diset.

## 11. Content verification status

SPMB masih `needsVerification` dan selalu dinetralkan. Personel/jabatan juga memiliki catatan verifikasi. Berita kosong, arsip jadwal, deskripsi program terbatas, dan testimoni terpotong tidak diubah menjadi klaim baru.

## 12. Environment variables

`GEMINI_API_KEY`, `GEMINI_MODEL`, `SITE_URL`, dan `ALLOW_INDEXING` didokumentasikan di `.env.example`. Key tidak masuk source.

## 13. Dependency audit

`npm audit` pada dependency production: 0 vulnerability. Tidak ada major upgrade yang dipaksakan.

## 14. Test results

Lulus: `npm run lint`, `npm run typecheck`, `npm test` (13 test), `npm run build`, release Playwright, serta regressions entrance/concierge Milestone 3–4. Final audit memperbaiki render tree 404: `not-found.tsx` tidak lagi memasang `SiteShell` kedua karena catch-all sudah berada pada website layout. Regression memastikan tepat satu header, footer, heading dan concierge. Lazy images Guru & Tendik, Home dan Gallery diverifikasi melalui incremental scroll; semua image valid selesai load (`naturalWidth > 0`) tanpa image network failure atau page error. Screenshot full-page kini memakai scroll bertahap pada validasi lazy image, tanpa mengubah loading strategy global.

## 15. Screenshot paths

`test-results/milestone-5/`: entrance desktop/mobile, home desktop/mobile, about, program, teachers, gallery, SPMB, concierge mobile answer, dan branded 404. `test-results/milestone-5-final/`: 404 desktop serta Home, Guru & Tendik, dan Gallery sesudah incremental scroll.

## 16. Known limitations

Lighthouse score/CWV live belum ada; target hosting/domain belum ditentukan; in-memory limiter tidak distributed; final SPMB/personel/contact harus dikonfirmasi operator sebelum rilis. Tidak satu pun merupakan source-code critical blocker selama checklist deployment dipenuhi.

## 17. Deployment requirements

Node 20+, Next.js server runtime, image optimization, environment secret store dan support `/api/concierge` diperlukan. Jangan static export. Perintah: `npm run build`, lalu `npm run start`.

## 18. Release status

**READY FOR DEPLOYMENT.** Tidak ada blocker kritis pada source/build/security test/live Gemini verification. Sebelum publish, operator harus menyelesaikan item domain, environment, content confirmation, limiter hosting dan Lighthouse production pada [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md). Tidak ada deployment, perubahan domain atau aktivasi indexing yang dilakukan.
