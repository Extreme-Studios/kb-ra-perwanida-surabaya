import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { routes } from "@/config/routes";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.indexable || !site.url) return [];
  return ["/", ...routes.map(page=>page.path)].map(path=>({url:new URL(path,site.url).toString()}));
}
