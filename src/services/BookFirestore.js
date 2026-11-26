/**
 * BookFirestore.js — data layer with the exact exported signatures the app
 * was built against (addBookToDB, searchBookInDB, getBookById) plus the
 * profile helpers the components use (getUserProfile, createUserProfile,
 * getSavedBooks, isBookSaved, toggleSavedBook, getListedBooks,
 * deleteListedBook).
 *
 * Phase E1: two backends behind those signatures, chosen at runtime —
 *   - Supabase (when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set):
 *     real Postgres tables profiles / listings / saved_books via
 *     @supabase/supabase-js (see ./supabaseClient.js, schema in
 *     ~/workspace/projects/bookhunt-lienzo/supabase/schema.sql).
 *   - Mock (no env vars): the in-memory "tables" in ./mockData.js, so the
 *     demo/preview still runs with zero setup.
 * Callers never change.
 */
import { mockDB, getMockProfile, upsertMockProfile, DEMO_USER } from './mockData.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

// ===========================================================================
// Supabase backend
// ===========================================================================

// DB row (snake_case) → app book object (camelCase). Postgres `numeric`
// comes back as a number; the app expects price as a string like '24.50'.
function rowToBook(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    authors: row.authors || [],
    isbn: row.isbn || '',
    price: Number(row.price ?? 0).toFixed(2),
    currency: row.currency || 'USD',
    condition: row.condition || '',
    description: row.description || '',
    thumbnail: row.thumbnail || '',
    images: row.images || [],
    publisher: row.publisher || '',
    year: row.year || '',
    URL: row.url || '',
    sellerName: row.seller_name || '',
    sellerEmail: row.seller_email || '',
    sellerType: row.seller_type || 'user',
    status: row.status || 'listed',
  };
}

// App book object → DB row (without id/seller_id; caller adds seller_id).
function bookToRow(book) {
  return {
    title: book.title || '',
    authors: Array.isArray(book.authors) ? book.authors : [],
    isbn: book.isbn || '',
    price: Number.parseFloat(book.price) || 0,
    currency: book.currency || 'USD',
    condition: book.condition || '',
    description: book.description || '',
    thumbnail: book.thumbnail || '',
    images: (Array.isArray(book.images) ? book.images : [])
      .map((img) => (typeof img === 'string' ? img : img?.imageUrl || ''))
      .filter(Boolean),
    publisher: book.publisher || '',
    year: book.year != null ? String(book.year) : '',
    url: book.URL || '',
    seller_type: 'user',
    status: 'listed',
  };
}

// profiles row (+ saved_books rows) → the profile shape pages consume.
function rowToProfile(row, savedBooks = []) {
  return {
    id: row.id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email || '',
    booksSaved: savedBooks,
    booksListed: row.books_listed || [],
  };
}

