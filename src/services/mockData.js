/**
 * Mock backend for Phase 1 — shaped like the future Supabase schema so the
 * service layer can be swapped for a real Supabase client later without
 * touching pages/components.
 *
 * Future Supabase tables:
 *   profiles    (id, first_name, last_name, email)
 *   listings    (id, seller_id, title, authors, isbn, price, currency,
 *                condition, description, thumbnail, status, seller_name,
 *                seller_email, seller_type)
 *   saved_books (user_id, book)  — one row per saved book, `book` is the
 *                BookHunt book object (was: userInfo/{uid}.booksSaved array)
 *   profiles.books_listed (uuid[]) — listing ids owned by the user
 *                (was: userInfo/{uid}.booksListed array)
 *
 * Everything is in-memory and seeded on load. No network, no secrets.
 */

const cover = (title) =>
  `https://placehold.co/200x300/e8eef4/33506e?text=${encodeURIComponent(title)}`;

// ---------------------------------------------------------------------------
// Google Books catalog — kept in RAW Google Books API volume shape so the
// existing formatGoogleBook() util works unchanged on mock results.
// ---------------------------------------------------------------------------
const volume = ({ id, title, authors, isbn, year, publisher, description }) => ({
  id,
  etag: `mock-etag-${id}`,
  volumeInfo: {
    title,
    authors,
    description,
    publisher,
    publishedDate: String(year),
    industryIdentifiers: [{ type: 'ISBN_13', identifier: isbn }],
    imageLinks: { thumbnail: cover(title) },
  },
});

export const mockGoogleVolumes = [
  volume({
    id: 'gb-clean-code',
    title: 'Clean Code',
    authors: ['Robert C. Martin'],
    isbn: '9780132350884',
    year: 2008,
    publisher: 'Prentice Hall',
    description:
      'A handbook of agile software craftsmanship. Even bad code can function, but code that is not clean can bring a development organization to its knees.',
  }),
  volume({
    id: 'gb-design-of-everyday-things',
    title: 'The Design of Everyday Things',
    authors: ['Don Norman'],
    isbn: '9780465050659',
    year: 2013,
    publisher: 'Basic Books',
    description:
      'The ultimate guide to human-centered design, showing that good design is possible and that the failure of everyday objects is a failure of design, not of people.',
  }),
  volume({
    id: 'gb-intro-to-algorithms',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
    isbn: '9780262033848',
    year: 2009,
    publisher: 'MIT Press',
    description:
      'The leading textbook on algorithms, used in courses worldwide. Covers sorting, data structures, graph algorithms, and more in rigorous but accessible detail.',
  }),
  volume({
    id: 'gb-design-patterns',
    title: 'Design Patterns',
    authors: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'],
    isbn: '9780201633610',
    year: 1994,
    publisher: 'Addison-Wesley',
    description:
      'Elements of reusable object-oriented software. The classic Gang of Four catalog of 23 design patterns for flexible, elegant software design.',
  }),
  volume({
    id: 'gb-refactoring',
    title: 'Refactoring',
    authors: ['Martin Fowler'],
    isbn: '9780134757599',
    year: 2018,
    publisher: 'Addison-Wesley',
    description:
      'Improving the design of existing code. The fully revised second edition, with a catalog of refactorings illustrated in JavaScript.',
  }),
  volume({
    id: 'gb-dont-make-me-think',
    title: "Don't Make Me Think",
    authors: ['Steve Krug'],
    isbn: '9780321965516',
    year: 2014,
    publisher: 'New Riders',
    description:
      'A common-sense approach to web and mobile usability. Short, funny, and relentlessly practical guidance on designing interfaces people can actually use.',
  }),
  volume({
    id: 'gb-js-good-parts',
    title: 'JavaScript: The Good Parts',
    authors: ['Douglas Crockford'],
    isbn: '9780596517748',
    year: 2008,
    publisher: "O'Reilly Media",
    description:
      'An authoritative look at the elegant, reliable subset of JavaScript hiding inside the messy language most people inherited.',
  }),
  volume({
    id: 'gb-thinking-in-systems',
    title: 'Thinking in Systems',
    authors: ['Donella H. Meadows'],
    isbn: '9781603580557',
    year: 2008,
    publisher: 'Chelsea Green',
    description:
      'A primer on systems thinking: stocks, flows, feedback loops, and the leverage points that change how complex systems behave.',
  }),
];

