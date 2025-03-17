import { db } from '../../firebase.js';
import { isBookCode } from '@utils/search-utils';
import { collection, addDoc, getDocs, query, where, getDoc, doc } from 'firebase/firestore';

export async function addBookToDB(bookData) {
  try {
    const docRef = await addDoc(collection(db, 'books'), bookData);
    console.log('Book added with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding book: ', error);
  }
};

export async function searchBookInDB(searchParams) {
  const { isbn, title, year, author } = searchParams;
  console.log('searchParams: ', searchParams);

  const itemsRef = collection(db, 'books');
  let q = query(itemsRef);

  // if (isbn) q = query(q, where('isbn', '==', isbn));
   if (title) q = query(q, where('title', '==', title));
  // if (year) q = query(q, where('year', '==', year));
  // if (author) q = query(q, where('author', '==', author));

  try {
    const querySnapshot = await getDocs(q);

    const books = [];
    querySnapshot.forEach((doc) => {
      books.push({ id: doc.id, ...doc.data() });
    });
    console.log('books: ', books);
    return books;
  } catch (error) {
    console.error('Error fetching books: ', error);
    return [];
  }
}

export async function getBookById(itemId) {
  try {
    const itemRef = doc(db, 'books', itemId);
    const docSnapshot = await getDoc(itemRef);

    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    throw error;
  }
}
  