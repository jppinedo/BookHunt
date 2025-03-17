import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const backendUrl = import.meta.env.VITE_LOCAL_BACKEND_URL;

export const getEbayItem = async (itemId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/ebay/item/${itemId}`);
    console.log('eBay Search Result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting item from eBay:', error.response?.data || error.message);
    throw error;
  } 
};

export const searchEbay = async (query, limit, offset) => {
  try {
    const response = await axios.get(`${backendUrl}/api/ebay/search`, {
      params: { query, limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching eBay:', error.response?.data || error.message);
    throw error;
  }
};