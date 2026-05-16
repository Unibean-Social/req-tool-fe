"use client";

import { createContext, useContext } from "react";

type ProjectWorkspaceNavContextValue = {
  /** `nextSlug` từ onMutate (danh sách trước khi xóa); bỏ qua nếu không có. */
  navigateAfterProjectDelete: (
    deletedProjectId: string,
    nextSlug?: string | null
  ) => void;
};

const ProjectWorkspaceNavContext =
  createContext<ProjectWorkspaceNavContextValue | null>(null);

export function ProjectWorkspaceNavProvider({
  value,
  children,
}: {
  value: ProjectWorkspaceNavContextValue;
  children: React.ReactNode;
}) {
  return (
    <ProjectWorkspaceNavContext.Provider value={value}>
      {children}
    </ProjectWorkspaceNavContext.Provider>
  );
}

export function useProjectWorkspaceNav(): ProjectWorkspaceNavContextValue {
  const ctx = useContext(ProjectWorkspaceNavContext);
  if (!ctx) {
    throw new Error(
      "useProjectWorkspaceNav must be used within ProjectWorkspaceLayout"
    );
  }
  return ctx;
}
