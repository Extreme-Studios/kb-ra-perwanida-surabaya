import { schoolContent } from "@/data/content/school";
function getSiteUrl(): URL | undefined {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("SITE_URL must be an HTTP(S) URL");
  return url;
}
export const site = {
  name: schoolContent.identity.name,
  description: `Informasi profil, program, kegiatan, dan kontak ${schoolContent.identity.name}.`,
  url: getSiteUrl(),
  indexable: (process.env.ALLOW_INDEXING ?? process.env.SITE_INDEXABLE) === "true" && Boolean(process.env.SITE_URL),
  locale: "id_ID",
};
