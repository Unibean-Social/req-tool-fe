import type { OrgProject } from "@/lib/api/services/fetchProject";

/** Giữ tab hiện tại khi đổi dự án trên rail / sau khi xóa. */
export function projectSubPathFromPathname(
  pathname: string,
  base: string
): string {
  if (!pathname.startsWith(base)) return "dashboard";
  const rest = pathname.slice(base.length).replace(/^\//, "");
  return rest || "dashboard";
}

/**
 * Chọn slug kế tiếp sau khi xóa (ưu tiên dự án đứng sau; xóa cuối thì lùi về trước).
 * `projects` phải là danh sách **trước** khi xóa (còn dự án bị xóa).
 */
export function getNextProjectSlugAfterDelete(
  projects: OrgProject[],
  deletedProjectId: string
): string | null {
  const remaining = projects.filter((p) => p.id !== deletedProjectId);
  if (remaining.length === 0) return null;

  const deletedIndex = projects.findIndex((p) => p.id === deletedProjectId);
  if (deletedIndex < 0) return remaining[0]!.slug;
  if (deletedIndex < remaining.length) return remaining[deletedIndex]!.slug;
  return remaining[remaining.length - 1]!.slug;
}

/** Slug hiện tại không còn trong list (sau xóa / invalidate) — chọn dự án thay thế. */
export function getRedirectSlugWhenCurrentMissing(
  projects: OrgProject[],
  currentSlug: string
): string | null {
  if (projects.length === 0) return null;
  if (projects.some((p) => p.slug === currentSlug)) return currentSlug;
  return projects[0]!.slug;
}
