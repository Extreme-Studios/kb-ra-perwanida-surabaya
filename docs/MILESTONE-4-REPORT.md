# Milestone 4 — Gemini AI Concierge

Tanggal validasi: 15 September 2026.

## 1. Ringkasan implementasi

Sahabat Perwanida adalah concierge AI yang dipasang persisten pada shell website (`/home` dan halaman terdaftar), bukan pada entrance root `/`. Alurnya deterministik: pertanyaan → retrieval lokal → dokumen publik terpilih → Gemini (bila key tersedia) → jawaban, sumber halaman website, dan aksi aman.

## 2. Arsitektur dan file utama

- `src/lib/knowledge/retrieve.ts`: retrieval lexical berbobot dan alias Indonesia dari `toKnowledgeDocuments(schoolContent)`.
- `src/lib/ai/*`: kontrak provider, prompt berlapis, Gemini SDK, service/fallback, dan rate limiter memori.
- `src/app/api/concierge/route.ts`: Route Handler `POST`, validasi payload, no-store, dan pembatasan request.
- `src/components/concierge/concierge.tsx`: satu client component kecil; `concierge.css`: panel desktop/mobile scoped.
- `src/components/layout/site-shell.tsx`: satu titik mounting untuk website utama saja.

## 3. Sumber knowledge

Tidak ada dataset baru, database, embedding, vector DB, web search, atau logging percakapan. Retrieval memproyeksikan 209 dokumen knowledge dari konten publik yang sudah ada: 30 guru, 7 tendik, 13 fasilitas, 7 ekstrakurikuler, 5 program unggulan, 14 program sekolah, 2 sentra kurikulum, 112 video serta profil/kontak/SPMB/FAQ/koleksi publik lain. Record `pending` dan testimoni tidak layak publikasi tetap tidak masuk.

## 4. Retrieval deterministik

Pencarian memakai normalisasi Indonesia, tokenisasi, bobot judul/keyword/kategori/ringkasan/konten, phrase boost, alias seperti PPDB↔SPMB, ngaji↔UMMI, ustadz/ustadzah→guru/pendidik, ruangan→fasilitas, lokasi→alamat, WA→WhatsApp, dan ekskul→ekstrakurikuler. Hasil maksimal enam dokumen serta diurutkan stabil berdasarkan skor lalu judul.

## 5. Batas jawaban

Kueri biaya, tarif, pembayaran serta topik umum di luar lingkup sekolah (misalnya cuaca) tidak diteruskan ke provider. Responsnya: “Informasi tersebut belum tersedia di website Perwanida.” dan tombol WhatsApp admin jika kontak resmi tersedia.

## 6. Gemini server-side

Paket resmi `@google/genai` dipakai di `src/lib/ai/gemini.ts` dengan `GoogleGenAI` dan model default `gemini-2.5-flash`. Provider hanya dibuat di server saat `GEMINI_API_KEY` ada. Browser tidak menerima API key, prompt sistem, atau kredensial.

## 7. Konfigurasi environment

Tambahkan key hanya di environment runtime/deployment:

```env
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

`.env.example` mendokumentasikan nilai tersebut tanpa key. Tidak ada key nyata yang ditambahkan ke source atau laporan.

## 8. API contract

`POST /api/concierge` menerima `{ message, history }`; message dibatasi 1200 karakter dan history maksimal delapan item `user|assistant`. Respons sukses selalu berbentuk `{ answer, sources, fallback, suggestedActions }`. Sumber dibuat server dari `relatedPage`, bukan URL Gemini.

## 9. Ketahanan API

Respons memakai `Cache-Control: no-store`. JSON/payload tidak valid menghasilkan 400 aman; error provider/time-out/empty output menghasilkan fallback unavailable tanpa stack trace; rate limit in-memory membatasi 15 request per 5 menit per header client. Tidak ada transcript atau error mentah yang dicatat.

## 10. Prompt injection dan privasi

Detektor menolak permintaan system prompt, API key, developer message, jailbreak, atau instruksi rahasia sebelum provider dipanggil. Prompt sistem membatasi model ke konteks website dan memerintahkan pengabaian instruksi berbahaya yang berasal dari user maupun dokumen. Tidak ada data pribadi endpoint jabatan yang ditambahkan kembali.

## 11. SPMB dan data perlu verifikasi

Dokumen SPMB yang dipilih membawa `needsVerification` serta catatan jadwal poster sudah berlalu. Service menambahkan catatan itu secara deterministik pada jawaban provider agar tidak ada klaim “masih dibuka”, kuota, atau jadwal baru tanpa konfirmasi sekolah.

## 12. UX chat

Nama UI adalah **Sahabat Perwanida** dengan label **Asisten AI Perwanida**. Sapaan awal: “Halo, saya Sahabat Perwanida. Ada yang bisa saya bantu tentang KB-RA Perwanida Surabaya?” Enam quick action adalah pertanyaan nyata ke backend. Jawaban menampilkan chip sumber internal; fallback/unavailable memberi CTA admin resmi.

## 13. Responsif

Desktop menggunakan panel 410px di kanan bawah. Pada lebar mobile, panel menjadi bottom sheet sampai 92dvh, menjaga composer tetap terlihat serta memperhitungkan `safe-area-inset-bottom`. Tidak ada library UI baru atau animasi berat.

## 14. Aksesibilitas

Panel memakai native `dialog`, label input eksplisit, tombol tutup, Escape/native focus behavior, status `aria-live`, focus ring global, target sentuh minimal 42–48px, dan informasi sumber berupa link yang dapat diakses keyboard.

## 15. Persistensi dan batas penyimpanan

Percakapan tetap hidup saat navigasi aplikasi dan dipulihkan pada refresh tab yang sama melalui `sessionStorage`. Tidak ada `localStorage`, database, analytics, atau penyimpanan server untuk riwayat chat.

## 16. Scope yang tidak diubah

Entrance `/` Milestone 3 tidak diberi chatbot atau desain ulang. Homepage, konten, navigasi, visual gate, hosting/deployment, vector database, external search, dan data store baru tidak diubah. Tidak ada live Gemini call dilakukan karena key tidak tersedia pada validasi ini.

## 17. Validasi otomatis

Lulus: `npm run lint`, `npm run typecheck`, `npm test` (12 test), `npm run build`, serta Playwright concierge dan regresi entrance. Tes mencakup Wushu, perpustakaan/fasilitas, UMMI, alamat, guru Kelompok B, SPMB+verifikasi, biaya kosong, cuaca kosong, prompt injection, provider mock, desktop/mobile, sumber, fallback, API unavailable, persistensi navigation/refresh, dan root entrance tanpa chatbot.

## 18. Bukti visual dan status live

Screenshot final ada di `test-results/milestone-4`: homepage desktop closed/open, jawaban desktop+sumber, mobile open/answer, fallback, API unavailable, serta entrance tanpa chatbot. Wiring Gemini selesai dan dibuild; live call sengaja **belum diverifikasi** karena `GEMINI_API_KEY` tidak dikonfigurasi. Tidak ada deployment dilakukan.
