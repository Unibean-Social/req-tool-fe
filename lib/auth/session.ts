/** Cookie auth — đồng bộ với `proxy.ts` và `authSlice`. */
export const AUTH_COOKIE = "authToken";

export function safeRedirectPath(from: string | null | undefined): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

export function buildLoginUrl(fromPathname?: string): string {
  const from = safeRedirectPath(fromPathname ?? "/");
  if (from === "/" || from === "/login") return "/login";
  return `/login?from=${encodeURIComponent(from)}`;
}

/** `exp` (giây) từ JWT; `null` nếu không decode được. */
export function getJwtExpSeconds(token: string): number | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const json = JSON.parse(
      typeof atob !== "undefined"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8")
    ) as { exp?: unknown };
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

/** Hết hạn hoặc token không hợp lệ → coi như hết phiên. */
export function isAuthTokenExpired(
  token: string,
  skewSeconds = 0
): boolean {
  const exp = getJwtExpSeconds(token);
  if (exp === null) return true;
  return exp * 1000 <= Date.now() + skewSeconds * 1000;
}
