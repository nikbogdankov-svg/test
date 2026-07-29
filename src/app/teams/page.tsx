import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { MetadataCard } from "@/components/dataset/MetadataCard";
import { NavGuard } from "@/components/layout/NavGuard";
import { Badge } from "@/components/ui/badge";
import { datasets } from "@/data/datasets";
import { personas, personaToOwner } from "@/data/personas";
import { owners, teams } from "@/data/users";

const directory = Array.from(
  new Map(
    [...owners, ...personas.map(personaToOwner)].map((owner) => [
      owner.email,
      owner,
    ])
  ).values()
);

export default function TeamsPage() {
  return (
    <NavGuard navKey="teams">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Teams
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {teams.map((team) => {
            const members = directory.filter(
              (owner) => owner.team === team.name
            );
            const owned = datasets.filter(
              (dataset) => dataset.owner.team === team.name
            );
            return (
              <MetadataCard key={team.id} title={team.name}>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  <Badge variant="muted">{members.length} members</Badge>
                  <Badge variant="info">{owned.length} owned datasets</Badge>
                </div>
                <div className="space-y-2">
                  {members.length > 0 ? (
                    members.map((member) => (
                      <OwnerAvatar key={member.id} owner={member} />
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">
                      No members in this department yet.
                    </p>
                  )}
                </div>
                {owned.length > 0 ? (
                  <ul className="mt-4 space-y-1 border-t border-neutral-100 pt-3">
                    {owned.map((dataset) => (
                      <li key={dataset.id} className="text-sm text-neutral-700">
                        {dataset.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </MetadataCard>
            );
          })}
        </div>
      </div>
    </NavGuard>
  );
}