async function fetchProfileRow(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Keep profiles.books_listed in sync with the listings table (best effort —
// getListedBooks reads the listings table itself, so a failure here never
// breaks the listing flow).
async function syncBooksListed(userId) {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('id')
      .eq('seller_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    await supabase
      .from('profiles')
      .update({ books_listed: data.map((row) => row.id) })
      .eq('id', userId);
  } catch (error) {
    console.error('Error syncing books_listed: ', error);
  }
}

const supabaseImpl = {
  async getUserProfile(userId) {
    const row = await fetchProfileRow(userId);
    if (!row) return null;
    const saved = await supabaseImpl.getSavedBooks({ uid: userId, id: userId });
    return rowToProfile(row, saved);
  },

  async createUserProfile(user, { firstName = '', lastName = '' } = {}) {
    const id = user.uid || user.id;
    const { error } = await supabase.from('profiles').upsert(
      {
        id,
        first_name: firstName,
        last_name: lastName,
        email: user.email || '',
      },
      { onConflict: 'id' },
    );
    if (error) throw error;
    return (
      (await supabaseImpl.getUserProfile(id)) || {
        id,
        firstName,
        lastName,
        email: user.email || '',
        booksSaved: [],
        booksListed: [],
      }
    );
  },

  async addBookToDB(bookData, user) {
    try {
      if (!user) throw new Error('addBookToDB requires a signed-in user');
      const userId = user.uid || user.id;
      const profile = await fetchProfileRow(userId);
      const row = {
        ...bookToRow(bookData),
        seller_id: userId,
        seller_name: profile
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : user.displayName || user.email || '',
        seller_email: user.email || '',
      };
      const { data, error } = await supabase
        .from('listings')
        .insert(row)
        .select('id')
        .single();
      if (error) throw error;
      await syncBooksListed(userId);
      console.log('Book added with ID: ', data.id);
      return data.id;
    } catch (error) {
      console.error('Error adding book: ', error);
    }
  },

  async searchBookInDB(searchParams) {
    const { title } = searchParams || {};
    console.log('searchParams: ', searchParams);
    try {
      let query = supabase.from('listings').select('*');
      if (title) query = query.ilike('title', `%${title}%`);
      const { data, error } = await query.order('created_at', {
        ascending: true,
      });
      if (error) throw error;
      const books = (data || []).map(rowToBook);
      console.log('books: ', books);
      return books;
    } catch (error) {
      console.error('Error fetching books: ', error);
      return [];
    }
  },

  async getBookById(itemId) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', itemId)
        .maybeSingle();
      if (error) throw error;
      return rowToBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  },

  async getListedBooks(user) {
    if (!user) return [];
    const userId = user.uid || user.id;
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(rowToBook);
  },

  async deleteListedBook(user, bookId) {
    if (!user) return;
    const userId = user.uid || user.id;
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', bookId)
      .eq('seller_id', userId);
    if (error) throw error;
    await syncBooksListed(userId);
  },

  async getSavedBooks(user) {
    if (!user) return [];
    const userId = user.uid || user.id;
    const { data, error } = await supabase
      .from('saved_books')
      .select('book')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map((row) => row.book);
  },

  async toggleSavedBook(user, book) {
    if (!user || !book) return false;
    const userId = user.uid || user.id;
    const { data: existing, error: findError } = await supabase
      .from('saved_books')
      .select('id')
      .eq('user_id', userId)
      .filter('book->>id', 'eq', book.id)
      .maybeSingle();
    if (findError) throw findError;
    if (existing) {
      const { error } = await supabase
        .from('saved_books')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      return false;
    }
    const { error } = await supabase
      .from('saved_books')
      .insert({ user_id: userId, book });
    if (error) throw error;
    return true;
  },
};

// ===========================================================================
// Mock backend (original Phase 1 implementations, unchanged)
// ===========================================================================

const mockImpl = {
  async getUserProfile(userId) {
    return getMockProfile(userId);
  },

  async createUserProfile(user, { firstName = '', lastName = '' } = {}) {
    const profile = {
      id: user.uid || user.id,
      firstName,
      lastName,
      email: user.email || '',
      booksSaved: [],
      booksListed: [],
    };
    return upsertMockProfile(profile);
  },

  async addBookToDB(bookData, user) {
    try {
      const profile = user ? getMockProfile(user.uid || user.id) : null;
      const id = `listing-mock-${mockDB.nextListingSeq++}`;
      const listing = {
        ...bookData,
        id,
        status: 'listed',
        sellerType: 'user',
        sellerEmail: user?.email || '',
        sellerName: profile
          ? `${profile.firstName} ${profile.lastName}`.trim()
          : user?.displayName || user?.email || '',
      };
      mockDB.listings.push(listing);
      if (profile) {
        profile.booksListed = [...(profile.booksListed || []), id];
      }
      console.log('Book added with ID: ', id);
      return id;
    } catch (error) {
      console.error('Error adding book: ', error);
    }
  },

  async searchBookInDB(searchParams) {
    const { title } = searchParams || {};
    console.log('searchParams: ', searchParams);
    try {
      // The Firestore original filtered with where('title', '==', title) — an
      // exact match that almost never hit in practice. The mock does a
      // case-insensitive substring match so the campus-swap flow is demoable;
      // the Supabase version uses .ilike('title', `%${title}%`).
      const books = title
        ? mockDB.listings.filter((book) =>
            book.title.toLowerCase().includes(String(title).toLowerCase()),
          )
        : [...mockDB.listings];
      console.log('books: ', books);
      return books;
    } catch (error) {
      console.error('Error fetching books: ', error);
      return [];
    }
  },

  async getBookById(itemId) {
    try {
      const book = mockDB.listings.find((listing) => listing.id === itemId);
      return book ? { ...book } : null;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  },

  async getListedBooks(user) {
    if (!user) return [];
    const profile = getMockProfile(user.uid || user.id);
    if (!profile) return [];
    return (profile.booksListed || [])
      .map((id) => mockDB.listings.find((listing) => listing.id === id))
      .filter(Boolean);
  },

  async deleteListedBook(user, bookId) {
    if (!user) return;
    const profile = getMockProfile(user.uid || user.id);
    if (profile) {
      profile.booksListed = (profile.booksListed || []).filter((id) => id !== bookId);
    }
    mockDB.listings = mockDB.listings.filter((listing) => listing.id !== bookId);
  },

  async getSavedBooks(user) {
    if (!user) return [];
    const profile = getMockProfile(user.uid || user.id);
    return profile ? [...(profile.booksSaved || [])] : [];
  },

  async toggleSavedBook(user, book) {
    if (!user || !book) return false;
    const profile = getMockProfile(user.uid || user.id) || upsertMockProfile({
      id: user.uid || user.id || DEMO_USER.uid,
      firstName: '',
      lastName: '',
      email: user.email || '',
      booksSaved: [],
      booksListed: [],
    });
    const exists = (profile.booksSaved || []).some((savedBook) => savedBook.id === book.id);
    profile.booksSaved = exists
      ? profile.booksSaved.filter((savedBook) => savedBook.id !== book.id)
      : [...(profile.booksSaved || []), book];
    return !exists;
  },
};

// ===========================================================================
// Exported API — same signatures, backend chosen by configuration
// ===========================================================================

const impl = isSupabaseConfigured ? supabaseImpl : mockImpl;

export const getUserProfile = impl.getUserProfile;
export const createUserProfile = impl.createUserProfile;
export const addBookToDB = impl.addBookToDB;
export const searchBookInDB = impl.searchBookInDB;
export const getBookById = impl.getBookById;
export const getListedBooks = impl.getListedBooks;
export const deleteListedBook = impl.deleteListedBook;
export const getSavedBooks = impl.getSavedBooks;
export const toggleSavedBook = impl.toggleSavedBook;

/** Toggles a book in the user's saved list. Returns the new saved state. */
export async function isBookSaved(user, bookId) {
  const saved = await getSavedBooks(user);
  return saved.some((savedBook) => savedBook.id === bookId);
}
