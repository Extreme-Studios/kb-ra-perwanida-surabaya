"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { /* Intentionally avoid logging runtime error details or user data. */ }, []);
  return <html lang="id"><body><main className="app-error"><p className="eyebrow">Terjadi kendala</p><h1>Halaman belum dapat dimuat.</h1><p>Silakan coba lagi. Jika kendala berlanjut, hubungi sekolah melalui informasi kontak resmi.</p><div><button type="button" onClick={reset}>Coba lagi</button><Link href="/home">Kembali ke beranda</Link></div></main></body></html>;
}
