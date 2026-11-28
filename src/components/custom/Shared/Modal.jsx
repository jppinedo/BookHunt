import React, { useEffect } from 'react';

/**
 * Modal — U5.1: a small app-level dialog.
 *
 * Lienzo has no Dialog/Modal component (known DS gap — the same gap
 * that forced the app-level Toast system in U4), so this follows the
 * Toast's visual language: warm white card, hairline grid border, the
 * same soft shadow, centered over a dimmed overlay. It closes on
 * Escape and on a click on the overlay itself; the caller owns the
 * open state and whatever its actions do.
 *
 * First used by Profile's Delete Account confirmation (U5.1 moved it
 * out of the inline expanding panel Juan flagged in his screenshot
 * review — a destructive confirm belongs in a modal, not mid-form).
 */
const Modal = ({ open, onClose, title, children }) => {
    useEffect(() => {
        if (!open) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative w-[min(92%,420px)] rounded-2xl border border-pio-grid bg-white p-6 text-center shadow-[0_12px_32px_-6px_rgba(31,36,33,0.14),0_4px_12px_-2px_rgba(31,36,33,0.06)]"
            >
                {title && (
                    <h3 className="font-jakarta text-base font-semibold text-pio-text" style={{ marginTop: 0 }}>
                        {title}
                    </h3>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;
