const SITE_URL = 'https://shop.tapla.az'

export function getItemListSchema(items: { name: string; slug: string }[], listName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 100).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}/mehsullar/${item.slug}`,
    })),
  }
}
