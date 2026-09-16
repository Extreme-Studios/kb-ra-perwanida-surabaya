import Link from "next/link";
import type { ContentRecord } from "@/types/content";
import { Arrow, Card } from "@/components/ui/primitives";
import { ui } from "@/data/content/ui";

export function ContentCard({ record, index }: { record: ContentRecord; index?: number }) {
  return <Card className="content-card">
    <div className="card-top"><span className="card-index">{index !== undefined ? String(index + 1).padStart(2, "0") : "•"}</span><Arrow diagonal /></div>
    <h3><Link className="stretched-link" href={record.relatedPage}>{record.title}</Link></h3>
    {record.summary && <p>{record.summary}</p>}
    <span className="card-link">{ui.programLink}</span>
  </Card>;
}