// ---------------------------------------------------------------------------
// listings table (seller_type: 'user') — BookHunt book objects.
// ---------------------------------------------------------------------------
export const mockListings = [
  {
    id: 'listing-clean-code',
    title: 'Clean Code',
    authors: ['Robert C. Martin'],
    isbn: '9780132350884',
    price: '24.50',
    currency: 'USD',
    condition: 'Good',
    description:
      'A handbook of agile software craftsmanship. Light highlighting in chapters 1–3, otherwise clean.',
    thumbnail: cover('Clean Code'),
    images: [],
    sellerName: 'Alex Campus',
    sellerEmail: 'alex@example.edu',
    sellerType: 'user',
    URL: '',
    publisher: 'Prentice Hall',
    year: '2008',
    status: 'listed',
  },
  {
    id: 'listing-design-everyday',
    title: 'The Design of Everyday Things',
    authors: ['Don Norman'],
    isbn: '9780465050659',
    price: '18.00',
    currency: 'USD',
    condition: 'Very good',
    description:
      'The ultimate guide to human-centered design. Revised and expanded edition, no markings.',
    thumbnail: cover('The Design of Everyday Things'),
    images: [],
    sellerName: 'Maya Student',
    sellerEmail: 'maya@example.edu',
    sellerType: 'user',
    URL: '',
    publisher: 'Basic Books',
    year: '2013',
    status: 'listed',
  },
  {
    id: 'listing-clrs',
    title: 'Introduction to Algorithms',
    authors: ['Thomas H. Cormen', 'Charles E. Leiserson', 'Ronald L. Rivest', 'Clifford Stein'],
    isbn: '9780262033848',
    price: '42.00',
    currency: 'USD',
    condition: 'Readable',
    description:
      'Third edition. Spine wear and some pencil notes, all pages intact. Listed by the demo user.',
    thumbnail: cover('Introduction to Algorithms'),
    images: [],
    sellerName: 'Demo Reader',
    sellerEmail: 'demo@bookhunt.local',
    sellerType: 'user',
    URL: '',
    publisher: 'MIT Press',
    year: '2009',
    status: 'listed',
  },
];

// ---------------------------------------------------------------------------
// eBay mock items — kept in RAW eBay Browse API shape so the existing
// formatEbayBook() / transformEbayItem() utils work unchanged.
// ---------------------------------------------------------------------------
const ebayItem = ({ id, title, price, condition, seller }) => ({
  itemId: id,
  title,
  image: { imageUrl: cover(title) },
  additionalImages: [],
  condition,
  shortDescription: `Mock eBay listing for "${title}" (Phase 1 mock data — no eBay backend configured).`,
  itemWebUrl: 'https://www.ebay.com/',
  seller: { username: seller },
  price: { value: price, currency: 'USD' },
});

export const mockEbayItems = [
  ebayItem({ id: 'ebay-clean-code-1', title: 'Clean Code by Robert C. Martin', price: '27.99', condition: 'Used - Good', seller: 'textbook_deals' }),
  ebayItem({ id: 'ebay-clean-code-2', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', price: '31.50', condition: 'Used - Very Good', seller: 'campus_books' }),
  ebayItem({ id: 'ebay-design-1', title: 'The Design of Everyday Things: Revised and Expanded Edition', price: '15.25', condition: 'Used - Good', seller: 'textbook_deals' }),
  ebayItem({ id: 'ebay-clrs-1', title: 'Introduction to Algorithms, Third Edition', price: '55.00', condition: 'Used - Acceptable', seller: 'uni_bookstore' }),
  ebayItem({ id: 'ebay-refactoring-1', title: 'Refactoring: Improving the Design of Existing Code (2nd Edition)', price: '38.75', condition: 'Used - Very Good', seller: 'campus_books' }),
  ebayItem({ id: 'ebay-gof-1', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', price: '33.20', condition: 'Used - Good', seller: 'textbook_deals' }),
];

// ---------------------------------------------------------------------------
// profiles + auth user (Supabase Auth shape: user.id / user.email)
// ---------------------------------------------------------------------------
export const DEMO_USER = {
  uid: 'demo-user-1', // kept for compatibility with code written against Firebase Auth (user.uid)
  id: 'demo-user-1',
  email: 'demo@bookhunt.local',
  displayName: 'Demo Reader',
};

export const mockProfile = {
  id: DEMO_USER.uid,
  firstName: 'Demo',
  lastName: 'Reader',
  email: DEMO_USER.email,
  // saved_books rows (book objects), seeded with one saved book:
  booksSaved: [
    {
      id: 'gb-design-patterns',
      title: 'Design Patterns',
      authors: ['Erich Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides'],
      isbn: '9780201633610',
      price: '0.00',
      currency: 'USD',
      condition: '',
      description:
        'Elements of reusable object-oriented software. The classic Gang of Four catalog of 23 design patterns.',
      thumbnail: cover('Design Patterns'),
      images: [],
      sellerName: '',
      sellerEmail: '',
      sellerType: 'user',
      URL: '',
      publisher: 'Addison-Wesley',
      year: '1994',
      etag: 'mock-etag-gb-design-patterns',
    },
  ],
  // listings owned by the demo user:
  booksListed: ['listing-clrs'],
};

/**
 * The in-memory "database". One module-level instance, mutated by the
 * service layer — this is the object a real Supabase client replaces later.
 */
export const mockDB = {
  profiles: new Map([[DEMO_USER.uid, structuredClone(mockProfile)]]),
  listings: structuredClone(mockListings),
  nextListingSeq: 1,
};

export function getMockProfile(userId) {
  return mockDB.profiles.get(userId) || null;
}

export function upsertMockProfile(profile) {
  mockDB.profiles.set(profile.id, profile);
  return profile;
}
