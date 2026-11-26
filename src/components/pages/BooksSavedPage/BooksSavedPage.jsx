import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@state/AuthContext.jsx";
import { getSavedBooks } from "@services/BookFirestore";
import BookCard from "@custom/Books/BookCard.jsx";
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';
import { Title } from "@jppinedo/lienzo";
import {useNavigate} from "react-router";

/** BooksSavedPage — was Firebase Firestore userInfo doc + MUI Container/Box.
 *  Now the mock service layer (getSavedBooks) + Lienzo Title. */
const BooksSavedPage = () => {
    const { user } = useContext(AuthContext);
    const [savedBooks, setSavedBooks] = useState([])

    const navigate = useNavigate();


    useEffect(() => {
        if (!user) return;

        const fetchSavedBooks = async () => {
            try {
                setSavedBooks(await getSavedBooks(user));
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
        <div className="w-full max-w-[1200px] mx-auto px-4 box-border">
            <div className="page-heading">
                <Title size="xxl" thikness="bold" fontFamily="playfair" className="my-6">Saved Books</Title>
            </div>

            {/* U1.1: breadcrumb bar below the page title (Home / Saved Books). */}
            <BreadcrumbNav
                crumbs={[
                    { label: 'Home', to: '/search' },
                    { label: 'Saved Books', current: true },
                ]}
                fallback="/search"
                className="mb-4"
            />

            {savedBooks.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingBottom: '5rem', maxWidth: '1140px', margin: '0 auto', justifyContent: 'center'}}>
                    {savedBooks.map((item, index) => (
                        <BookCard key={`${item.id}-${index}`} book={item} type="grid" onCardClick={handleBookClick} />
                    ))}
                </div>
            ) : (
                <p className="on-bg-text">No saved books found.</p>
            )}
        </div>
    )
}

export default BooksSavedPage;
