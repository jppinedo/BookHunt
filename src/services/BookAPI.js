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

    console.log(response.data.items);

    const books = response.data.items.map((item) => ({
      id: item.id,
      etag: item.etag,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || null,
      description: item.volumeInfo.description || 'No description available.',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196',
      isbn: item.volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier || null,
      publisher: item.volumeInfo?.publisher || 'N/A',
      year: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.split('-')[0] : null
    }));

    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

