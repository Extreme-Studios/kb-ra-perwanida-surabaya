import type { SchoolContent } from "@/types/content";
import { migratedContent } from "./migrated";
import availability from "./video-availability.json";
export const schoolContent: SchoolContent = {
  ...migratedContent,
  videos: migratedContent.videos.map(video => {
    const result = availability.find(item => item.url === video.videoUrl)?.availability;
    return { ...video, availability: result === "available" || result === "unavailable" ? result : "unchecked" };
  }),
};
export const contentGaps = [
  "four-featured-program-descriptions", "six-extracurricular-photos", "news-source-empty",
  "truncated-testimonial", "current-admission-status", "historical-student-count",
  "brochure-profile-differences", "committee-current-period", "video-availability",
] as const;
