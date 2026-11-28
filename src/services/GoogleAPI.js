import axios from 'axios';
import { isBookCode, cleanQuery, formatGoogleBook, dedupeGoogleBooks } from '../utils/search-utils';
import { mockGoogleVolumes } from './mockData.js';

// NOTE (typo, kept for compatibility): the original code read the Google
// Books key from a MISSPELLED env var, VITE_GOOLE_BOOKS_KEY ("GOOLE").
// We support the corrected spelling first and fall back to the legacy one,
// so an existing .env keeps working. See .env.example.
const API_KEY =
  import.meta.env.VITE_GOOGLE_BOOKS_KEY || import.meta.env.VITE_GOOLE_BOOKS_KEY;
const GOOGLE_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const hasKey = Boolean(API_KEY);

// --- Mock fallback (no key configured): search the local mock catalog. -----
function mockSearch(query) {
  const isISBN = isBookCode(query);
  const needle = isISBN ? cleanQuery(query) : String(query || '').toLowerCase();
  const items = mockGoogleVolumes.filter((item) => {
    if (isISBN) {
      return item.volumeInfo.industryIdentifiers.some(
        (id) => cleanQuery(id.identifier) === needle,
      );
    }
    return (
      item.volumeInfo.title.toLowerCase().includes(needle) ||
      (item.volumeInfo.authors || []).some((a) => a.toLowerCase().includes(needle))
    );
  });
  return items.map((item) => formatGoogleBook(item));
}

function mockGetById(volumeId) {
  const item = mockGoogleVolumes.find((v) => v.id === volumeId);
  if (item) return item;
  // Unknown id (e.g. a listing id): synthesize a volume-shaped object so the
  // New Book flow still renders instead of throwing.
  return {
    id: volumeId,
    etag: `mock-etag-${volumeId}`,
    volumeInfo: {
      title: 'Unknown Book',
      authors: [],
      description: '',
      publisher: 'N/A',
      publishedDate: '',
      industryIdentifiers: [],
      imageLinks: {},
    },
  };
}

export async function getGoogleBookById(volumeId) {
  if (!hasKey) return mockGetById(volumeId);
  const url = `${GOOGLE_BASE_URL}/${volumeId}`;
  try {
    const response = await axios.get(url, { params: { key: API_KEY } });
    return response.data;
  } catch (error) {
    console.error('Error fetching book, falling back to mock data:', error);
    return mockGetById(volumeId);
  }
}

export async function searchGoogleBooks(query) {
  // U3: every path (live, no-key mock, error fallback) goes through
  // dedupeGoogleBooks — the same book comes back ~6× per search as
  // near-identical edition rows. The result count SearchPage shows in
  // the breadcrumb bar is this list's length, i.e. post-dedupe.
  if (!hasKey) return dedupeGoogleBooks(mockSearch(query));
  const isISBN = isBookCode(query);
  try {
    const response = await axios.get(GOOGLE_BASE_URL, {
      params: {
        q: isISBN ? cleanQuery(query) : `intitle:${query}`, // Search by title
        orderBy: 'relevance', // Sort by relevance
        maxResults: 20,
        key: API_KEY,
      },
    });
    if (!response.data.items?.length) return dedupeGoogleBooks(mockSearch(query));
    return dedupeGoogleBooks(response.data.items.map((item) => formatGoogleBook(item)));
  } catch (error) {
    console.error('Error fetching books, falling back to mock data:', error);
    return dedupeGoogleBooks(mockSearch(query));
  }
}
