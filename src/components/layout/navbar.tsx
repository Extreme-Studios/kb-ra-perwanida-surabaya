import { Brand } from "./brand";
import { DesktopNavigation, MobileNavigation } from "./navigation";
import { Container, ButtonLink, Arrow } from "@/components/ui/primitives";
import { route } from "@/config/routes";
import { schoolContent } from "@/data/content/school";
export function Navbar() {
  return <header className="site-header"><div className="utility-bar"><Container><span>Kelompok Bermain & Raudhatul Athfal</span><a href={`tel:${schoolContent.contact.phone.replace(/\D/g,"")}`}>{schoolContent.contact.phone}</a></Container></div>
    <Container className="navbar"><Brand /><DesktopNavigation /><div className="nav-actions"><ButtonLink href={route("spmb").path} className="nav-cta">SPMB <Arrow diagonal /></ButtonLink><MobileNavigation /></div></Container>
  </header>;
}
