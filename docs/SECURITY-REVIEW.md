# Security Review — Milestone 5

Tanggal: 15 September 2026. Review ini mencakup source dan production build lokal, bukan penilaian infrastruktur hosting.

## Perubahan yang diterapkan

- Header global: CSP realistis untuk asset self-hosted Next, `nosniff`, referrer policy, permissions policy, HSTS, anti-framing, COOP dan CORP.
- API concierge menerima JSON `POST` saja; content type lain mendapat 415, payload buruk 400, dan jawaban selalu `no-store`.
- Provider Gemini tetap hanya server-side. Key tidak diteruskan ke browser, error provider tidak dikirim mentah, request dibatalkan setelah 12 detik, dan respons kosong diperlakukan gagal aman.
- Limiter dipisah lewat `RateLimitStore`. Fallback in-memory melakukan pruning window, menyimpan hash pendek identifier bukan IP mentah, dan tidak mencatat identifier/transcript.
- Global error state branded menggantikan stack trace pengguna tanpa logging error atau data pengguna.

## CSP dan kompatibilitas

`script-src` dan `style-src` masih memakai `'unsafe-inline'` karena hydration/style runtime Next memerlukannya dalam konfigurasi tanpa nonce. `unsafe-eval` tidak digunakan. Tidak ada koneksi Gemini dari browser; `connect-src` hanya same-origin. Situs tidak memakai iframe aktif, sehingga CSP dapat menolak framing.

## API dan privasi

Endpoint `/api/concierge` tidak memasang CORS longgar. GET ditolak framework sebagai 405. Tidak ada log request, key, prompt sistem, context retrieved, maupun isi chat. Riwayat UI hanya berada di `sessionStorage` tab pengguna.

## Batas limiter

Limiter default 15 request/5 menit efektif untuk satu proses. Untuk deployment multi-instance/serverless, implementasikan `RateLimitStore` dengan fasilitas rate limit platform atau KV/Redis yang disetujui. Tidak ada layanan berbayar baru ditambahkan pada milestone ini.

## Secret scan

Pencarian source terhadap pola key/token/password tidak menemukan credential aplikasi di source atau `.env` ter-commit. `GEMINI_API_KEY` tersedia di environment runtime untuk smoke test; nilainya tidak dibaca, dicetak, atau ditulis ke file. File audit/artefak tooling yang berisi istilah generik bukan credential aplikasi.

## Verifikasi

Header dan rejection API diverifikasi melalui Playwright pada production build lokal. `npm audit` dijalankan pada dependency tree pada Milestone 5; hasilnya tidak memiliki vulnerability.
