/**
 * U30: the one-shot "just logged in" flag behind the welcome toast.
 *
 * A successful Login-page sign-in used to land on /search with no
 * acknowledgement at all — one frame on the login card, the next on
 * the home page. LoginPage now marks this flag right before it
 * navigates, and SearchPage consumes it on mount to fire exactly one
 * "Welcome to Book Hunt, {first name}" toast.
 *
 * sessionStorage is the right store for it: it survives the
 * client-side navigation from /login to /search, and consuming the
 * flag REMOVES it, so the toast can never fire twice — not on a
 * refresh, not when the user wanders back home later, and not on a
 * session restore (a restored session never passes through the
 * Login page, so the flag is never set). Registration never sets
 * it either: that flow already ends on its own success screen.
 * The stored value is the user's first name ('' when unknown, so
 * the greeting falls back to the nameless wording).
 */
const WELCOME_TOAST_KEY = 'bookhunt:just-logged-in';

export function markJustLoggedIn(firstName) {
    try {
        sessionStorage.setItem(WELCOME_TOAST_KEY, firstName || '');
    } catch {
        // Storage unavailable (private mode, disabled cookies):
        // the greeting is a nicety — never block the login on it.
    }
}

/** Returns { firstName } once if a login just happened, else null. */
export function consumeJustLoggedIn() {
    try {
        const firstName = sessionStorage.getItem(WELCOME_TOAST_KEY);
        if (firstName === null) return null;
        sessionStorage.removeItem(WELCOME_TOAST_KEY);
        return { firstName };
    } catch {
        return null;
    }
}
