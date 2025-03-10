const isbn10Regex = /^\d{9}[\dXx]$/; // ISBN-10: 9 digits + check digit (0-9, X, or x)
const isbn13Regex = /^(978|979)\d{10}$/; // ISBN-13: 978/979 prefix + 10 digits
export const isbnCombinedRegex = new RegExp(`(?:${isbn10Regex.source}|${isbn13Regex.source})`);

export const cleanQuery = (query) => query.replace(/[^0-9Xx]/g, '');

export function isBookCode(query) {
  const cleanedQuery = cleanQuery(query);

  if (cleanedQuery.length === 10 && isbn10Regex.test(cleanedQuery)) {
    return 'ISBN-10';
  } else if (cleanedQuery.length === 13 && isbn13Regex.test(cleanedQuery)) {
    return 'ISBN-13';
  }
  return false;
}

export function truncateText(text, maxLength, ellipsis = '...') {
  if (text.length <= maxLength) {
    return text;
  }

  let truncatedText = text.substr(0, maxLength);
  truncatedText = truncatedText.substr(0, truncatedText.lastIndexOf(' '));

  return truncatedText + ellipsis;
}

export function formatEbayBook(item) {
  return {
    id: item.itemId,
    title: item.title,
    thumbnail: item.image.imageUrl,
    images: item.additionalImages,
    condition: item.condition,
    sellerType: 'eBay',
    URL: item.itemWebUrl,
    sellerName: item.seller.username,
    sellerEmail: null,
    price: item.price.value,
    currency: item.price.currency
  }
}