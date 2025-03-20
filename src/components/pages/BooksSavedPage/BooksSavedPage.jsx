import React, { useContext, useEffect, useState } from "react";
import { app } from "@/../firebase.js";
import { AuthContext } from "@state/AuthContext.jsx";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import BookCard from "@custom/Books/BookCard.jsx";
import {Container} from "@mui/material";
import {useNavigate} from "react-router";

const BooksSavedPage = () => {
    const { user } = useContext(AuthContext);
    const db = getFirestore(app);
    const [savedBooks, setSavedBooks] = useState([])

    const navigate = useNavigate();


    useEffect(() => {
        if (!user) return;

        const fetchSavedBooks = async () => {
            try {
                const docRef = doc(db, "userInfo", user.uid);
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const booksSaved = docSnap.data().booksSaved || [];
                    setSavedBooks(booksSaved);
                }
            }
            catch (error) {
                console.error("Error fetching saved books!", error);
            }
        }

        fetchSavedBooks();
    }, [user]);

    const handleBookClick = (item) => {
        navigate(`/book/${item.sellerType}/${item.id}`);
    }

    return (
        <Container>
            <h2>Saved Books</h2>

            {savedBooks.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingBottom: '15rem' }}>
                    {savedBooks.map((item, index) => (
                        <BookCard key={`${item.id}-${index}`} book={item} type="grid" onCardClick={handleBookClick} />
                    ))}
                </div>
            ) : (
                <p>No saved books found.</p>
            )}
        </Container>
    )
}

export default BooksSavedPage;