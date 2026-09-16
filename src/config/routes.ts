import type { NavigationItem, RouteDefinition } from "@/types/content";

export const routes = [
  { id: "home", path: "/home", title: "Home", category: "home" },
  { id: "profil", path: "/profil", title: "Profil Sekolah", category: "profil" },
  { id: "tentang", path: "/profil/tentang-kami", title: "Tentang Kami", category: "profil", parentId: "profil" },
  { id: "guru", path: "/profil/guru-tendik", title: "Guru & Tendik", category: "profil", parentId: "profil" },
  { id: "komite", path: "/profil/komite", title: "Komite", category: "profil", parentId: "profil" },
  { id: "program", path: "/program", title: "Program", category: "program" },
  { id: "kurikulum", path: "/program/kurikulum", title: "Kurikulum", category: "program", parentId: "program" },
  { id: "unggulan", path: "/program/unggulan", title: "Program Unggulan", category: "program", parentId: "program" },
  { id: "character", path: "/program/unggulan/character-building", title: "Character Building", category: "program", parentId: "unggulan" },
  { id: "budaya", path: "/program/unggulan/cinta-budaya-indonesia", title: "Cinta Budaya Indonesia", category: "program", parentId: "unggulan" },
  { id: "literasi", path: "/program/unggulan/gerakan-literasi", title: "Gerakan Literasi", category: "program", parentId: "unggulan" },
  { id: "green", path: "/program/unggulan/green-school", title: "Green School", category: "program", parentId: "unggulan" },
  { id: "ummi", path: "/program/unggulan/mengaji-metode-ummi", title: "Mengaji Metode UMMI", category: "program", parentId: "unggulan" },
  { id: "penunjang", path: "/program/penunjang", title: "Program Penunjang", category: "program", parentId: "program" },
  { id: "fasilitas", path: "/profil/fasilitas", title: "Fasilitas", category: "profil", parentId: "profil" },
  { id: "galeri", path: "/galeri", title: "Galeri Kegiatan", category: "galeri" },
  { id: "ekstra", path: "/galeri/ekstrakurikuler", title: "Ekstrakurikuler", category: "galeri", parentId: "galeri" },
  { id: "mengaji", path: "/galeri/mengaji", title: "Mengaji", category: "galeri", parentId: "galeri" },
  { id: "prestasi", path: "/galeri/prestasi", title: "Prestasi", category: "galeri", parentId: "galeri" },
  { id: "agenda", path: "/galeri/agenda", title: "Agenda", category: "galeri", parentId: "galeri" },
  { id: "berita", path: "/berita", title: "Berita", category: "berita" },
  { id: "daily", path: "/berita/daily-activity", title: "Daily Activity", category: "berita", parentId: "berita" },
  { id: "event", path: "/berita/event", title: "Event", category: "berita", parentId: "berita" },
  { id: "multimedia", path: "/multimedia", title: "Multimedia", category: "multimedia" },
  { id: "video", path: "/multimedia/video", title: "Video", category: "multimedia", parentId: "multimedia" },
  { id: "kontak", path: "/kontak", title: "Kontak", category: "kontak" },
  { id: "spmb", path: "/spmb", title: "SPMB", category: "spmb" },
] as const satisfies readonly RouteDefinition[];

export type RouteId = (typeof routes)[number]["id"];
export function route(id: string): RouteDefinition {
  const result = routes.find((item) => item.id === id);
  if (!result) throw new Error(`Unknown route: ${id}`);
  return result;
}
export const routeByPath = (path: string) => routes.find((item) => item.path === path);
export const childrenOf = (id: string) => routes.filter((item) => "parentId" in item && item.parentId === id);
export const navigation: readonly NavigationItem[] = [
  { routeId: "home" },
  { routeId: "profil", children: ["tentang", "guru", "komite", "fasilitas"].map((routeId) => ({ routeId })) },
  { routeId: "program", children: [
    { routeId: "kurikulum" },
    { routeId: "unggulan", children: ["character", "budaya", "literasi", "green", "ummi"].map((routeId) => ({ routeId })) },
    { routeId: "penunjang" },
  ] },
  { routeId: "galeri", children: ["ekstra", "mengaji", "prestasi", "agenda"].map((routeId) => ({ routeId })) },
  { routeId: "berita", children: ["daily", "event"].map((routeId) => ({ routeId })) },
  { routeId: "multimedia", children: [{ routeId: "video" }] },
  { routeId: "kontak" },
];
export function ancestorsOf(page: RouteDefinition): RouteDefinition[] {
  return page.parentId ? [...ancestorsOf(route(page.parentId)), route(page.parentId)] : [];
}

