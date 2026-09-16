import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { contentRepository } from "@/lib/content";
import { Concierge } from "@/components/concierge/concierge";
export async function SiteShell({ children, conciergeSlot }: { children: ReactNode; conciergeSlot?: ReactNode }) {
  const school = await contentRepository.getSchool();
  return <><a className="skip-link" href="#main-content">Lewati ke konten utama</a><Navbar /><main id="main-content" tabIndex={-1}>{children}</main><Footer contact={school.contact} />
    {conciergeSlot ?? <Concierge adminHref={school.contact.whatsappUrl} />}
  </>;
}
