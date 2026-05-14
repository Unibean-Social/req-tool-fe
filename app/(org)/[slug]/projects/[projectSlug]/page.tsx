import { redirect } from "next/navigation";

export default async function OrgProjectSlugIndexPage({
  params,
}: {
  params: Promise<{ slug: string; projectSlug: string }>;
}) {
  const { slug, projectSlug } = await params;
  redirect(
    `/${encodeURIComponent(slug)}/projects/${encodeURIComponent(projectSlug)}/actors`
  );
}
