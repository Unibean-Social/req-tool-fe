"use client";

import { type ReactNode, useMemo } from "react";
import { notFound, useParams } from "next/navigation";

import { useOrgProjects } from "@/hooks/useProject";

import { useOrgWorkspace } from "../../orgWorkspaceContext";
import { ProjectWorkspaceLayout } from "./components/projectWorkspaceLayout";

export default function OrgProjectSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const raw = params?.projectSlug;
  const projectSlug = useMemo(() => {
    const s =
      typeof raw === "string"
        ? raw
        : Array.isArray(raw)
          ? (raw[0] ?? "")
          : "";
    try {
      return decodeURIComponent(s).trim();
    } catch {
      return s.trim();
    }
  }, [raw]);

  const { orgId, slug: orgSlug } = useOrgWorkspace();
  const { data: projects, isPending, isError, isFetching, isLoading } =
    useOrgProjects(orgId);

  if (!projectSlug) {
    notFound();
  }

  if (isError) {
    notFound();
  }

  if (!isLoading && !isPending && !isFetching) {
    const exists = projects?.some((p) => p.slug === projectSlug) ?? false;
    if (!exists) {
      notFound();
    }
  }

  return (
    <ProjectWorkspaceLayout
      orgSlug={orgSlug}
      projectSlug={projectSlug}
      projects={projects ?? []}
      isProjectsPending={isPending}
    >
      {children}
    </ProjectWorkspaceLayout>
  );
}
