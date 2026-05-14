"use client";

import { type ReactNode, useMemo } from "react";
import { notFound, useParams } from "next/navigation";

import { useOrgProjects } from "@/hooks/useProject";

import { useOrgWorkspace } from "../../orgWorkspaceContext";

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

  const { orgId } = useOrgWorkspace();
  const { data: projects, isPending, isError } = useOrgProjects(orgId);

  if (!projectSlug) {
    notFound();
  }

  if (isError) {
    notFound();
  }

  if (!isPending) {
    const exists = projects?.some((p) => p.slug === projectSlug) ?? false;
    if (!exists) {
      notFound();
    }
  }

  return <>{children}</>;
}
