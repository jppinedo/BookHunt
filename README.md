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

- **Frontend:** The `BookHunt` frontend is a React-based web application built with Vite. It serves as the user interface for the BookHunt platform, allowing users to search for books, compare prices, and manage their accounts. The frontend communicates with external APIs (Google Books API, eBay API) and a custom backend (`BookHuntServer`) to provide a seamless experience.
- **Backend:** A Node Vercel simple backend to call eBay API for a token and searches; Google Books API calls are made directly from the client side.
- **Data Storage:** Firebase is used to store user data (e.g., login information) and references to books posted in the Campus Swap marketplace.

The project is organized as follows:

```
src/
├── assets/               # Static assets like images
├── components/           # Reusable React components
│   ├── custom/           # Custom components (e.g., BookCard, SearchInput)
│   ├── pages/            # Page-level components (e.g., LoginPage, ProfilePage)
├── services/             # API service files for external and backend communication
├── state/                # Context providers for global state management
├── utils/                # Utility functions (e.g., search-utils.js)
├── App.jsx               # Main application component
├── main.jsx              # Entry point for the React app
├── index.css             # Global CSS styles
```

## Key Libraries Used

- **React**: Core library for building the user interface.
- **Vite**: Development server and build tool for fast development.
- **Material-UI (MUI)**: For pre-styled React components and icons.
- **Axios**: For making HTTP requests to APIs.
- **Firebase**: For user authentication and data storage.
- **React Router**: For client-side routing.
- **React Infinite Scroll Component**: For implementing infinite scrolling in lists.

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

## Setup Instructions
### Prerequisites
- **Node.js**: Version 14.x or higher. Download from [nodejs.org](https://nodejs.org/).
- **npm**: Comes bundled with Node.js. Verify installation with `npm -v`.

### Installation
1. **Clone the Repository**:
   ```
   git clone https://github.com/jppinedo/BookHunt.git
   cd BookHunt
   ```

2. **Install Dependencies**: Run the following command to install the required libraries:
   ```
   npm install
   ```

   Configure Environment Variables: Create a `.env` file in the root directory and add the necessary environment variables. Refer to the `.env` file for values like `VITE_BACKEND_URL` and `VITE_FIREBASE_APIKEY`.

### Running the Project
1. **Start the Development Server**: Use the following command to start the Vite development server:
   ```
   npm run dev
   ```   
   By default, the app will be available at `http://localhost:5173`.

2. **Build for Production**: To create a production build, run:
   ```
   npm run build
   ```
3. ***Preview the Build***: To preview the production build locally:
   ```
   npm run preview
   ```

## API Services
The `services` folder contains modules for interacting with external APIs and the backend:

- `GoogleAPI.js`: Handles requests to the Google Books API.
- `EbayAPI.js`: Communicates with the backend to fetch eBay data.
- `BookFirestore.js`: Manages Firebase operations for user data and book listings.

