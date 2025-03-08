import axios from 'axios';

export const getEbayToken = async () => {
  const clientId = import.meta.env.VITE_EBAY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_EBAY_CLIENT_SECRET;

  const url = 'https://cors-anywhere.herokuapp.com//https://api.ebay.com/identity/v1/oauth2/token';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('scope', 'https://api.ebay.com/oauth/api_scope');

  try {
    const response = await axios.post(url, data, {
      headers,
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching eBay token:', error.response?.data || error.message);
    throw error;
  }
};
