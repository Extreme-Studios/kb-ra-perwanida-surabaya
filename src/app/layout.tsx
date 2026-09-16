import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import localFont from "next/font/local";
import { schoolContent } from "@/data/content/school";
const heading = localFont({ src: "../../node_modules/@fontsource-variable/nunito-sans/files/nunito-sans-latin-wght-normal.woff2", variable: "--font-nunito", display: "swap" });
const body = localFont({ src: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2", variable: "--font-dm", display: "swap" });
import "./globals.css";
import "../styles/experience.css";
export const metadata: Metadata = {
  metadataBase: site.url,
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: schoolContent.identity.logo.src ?? "data:," },
  robots: { index: site.indexable, follow: site.indexable },
  openGraph: { type: "website", siteName: site.name, locale: site.locale, title: site.name, description: site.description },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="id" className={`${heading.variable} ${body.variable}`}><body>{children}</body></html>;
}
