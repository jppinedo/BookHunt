import axios from 'axios';
import { mockEbayItems } from './mockData.js';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const backendUrl = import.meta.env.VITE_LOCAL_BACKEND_URL;

// --- Mock fallback -----------------------------------------------------------
// Phase 1 runs with zero secrets: when VITE_BACKEND_URL is not configured
// (or the backend errors), serve mock eBay-shaped data instead. The shapes
// match the real Browse API payloads the utils expect
// (formatEbayBook / transformEbayItem).
function mockSearch(query, limit = 20, offset = 0) {
  const needle = String(query || '')
    .replace(/^(isbn|title|year|author):/gi, '')
    .split('+')[0]
    .trim()
    .toLowerCase();
  const matches = needle
    ? mockEbayItems.filter((item) => item.title.toLowerCase().includes(needle))
    : mockEbayItems;
  const page = matches.slice(offset, offset + limit);
  return { itemSummaries: page, total: matches.length };
}

function mockGetItem(itemId) {
  const item = mockEbayItems.find((i) => i.itemId === itemId);
  if (!item) throw new Error(`Mock eBay item not found: ${itemId}`);
  return item;
}

export const getEbayItem = async (itemId) => {
  if (!backendUrl) return mockGetItem(itemId);
  try {
    const response = await axios.get(`${backendUrl}/api/ebay/item/${itemId}`);
    console.log('eBay Search Result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting item from eBay, falling back to mock data:', error.response?.data || error.message);
    return mockGetItem(itemId);
  }
};

export const searchEbay = async (query, limit, offset) => {
  if (!backendUrl) return mockSearch(query, limit, offset);
  try {
    const response = await axios.get(`${backendUrl}/api/ebay/search`, {
      params: { query, limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching eBay, falling back to mock data:', error.response?.data || error.message);
    return mockSearch(query, limit, offset);
  }
};
