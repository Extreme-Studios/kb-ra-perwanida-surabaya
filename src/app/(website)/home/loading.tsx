import { Container, LoadingState, Section } from "@/components/ui/primitives";
import { ui } from "@/data/content/ui";
export default function Loading() { return <Section><Container><LoadingState label={ui.loading} /></Container></Section>; }
