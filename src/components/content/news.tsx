import Link from "next/link";
import type { Article } from "@/types/content";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { ButtonLink, EmptyState } from "@/components/ui/primitives";
import { route } from "@/config/routes";
import { presentation as copy } from "@/data/content/presentation";
export function NewsList({ articles }: { articles: readonly Article[] }) {
  if (!articles.length) return <EmptyState title={copy.newsUnavailable} description={copy.newsUnavailableText} action={<ButtonLink href={route("kontak").path}>Hubungi sekolah</ButtonLink>} />;
  return <div className="news-grid">{articles.map((article) => <article key={article.id}>
    {article.image && <ResponsiveImage asset={article.image} sizes="(max-width: 767px) 90vw, 30vw" />}
    <p className="eyebrow">{article.category}{article.publishedAt && <> · <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time></>}</p>
    <h2><Link href={article.relatedPage}>{article.title}</Link></h2><p>{article.summary}</p>
  </article>)}</div>;
}

