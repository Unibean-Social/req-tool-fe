"use client";

import { useState } from "react";

import { useOrgProjects } from "@/hooks/useProject";

import { useOrgWorkspace } from "../orgWorkspaceContext";
import { ProjectHeader } from "./components/projectHeader";
import { ProjectList } from "./components/projectList";

export default function OrgProjectsPage() {
  const { orgId } = useOrgWorkspace();
  const { data: projects, isPending } = useOrgProjects(orgId);
  const [search, setSearch] = useState("");

  const showSearch = isPending || (projects?.length ?? 0) > 0;

  return (
    <div className="flex min-h-full w-full flex-1 flex-col gap-6 overflow-y-auto p-6 sm:gap-8 sm:p-8">
      <ProjectHeader
        search={search}
        onSearchChange={setSearch}
        showSearch={showSearch}
      />
      <ProjectList searchQuery={search} />
    </div>
  );
}
