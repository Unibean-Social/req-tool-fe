import { getSiteUrlFromRequest } from "./request-site-url";
import { SITE } from "./site";

/**
 * Site-wide JSON-LD: Organization, WebSite, illustrative ItemList.
 * @see docs/SEO.md
 */
export async function RootJsonLd() {
  const origin = await getSiteUrlFromRequest();

  const graph = [
    {
      "@type": "Organization",
      "@id": `${origin}/#organization`,
      name: SITE.name,
      url: origin,
    },
    {
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      url: origin,
      name: SITE.name,
      publisher: { "@id": `${origin}/#organization` },
    },
    {
      "@type": "ItemList",
      "@id": `${origin}/#itemlist-luyen-de`,
      name: "Luyện đề",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: { "@type": "Thing", name: "Danh mục luyện đề", url: `${origin}/luyen-de` },
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
