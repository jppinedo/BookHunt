import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle } from 'react-feather';

export const ToastContext = createContext({ toasts: [], showToast: () => {}, dismissToast: () => {} });

export const useToast = () => useContext(ToastContext);

/**
 * Toasts — U4. The audit's feedback finding: saving a book, deleting a
 * listing, and (until U4) posting a listing all happened with NO visible
 * confirmation. Lienzo has no Toast/notification component (DS gap), so
 * this is a small app-level system in the D1/D2 visual language: warm
 * white card, hairline grid border, the same soft shadow as the HubNav
 * pill, a coral check icon. Toasts stack just above the floating bottom
 * nav, auto-dismiss after ~3.5s, and a tap on a toast dismisses it
 * early. An optional action (e.g. "View" on the saved-book toast) rides
 * along as a coral text button.
 *
 * The provider lives in main.jsx with the other providers; <Toasts />
 * renders inside AppShell (App.jsx) so it survives route changes — a
 * toast fired just before a navigation (e.g. "Listing deleted") is
 * still seen on the destination screen.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message, { actionLabel, onAction, duration = 3500 } = {}) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, actionLabel, onAction }]);
    timers.current.set(id, setTimeout(() => dismissToast(id), duration));
    return id;
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const Toasts = () => {
  const { toasts, dismissToast } = useContext(ToastContext);
  if (!toasts?.length) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-[104px] z-[80] flex w-[min(92%,460px)] flex-col items-stretch gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          onClick={() => dismissToast(toast.id)}
          className="toast-enter pointer-events-auto flex cursor-pointer items-center gap-3 rounded-2xl border border-pio-grid bg-white px-4 py-3 text-left shadow-[0_12px_32px_-6px_rgba(31,36,33,0.14),0_4px_12px_-2px_rgba(31,36,33,0.06)]"
        >
          <CheckCircle size={20} className="shrink-0 text-pio-coral" aria-hidden="true" />
          <span className="flex-1 text-[15px] font-medium text-pio-text">{toast.message}</span>
          {toast.actionLabel && (
            <button
              type="button"
              className="shrink-0 cursor-pointer border-0 bg-transparent px-1 py-2 text-[15px] font-semibold text-pio-coral"
              onClick={(e) => {
                e.stopPropagation();
                dismissToast(toast.id);
                toast.onAction?.();
              }}
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
