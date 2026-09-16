import { SiteShell } from "@/components/layout/site-shell";
import { Container, Section, EmptyState, ButtonLink } from "@/components/ui/primitives";
import { route } from "@/config/routes";
import { ui } from "@/data/content/ui";
export default function NotFound() { return <SiteShell><Section><Container><h1>{ui.notFoundTitle}</h1><EmptyState title="404" description={ui.notFoundDescription} action={<ButtonLink href={route("home").path}>{ui.backHome}</ButtonLink>} /></Container></Section></SiteShell>; }
