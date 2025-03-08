import axios from 'axios';
import { isBookCode, cleanQuery } from '@utils/search-utils';

const API_KEY = import.meta.env.VITE_GOOLE_BOOKS_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query) {
  const isISBN = isBookCode(query);
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: isISBN ? cleanQuery(query) : `intitle:${query}`, // Search by title`
        orderBy: 'relevance',   // Sort by relevance
        maxResults: 20,   
        key: API_KEY,
      },
    });

    const books = response.data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
      description: item.volumeInfo.description || 'No description available.',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196', // Fallback image
      isbn: item.volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier || 'N/A',
    }));

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

