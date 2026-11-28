import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@state/AuthContext.jsx";
import { SearchContext } from "@state/SearchContext.jsx";
import { getSavedBooks } from "@services/BookFirestore";
import BookCard from "@custom/Books/BookCard.jsx";
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';
import { Title } from "@jppinedo/lienzo";
import {useNavigate} from "react-router";

/** BooksSavedPage — was Firebase Firestore userInfo doc + MUI Container/Box.
 *  Now the mock service layer (getSavedBooks) + Lienzo Title. */
const BooksSavedPage = () => {
    const { user } = useContext(AuthContext);
    // U7: the breadcrumb's Home crumb resets the search session —
    // Home means the clean home view, not the preserved results.
    const { resetSearch } = useContext(SearchContext);
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
        <div className="page-shell">
            <div className="page-heading">
                <Title size="xxl" thikness="bold" fontFamily="playfair" className="my-6 page-title">Saved Books</Title>
            </div>

            {/* U1.1: breadcrumb bar below the page title (Home / Saved Books). */}
            <BreadcrumbNav
                crumbs={[
                    { label: 'Home', to: '/search', onClick: resetSearch },
                    { label: 'Saved Books', current: true },
                ]}
                fallback="/search"
                className="mb-4"
            />

            {savedBooks.length > 0 ? (
                // U7: shared .card-grid (U8 name) — a lone saved card
                // now sits flush left at cell width instead of floating
                // centered at its content width.
                <div className="card-grid" style={{ paddingBottom: '5rem' }}>
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
