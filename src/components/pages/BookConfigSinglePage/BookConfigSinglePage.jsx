import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { getEbayItem } from "@services/EbayAPI";
import { getBookById, updateListing } from "@services/BookFirestore";
import { Button, Card, Input, Label, Spinner, Title } from '@jppinedo/lienzo';
import { transformEbayItem } from "@utils/search-utils";
import { isValidUSD, formatUSD } from "@utils/common-utils";
import { AuthContext } from "@state/AuthContext";
import { useToast } from '@state/ToastContext';
import BookCardSeller from "@custom/Books/BookCardSeller.jsx";
import { CONDITION_OPTIONS } from "@custom/Books/BookAddForm.jsx";


/**
 * BookConfigSinglePage — the owner's view of one of their listings,
 * reached from Profile → Book Listings (and, since U4, from the Edit
 * action on the buyer-side detail view). Until U4 it was read-only
 * apart from Delete: the audit's "own listing has Delete but no Edit".
 * The owner can now edit Price and Condition inline (data layer:
 * updateListing — an owner-scoped update on the listings table, the
 * same pattern deleteListedBook already used). eBay items and other
 * users' listings never get the editor: it renders only when the
 * signed-in user's email matches the listing's sellerEmail.
 */
const BookConfigSinglePage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [ currentBook, setCurrentBook ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  const [ editing, setEditing ] = useState(false);
  const [ editPrice, setEditPrice ] = useState('');
  const [ editCondition, setEditCondition ] = useState('');
  const [ editPriceError, setEditPriceError ] = useState('');
  const [ editError, setEditError ] = useState('');
  const [ saving, setSaving ] = useState(false);

  useEffect(() => {
    const callEbayItem  = async ()  =>  {
      const res = await getEbayItem(id);
      return res;
    }

    const callFirestoreItem = async () => {
      const res = await getBookById(id);
      return res;
    }

    if(type === 'eBay' && loading) {
      callEbayItem().then((result) => {
        setCurrentBook(transformEbayItem(result));
        setLoading(false);
      }).catch(() => setLoading(false));
    } else if(type === 'user' && loading) {
      callFirestoreItem().then((result) => {
        setCurrentBook(result);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, []);

  const isOwnListing = Boolean(
    currentBook?.sellerType === 'user' &&
    user?.email && currentBook?.sellerEmail &&
    currentBook.sellerEmail.toLowerCase() === user.email.toLowerCase()
  );

  const startEditing = () => {
    setEditPrice(currentBook.price || '');
    setEditCondition(currentBook.condition || '');
    setEditPriceError('');
    setEditError('');
    setEditing(true);
  };

  const handleEditPriceBlur = () => {
    const value = editPrice.trim();
    if (value && isValidUSD(value)) {
      setEditPrice(formatUSD(value));
      setEditPriceError('');
    } else {
      setEditPriceError(value ? 'Enter a price above $0.00' : 'Price is required');
    }
  };

  const canSave = isValidUSD(editPrice) && Boolean(editCondition) && !saving;

  const saveEdits = async () => {
    if (!canSave) {
      if (!isValidUSD(editPrice)) {
        setEditPriceError(editPrice.trim() ? 'Enter a price above $0.00' : 'Price is required');
      }
      if (!editCondition) setEditError('Condition is required');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      await updateListing(user, currentBook.id, {
        price: formatUSD(editPrice),
        condition: editCondition,
      });
      showToast('Listing updated');
      navigate('/profile', { state: { tab: 'listings' } });
    } catch (error) {
      console.error('Error updating listing: ', error);
      setEditError("Couldn't save your changes. Check your connection and try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40">
         <Spinner size="48px" thickness="6px" />
      </div>
    );
  }
  if (!currentBook) {
    return (
      <div className="page-shell-narrow pb-20">
        <p className="on-bg-text">Book not found.</p>
      </div>
    );
  }
  return (
      <div className="page-shell-narrow pb-20">
        <BookCardSeller book={currentBook} type="view" isSingle={true} />
        {isOwnListing && !editing && (
          <div className="mt-4">
            <Button label="Edit listing" onClick={startEditing} />
          </div>
        )}
        {isOwnListing && editing && (
          <Card className="min-w-[300px] w-full text-left mt-4">
            <Title size="sm" color="coral">Edit listing</Title>

            {/* Lienzo Input has no onBlur — wrapper catches it, same
                pattern as BookAddForm. */}
            <div className="mt-4" onBlur={handleEditPriceBlur}>
              <Input
                label="Price"
                placeholder="0.00"
                value={editPrice}
                onChange={(e) => { setEditPrice(e.target.value); if (editPriceError) setEditPriceError(''); }}
                hint={editPriceError || `Amount in ${currentBook.currency || 'USD'} ($)`}
              />
            </div>

            <div className="mt-4">
              <Label text="Condition" />
              <select
                aria-label="Book condition"
                value={editCondition}
                onChange={(e) => { setEditCondition(e.target.value); setEditError(''); }}
                required
                className="w-full mt-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-base"
              >
                <option value="" disabled>Select an option</option>
                {CONDITION_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {editError && (
              <p role="alert" className="mt-4 text-sm font-medium text-pio-coral-dark">{editError}</p>
            )}

            <div className="mt-4 flex items-center gap-3">
              {/* Lienzo Button has no disabled prop — wrapper pattern,
                  same as BookAddForm's submit. */}
              <div className={canSave ? '' : 'pointer-events-none opacity-50'} aria-disabled={!canSave}>
                <Button label={saving ? 'Saving…' : 'Save changes'} onClick={saveEdits} />
              </div>
              <Button label="Cancel" fill="outline" onClick={() => setEditing(false)} />
            </div>
          </Card>
        )}
      </div>
  )
}

export default BookConfigSinglePage;
