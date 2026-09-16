import Link from "next/link";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import type { VideoRecord } from "@/types/content";
import { route } from "@/config/routes";
export function VideoLibrary({ videos, page }: { videos: readonly VideoRecord[]; page: number }) {
  const size = 12, pageCount = Math.max(1, Math.ceil(videos.length / size));
  return <><p className="archive-note">Arsip video sekolah · {videos.length} video. Video dibuka di YouTube tanpa autoplay di halaman ini.</p>
    <div className="video-grid">{videos.slice((page - 1) * size, page * size).map((video) =>
      <article key={video.id} className="video-card"><a href={video.videoUrl} target="_blank" rel="noopener noreferrer" aria-label={`Tonton ${video.title} di YouTube`}>
        {video.image && <ResponsiveImage asset={video.image} sizes="(max-width: 767px) 90vw, 30vw" />}<span className="video-play" aria-hidden="true">↗</span></a>
        <h2>{video.title}</h2>{video.summary && <p>{video.summary}</p>}
      </article>)}</div>
    <nav className="pagination" aria-label="Halaman video">{Array.from({ length: pageCount }, (_, i) => <Link key={i} href={`${route("video").path}?page=${i + 1}`} aria-current={page === i + 1 ? "page" : undefined}>{i + 1}</Link>)}</nav>
  </>;
}

