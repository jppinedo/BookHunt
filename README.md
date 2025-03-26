# BookHunt

BookHunt is a web application designed to help college students find affordable textbooks for their courses by leveraging two external APIs: Google Books API and eBay Finding API. The app provides a seamless experience for users to search for books, compare prices, and participate in a local marketplace for used textbooks.

## Core Features

1. **Book Search and Identification:**
   - Users can search for textbooks by title or ISBN.
   - The app uses the Google Books API to fetch book details such as title, author, cover image, and publication information.

2. **Price Comparison:**
   - Once a book is identified, the app queries the eBay Finding API to retrieve a list of available listings for that book.
   - Results are sorted by price (lowest to highest), allowing users to find the best deals on both new and used copies.

3. **Campus Swap Marketplace:**
   - In addition to eBay listings, the app includes a local marketplace where students can buy and sell used textbooks.
   - This feature is powered by Firebase, which handles user authentication and stores references to books posted by students.

## Technical Architecture

- **Frontend:** Built with React JS, the app provides a responsive and intuitive user interface.
- **Backend:** A Node Vercel simple backend to call eBay API for a token and searches; Google Books API calls are made directly from the client side.
- **Data Storage:** Firebase is used to store user data (e.g., login information) and references to books posted in the Campus Swap marketplace.

## API Integration

1. **Google Books API:**
   - URL: [https://www.googleapis.com/books/v1/volumes](https://www.googleapis.com/books/v1/volumes)
   - Used to search for books by title or ISBN.
   - Returns metadata such as title, author, and cover image.
   - When a user clicks any of these results, they navigate to the results page with the query in the URL.

2. **eBay Finding API:**
   - URL: [https://api.ebay.com/buy/browse/v1/item_summary/search](https://api.ebay.com/buy/browse/v1/item_summary/search)
   - Queried with the book title, ISBN, and all Google Books API data that narrows the retrieval of listings on eBay.
   - Results include price, condition (new/used), seller rating, and a link to the eBay listing.

3. **Firebase:**
   - Handles user authentication (login/signup).
   - Stores data for the Campus Swap feature, including book details and user contact information.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
