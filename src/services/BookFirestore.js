import { db } from '../../firebase.js';
import { isBookCode } from '@utils/search-utils';
import { collection, addDoc } from 'firebase/firestore';

export async function addBookToDB(bookData) {
  try {
    const docRef = await addDoc(collection(db, 'books'), bookData);
    console.log('Book added with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding book: ', error);
  }
};

export async function searchBookInDB(query) {
  const isISBN = isBookCode(query);
  const querySnapshot = await getDocs(collection(db, "books"));
  querySnapshot.forEach((book) => {
    console.log(`${book.id} => ${doc.data()}`);
  });
}
  