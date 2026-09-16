import Link from "next/link";
import { ancestorsOf, route } from "@/config/routes";
import { Container } from "@/components/ui/primitives";
import type { RouteDefinition } from "@/types/content";
import { schoolContent } from "@/data/content/school";
export function Breadcrumb({ page }: { page: RouteDefinition }) {
  return <nav aria-label="Breadcrumb" className="breadcrumb"><ol><li><Link href={route("home").path}>Home</Link></li>{ancestorsOf(page).map((item) => <li key={item.id}><Link href={item.path}>{item.title}</Link></li>)}<li aria-current="page">{page.title}</li></ol></nav>;
}
export function PageHeader({ page }: { page: RouteDefinition }) {
  return <div className="page-header"><Container><Breadcrumb page={page} /><p className="eyebrow">{schoolContent.identity.name}</p><h1>{page.title}</h1></Container></div>;
}
