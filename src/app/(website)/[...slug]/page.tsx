import { notFound } from "next/navigation";
import { routes, routeByPath } from "@/config/routes";
import { contentRepository } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { CorePage } from "@/components/content/core-pages";
type Props = { params: Promise<{ slug: string[] }>; searchParams: Promise<{ page?: string }> };
export function generateStaticParams() { return routes.filter((item) => item.id !== "home").map((item) => ({ slug: item.path.slice(1).split("/") })); }
export async function generateMetadata({ params }: Props) {
  const page = routeByPath("/" + (await params).slug.join("/"));
  if (!page) notFound();
  return pageMetadata(page);
}
export default async function ContentPage({ params, searchParams }: Props) {
  const page = routeByPath("/" + (await params).slug.join("/"));
  if (!page) notFound();
  const school = await contentRepository.getSchool();
  let videoPage = 1;
  if (page.category === "multimedia") {
    videoPage = Number((await searchParams).page ?? 1);
    if (!Number.isInteger(videoPage) || videoPage < 1 || videoPage > Math.ceil(school.videos.length / 12)) notFound();
  }
  return <CorePage page={page} school={school} videoPage={videoPage}/>;
}
