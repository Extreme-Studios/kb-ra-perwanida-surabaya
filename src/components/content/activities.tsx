import type { ContentRecord } from "@/types/content";
import { ResponsiveImage } from "@/components/ui/responsive-image";
export function Activities({ items }: { items: readonly ContentRecord[] }) {
  return <div className="activities-list">{items.map((item, index) => <details className="activity" key={item.id} open={index === 0}>
    <summary><span className="activity-index">0{index + 1}</span><h3>{item.title}</h3><span className="activity-plus" aria-hidden="true">+</span></summary>
    <div className="activity-body"><div>{item.body.map((text) => <p key={text}>{text}</p>)}</div>{item.images?.[0] && <ResponsiveImage asset={item.images[0]} sizes="(max-width: 767px) 90vw, 35vw" />}</div>
  </details>)}</div>;
}

