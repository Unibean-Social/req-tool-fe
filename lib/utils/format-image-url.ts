/** Chuẩn hóa URL ảnh API / relative để dùng với next/image hoặc <img>. */
export function formatImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  const t = url.trim()
  if (!t) return undefined
  if (t.startsWith("http://") || t.startsWith("https://")) return t
  if (t.startsWith("//")) return `https:${t}`
  if (t.startsWith("/")) return t
  return `https://${t}`
}
