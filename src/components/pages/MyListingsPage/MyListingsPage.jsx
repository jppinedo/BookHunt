import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Title } from "@jppinedo/lienzo";
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { SearchContext } from "@state/SearchContext";
import { getListedBooks } from "@services/BookFirestore";
import BookCardSeller from "@custom/Books/BookCardSeller.jsx";
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';

/**
 * MyListingsPage — U9: the user's listings used to be a tab inside
 * ProfilePage, squeezed into that page's narrow (500px) form card.
 * A list of items doesn't belong in a form container, so it is now
 * its own page on the wide .page-shell, structured like the other
 * list pages (BooksSavedPage): Playfair title, breadcrumb bar, and
 * the shared .card-grid (U8) of floating cards. The cards are the
 * same BookCardSeller the tab rendered, so card content and the
 * click-through to the listing editor (/bookConfig) are unchanged.
 *
 * The breadcrumb bar's right side (the `end` slot, where the results
 * page puts its count) carries a compact "Sell a book" button —
 * selling gets a visible entry point on the page that manages
 * listings, not only the ☰ menu item.
 */
const MyListingsPage = () => {
    const { user } = useContext(AuthContext);
    const { onShowError } = useContext(AppContext);
    // U7: the breadcrumb's Home crumb resets the search session.
    const { resetSearch } = useContext(SearchContext);
    const navigate = useNavigate();

    const [listedBooks, setListedBooks] = useState([]);

    // Set listed books array from the listings table (same fetch the
    // Profile tab used).
    useEffect(() => {
        if (!user) return;

        const fetchListedBooks = async () => {
            try {
                setListedBooks(await getListedBooks(user));
            }
            catch (error) {
                onShowError(error);
            }
        }

        fetchListedBooks();
    }, [user]);

    const handleBookClick = (item) => {
        navigate(`/bookConfig/${item.sellerType}/${item.id}`);
    }

    if (!user) return null;

    return (
        <div className="page-shell">
            <div className="page-heading">
                <Title size="xxl" thikness="bold" fontFamily="playfair" className="my-6 page-title">My Listings</Title>
            </div>

            <BreadcrumbNav
                crumbs={[
                    { label: 'Home', to: '/search', onClick: resetSearch },
                    { label: 'My Listings', current: true },
                ]}
                fallback="/search"
                className="mb-4"
                end={(
                    <Button
                        label="Sell a book"
                        type="green"
                        size="sm"
                        onClick={() => navigate('/sell')}
                    />
                )}
            />

            {listedBooks.length > 0 ? (
                <div className="card-grid" style={{ paddingBottom: '5rem' }}>
                    {listedBooks.map((item, index) => (
                        <BookCardSeller
                            key={`${item.id}-${index}`}
                            book={item}
                            type="grid"
                            onCardClick={handleBookClick}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ paddingBottom: '5rem' }}>
                    <p className="on-bg-text">You haven't listed any books yet.</p>
                    <Button
                        label="Sell a book"
                        type="green"
                        onClick={() => navigate('/sell')}
                    />
                </div>
            )}
        </div>
    );
};

export default MyListingsPage;
