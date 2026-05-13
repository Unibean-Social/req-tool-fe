import type { MetadataRoute } from "next";

import { getPublicSubjectsForSeo } from "@/lib/seo/fetch-subjects-public";
import { getSiteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths = [""];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p, i) => ({
    url: p === "" ? `${base}/` : `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: i === 0 ? 1 : 0.8,
  }));

  const subjects = await getPublicSubjectsForSeo();
  const dynamic: MetadataRoute.Sitemap = subjects.flatMap((s) => {
    const lastModified = s.updatedAt ? new Date(s.updatedAt) : now;
    return [
      {
        url: `${base}/luyen-de/${s.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${base}/luyen-de/${s.slug}/thi-thu`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      },
    ];
  });

  return [...staticEntries, ...dynamic];
}
