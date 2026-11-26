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

// --- U3: text hygiene -------------------------------------------------------
// Google Books descriptions arrive with real HTML in them ("<p>…", "<i>…")
// and eBay titles/descriptions carry HTML and entities ("&amp;"). React
// escapes both, so the markup leaked onto cards and detail pages as
// visible text (UX audit finding 4). Strip markup and decode entities
// where the data is produced — here, in the transforms — so every
// consumer downstream gets clean plain text.
const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
};

export function stripHtml(text) {
  if (!text) return '';
  return String(text)
    // Block-level breaks become spaces so stripped paragraphs don't fuse.
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|ul|ol|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => NAMED_ENTITIES[name] ?? match)
    .replace(/\s+/g, ' ')
    .trim();
}

// --- U3: Google Books result de-duplication ---------------------------------
// One Google Books search returns the same book ~6 times (editions and
// reprints with near-identical rows). Rule, applied in result order —
// first occurrence wins. A candidate is dropped as a duplicate of an
// already-kept entry when EITHER:
//   (a) both carry an ISBN and the ISBNs are equal (exact duplicate), OR
//   (b) normalized title AND normalized primary (first) author are equal
//       AND nothing distinguishes them: it is NOT the case that both
//       years are present and different, and NOT the case that both
//       ISBNs are present and different.
// Entries that genuinely differ by year or by ISBN are editions and are
// kept — the result rows now print year + ISBN so users can tell them
// apart. Normalization: lowercase, every run of non-alphanumerics
// collapses to one space, trimmed; ISBNs compared hyphen-free.
const normalizeKeyPart = (value) =>
  String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function dedupeGoogleBooks(books) {
  const kept = [];
  for (const book of books) {
    const isbn = cleanQuery(book.isbn || '');
    const titleKey = normalizeKeyPart(book.title);
    const authorKey = normalizeKeyPart(book.authors?.[0]);
    const year = book.year ? String(book.year) : '';
    const isDuplicate = kept.some((other) => {
      const otherIsbn = cleanQuery(other.isbn || '');
      if (isbn && otherIsbn && isbn === otherIsbn) return true; // (a)
      if (!titleKey) return false;
      if (titleKey !== normalizeKeyPart(other.title)) return false;
      if (authorKey !== normalizeKeyPart(other.authors?.[0])) return false;
      const otherYear = other.year ? String(other.year) : '';
      const yearsDistinguish = Boolean(year && otherYear && year !== otherYear);
      const isbnsDistinguish = Boolean(isbn && otherIsbn && isbn !== otherIsbn);
      return !yearsDistinguish && !isbnsDistinguish; // (b)
    });
    if (!isDuplicate) kept.push(book);
  }
  return kept;
}

// eBay single item to BookHunt Book
export function transformEbayItem(ebayItem) {
  return {
    id: ebayItem.itemId, 
    title: stripHtml(ebayItem.title),
    thumbnail: ebayItem.image?.imageUrl || '',
    images: ebayItem.additionalImages?.map((img) => img.imageUrl) || [], 
    condition: ebayItem.condition, 
    description: stripHtml(ebayItem.shortDescription || ''),
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
    title: stripHtml(item.title),
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
    id: googleBook.id,
    title: volumeInfo.title || '',
    isbn: isbn,
    price: '0.00', 
    currency: 'USD', 
    condition: '', 
    description: stripHtml(volumeInfo.description || ''),
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