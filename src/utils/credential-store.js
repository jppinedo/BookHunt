/**
 * storePasswordCredential — U25: hand a just-verified credential to
 * the browser's password manager via the Credential Management API.
 *
 * Registration is a multi-step SPA flow (form → captcha → async
 * sign-up → timed redirect), so the browser's usual "save password?"
 * heuristic — which watches for a form submit followed by a
 * navigation — never fires, and nothing was ever offered for saving.
 * Storing explicitly after a successful sign-up (and after a
 * successful sign-in, to refresh what the browser holds) is the
 * documented way to trigger the prompt from an SPA.
 *
 * Best-effort by design: feature-detected (Firefox and Safari lack
 * PasswordCredential — they simply skip), fire-and-forget, and every
 * failure is swallowed. Auth must never break because the password
 * manager declined.
 */
export function storePasswordCredential({ id, password, name }) {
    try {
        if (!('PasswordCredential' in window) || !navigator.credentials?.store) {
            return;
        }
        const credential = new window.PasswordCredential({
            id,
            password,
            ...(name ? { name } : {}),
        });
        const stored = navigator.credentials.store(credential);
        if (stored && typeof stored.catch === 'function') {
            stored.catch(() => {});
        }
    } catch {
        // Silent: a rejected constructor or store() is not an auth error.
    }
}

export default storePasswordCredential;
