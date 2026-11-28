/**
 * turnstile — U28: shared config for Cloudflare Turnstile, the
 * token source for Supabase's built-in CAPTCHA protection.
 *
 * The site key is PUBLIC by design (it ships in the page and only
 * identifies which Turnstile site the widget belongs to); the
 * matching SECRET key lives in the Supabase dashboard only and
 * never reaches the front end.
 *
 * Gating rule for the whole feature: when VITE_TURNSTILE_SITE_KEY
 * is unset/empty, NO widget renders anywhere and every auth call
 * goes WITHOUT a token — byte-for-byte the pre-U28 behavior, so
 * dev/mock runs and any deploy that hasn't set the variable yet
 * are unaffected. The Supabase dashboard toggle is enabled LAST,
 * only after this code is live AND the variable is set in Vercel:
 * once protection is on server-side, Supabase rejects signUp,
 * signInWithPassword and resetPasswordForEmail calls that lack a
 * valid token.
 */
export const TURNSTILE_SITE_KEY = (
    import.meta.env.VITE_TURNSTILE_SITE_KEY || ""
).trim();

export const isTurnstileEnabled = TURNSTILE_SITE_KEY.length > 0;

/**
 * Supabase's captcha rejections carry "captcha" in the message
 * (e.g. "captcha protection: request disallowed (…)" /
 * "captcha verification failed"). The auth pages key their
 * reset-the-widget-and-retry recovery off this, while every other
 * error keeps its existing display path.
 */
export function isCaptchaError(error) {
    const message = (error && error.message) || "";
    return /captcha/i.test(message);
}
