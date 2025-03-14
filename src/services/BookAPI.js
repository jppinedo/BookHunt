import axios from 'axios';
import { isBookCode, cleanQuery, formatGoogleBook } from '../utils/search-utils';

const API_KEY = import.meta.env.VITE_GOOLE_BOOKS_KEY;
const EBAY_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
// const BD_URL = '';

export async function searchGoogleBooks(query) {
  const isISBN = isBookCode(query);
  try {
    const response = await axios.get(EBAY_BASE_URL, {
      params: {
        q: isISBN ? cleanQuery(query) : `intitle:${query}`, // Search by title`
        orderBy: 'relevance',   // Sort by relevance
        maxResults: 20,
        key: API_KEY,
      },
    });
    const books = response.data.items.map((item) => formatGoogleBook(item));

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}
