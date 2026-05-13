import { headers } from "next/headers";

import { getSiteUrl } from "./site";

/**
 * Request-aligned origin (multi-domain / social previews).
 * Server-only. Falls back to getSiteUrl().
 * @see docs/SEO.md
 */
export async function getSiteUrlFromRequest(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return getSiteUrl();

  const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0]?.trim() || "http";
  return `${proto}://${host}`.replace(/\/+$/, "");
}
