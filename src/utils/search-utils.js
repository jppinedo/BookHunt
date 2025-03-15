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

// eBay single item to BookHunt Book
export function transformEbayItem(ebayItem) {
  return {
    id: ebayItem.itemId, 
    title: ebayItem.title, 
    thumbnail: ebayItem.image?.imageUrl || '',
    images: ebayItem.additionalImages?.map((img) => img.imageUrl) || [], 
    condition: ebayItem.condition, 
    sellerType: 'eBay', 
    URL: ebayItem.itemWebUrl, 
    sellerName: ebayItem.seller?.username || '', 
    sellerEmail: null, 
    price: ebayItem.price?.value || '0.00', 
    currency: ebayItem.price?.currency || 'USD', 
  };
}

// eBay list items to BookHunt Book
export function formatEbayBook(item) {
  return {
    id: item.itemId,
    title: item.title,
    thumbnail: item.image?.imageUrl || '',
    images: item.additionalImages,
    condition: item.condition,
    sellerType: 'eBay',
    URL: item.itemWebUrl,
    sellerName: item.seller?.username || '',
    sellerEmail: null,
    price: item.price?.value || '0.00',
    currency: item.price?.currency || 'USD'
  }
}

// Google list items to BookHunt Book
export function formatGoogleBook(googleBook) {
  const volumeInfo = googleBook.volumeInfo || {};
  const industryIdentifiers = volumeInfo.industryIdentifiers || [];
  const imageLinks = volumeInfo.imageLinks || {};

  // Find ISBN-13 (preferred) or ISBN-10
  const isbn13 = industryIdentifiers.find((id) => id.type === 'ISBN_13')?.identifier;
  const isbn10 = industryIdentifiers.find((id) => id.type === 'ISBN_10')?.identifier;
  const isbn = isbn13 || isbn10 || '';

  return {
    title: volumeInfo.title || '',
    isbn: isbn,
    price: '0.00', 
    currency: 'USD', 
    condition: '', 
    description: volumeInfo.description || '',
    thumbnail: imageLinks.thumbnail || '',
    images: [],
    sellerName: '', 
    sellerEmail: '',
    sellerType: 'user', 
    URL: '',
    publisher: volumeInfo?.publisher || 'N/A',
    authors: volumeInfo.authors || null,
    etag: googleBook.etag,
    year: volumeInfo.publishedDate ? volumeInfo.publishedDate.split('-')[0] : null
  };
}