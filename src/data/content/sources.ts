import type { SourceReference } from "@/types/content";
import migratedSources from "./migrated-sources.json";
export const sources: readonly SourceReference[] = [
  { id: "brief", label: "Brief pemilik project", accessedAt: "2026-09-15" },
  ...migratedSources,
];
