import Link from "next/link";
import type { Program } from "@/types/content";
import { Arrow } from "@/components/ui/primitives";
export function ProgramGrid({ programs }: { programs: readonly Program[] }) {
  return <div className="program-mosaic">{programs.map((item, index) =>
    <Link key={item.id} href={item.relatedPage} className={`program-tile program-tile--${index + 1}`}>
      <span className="tile-number">0{index + 1}</span><span className="tile-flower" aria-hidden="true">✳</span>
      <h3>{item.title}</h3><span className="tile-link">Kenali program <Arrow diagonal /></span>
    </Link>)}</div>;
}

