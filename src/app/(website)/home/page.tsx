import { HomeExperience } from "@/components/content/home-page";
import { contentRepository } from "@/lib/content";
import { route } from "@/config/routes";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(route("home"));
export default async function HomePage() { return <HomeExperience school={await contentRepository.getSchool()} />; }
