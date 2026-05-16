"use client";

import { useState } from "react";

import { RequirementsCanvas } from "./requirementsCanvas";
import { RequirementsDetailPanel } from "./requirementsDetailPanel";
import { RequirementsModelProvider } from "./requirementsModelContext";
import { RequirementsPalette } from "./requirementsPalette";
import { getRequirementsModelActorMeta } from "./requirementsModelMock";

const shellClassName = "flex min-h-0 flex-1 flex-col overflow-hidden";

function RequirementsModelWorkspace() {
  const [paletteOpen, setPaletteOpen] = useState(true);

  return (
    <div className="relative mt-4 flex min-h-105 min-h-0 flex-1 overflow-hidden rounded-xl border border-border/80 sm:mt-6">
      <RequirementsPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <RequirementsCanvas className="min-h-105 flex-1 rounded-none border-0" />
      <RequirementsDetailPanel />
    </div>
  );
}

function RequirementsModelPageClientInner({ actorId }: { actorId: string }) {
  const actor = getRequirementsModelActorMeta(actorId);

  return (
    <div className={shellClassName}>
      <header className="flex shrink-0 flex-col gap-2">
        <h1 className="font-heading min-w-0 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Mô hình yêu cầu · {actor.name}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Sơ đồ Epic, Feature và User Story của actor này. Kéo thêm từ palette;
          nối Epic → Feature → User Story (mock).
        </p>
      </header>

      <RequirementsModelProvider actorId={actorId}>
        <RequirementsModelWorkspace />
      </RequirementsModelProvider>
    </div>
  );
}

export function RequirementsModelPageClient({ actorId }: { actorId: string }) {
  return <RequirementsModelPageClientInner key={actorId} actorId={actorId} />;
}
