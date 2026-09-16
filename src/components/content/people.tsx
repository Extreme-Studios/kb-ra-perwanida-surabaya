import type { Person } from "@/types/content";
import { ResponsiveImage } from "@/components/ui/responsive-image";
export function PersonCard({ person }: { person: Person }) {
  return <article className="person-card">
    {person.photo && <ResponsiveImage asset={person.photo} className="person-photo" sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 23vw" />}
    <div className="person-info"><h3>{person.title}</h3><p>{person.role}</p>
      {!!person.additionalRoles?.length && <details><summary>Jabatan lainnya</summary><ul>{person.additionalRoles.map((role) => <li key={role}>{role}</li>)}</ul></details>}
    </div>
  </article>;
}
export function PeopleGrid({ people }: { people: readonly Person[] }) {
  return <div className="people-grid">{people.map((person) => <PersonCard key={person.id} person={person} />)}</div>;
}

