/**
 * Product filtering, sorting, and search utilities
 */

/**
 * Filter items by search query (name or category)
 */
export function filterBySearch(items = [], query = '') {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.name?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.company?.toLowerCase().includes(q)
  );
}

/**
 * Filter items by category
 */
export function filterByCategory(items = [], category = 'All') {
  if (category === 'All' || !category) return items;
  return items.filter((item) => item.category?.toLowerCase() === category.toLowerCase());
}

/**
 * Sort items by price, rating, or discount
 * @param {Array} items
 * @param {string} sortBy - 'price_asc' | 'price_desc' | 'rating_desc' | 'discount_desc'
 */
export function sortProducts(items = [], sortBy = 'price_asc') {
  const sorted = [...items];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price_desc':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'rating_desc':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'discount_desc':
      return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    default:
      return sorted;
  }
}
