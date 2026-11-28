import React, { useState, useContext, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Title } from "@jppinedo/lienzo";
import AuthBrand from '@custom/Shared/AuthBrand';
import AuthSwitch from '@custom/Shared/AuthSwitch';
import PasswordInput from '@custom/Shared/PasswordInput';
import TurnstileWidget from '@custom/Shared/TurnstileWidget';
import { AppContext } from '@state/AppContext';
import { AuthContext } from '@state/AuthContext';
import { storePasswordCredential } from '@utils/credential-store';
import { isTurnstileEnabled, isCaptchaError } from '@utils/turnstile';

/**
 * LoginPage — was MUI Button/TextField/Typography/Card + Firebase
 * signInWithEmailAndPassword. Now Lienzo Card/Title/Input/Button and the
 * mock AuthContext signIn (any credentials sign in as the demo user).
 * D1: the password field is Lienzo Input with htmlType="password" — the
 * PasswordField workaround (from when Input hardcoded type="text") is
 * deleted, so both fields share the fixed 48px Input height.
 *
 * U5: three in-place views on this screen —
 *   "login":     the sign-in form. The password field is PasswordInput
 *                (show/hide eye toggle), the Login/Register switch is
 *                the AuthSwitch segmented control at the top of the
 *                card (replacing the old bottom text link), and a
 *                "Forgot password?" link sits under the password field.
 *   "forgot":    enter an email → AuthContext.requestPasswordReset
 *                (Supabase resetPasswordForEmail; stubbed in mock mode).
 *   "sent":      the confirmation — worded identically whether or not
 *                the email has an account, so the flow never leaks
 *                account existence.
 * The reset email itself lands back on the app and routes to
 * /reset-password (see ResetPasswordPage).
 *
 * U5.1 (Juan's screenshot review): the AuthSwitch shrank (see its
 * comment), "Forgot password?" dropped a size, and the form submits
 * across the auth/profile/sell forms now wear Lienzo's deep teal —
 * Button type="green" (pio-teal-dark) at xl padding, full-width on
 * the auth cards — because the pale default submit was too easy to
 * miss. Coral stays reserved for nav/tabs/links, per his call.
 *
 * U25: the browser autofilled the password but never the email —
 * the email field carried autoComplete="email" and no name, so the
 * password manager couldn't pair it with the password field as one
 * credential. The login pair is now name="email" +
 * autoComplete="username" and name="password" +
 * autoComplete="current-password" (the pairing browsers key on),
 * and a successful sign-in also stores the credential explicitly
 * via the Credential Management API (see @utils/credential-store),
 * which reinforces future autofill.
 *
 * U28: a Cloudflare Turnstile widget (only when
 * VITE_TURNSTILE_SITE_KEY is configured — see @utils/turnstile)
 * sits under each form, Managed/invisible, and its token rides
 * along on signIn and on the password-reset request, because
 * Supabase rejects tokenless calls once CAPTCHA protection is
 * enabled server-side. Tokens are single-use, so the token clears
 * on every view switch and attempt; a captcha rejection resets
 * the widget for a fresh token and swaps in a friendly retry
 * message — every other error (wrong password included) displays
 * exactly as before.
 *
 * U29 (Juan's screenshot review): the U28 widget's box sat
 * visibly under the Login button at all times. The widget is now
 * invisible at rest (see TurnstileWidget) — nothing renders or
 * runs when the page loads. On submit, the handler first awaits
 * widget.execute() (the button wears the busy treatment while it
 * runs; for most humans it passes without showing anything) and
 * only then calls signIn / requestPasswordReset with the fresh
 * token, because Supabase verifies the token as part of the auth
 * request itself. A submit already in flight ignores repeats.
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const { onShowError } = useContext(AppContext);
    const { signIn, requestPasswordReset } = useContext(AuthContext);

    const [view, setView] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // U29: the mounted Turnstile widget (invisible at rest — see
    // TurnstileWidget). Only one view shows at a time, so one ref
    // serves both forms. No token is stored any more: each submit
    // executes the widget and uses the token it resolves with,
    // because tokens are single-use and Supabase checks the token
    // as part of the auth request.
    const turnstileWidgetRef = useRef(null);

    // U29: a submit in flight (Turnstile executing, then the auth
    // call) — the ref is the synchronous re-entry guard (the form
    // onSubmit AND the Button onClick both call the handlers),
    // the state drives the button's busy treatment.
    const [busy, setBusy] = useState(false);
    const busyRef = useRef(false);

    const switchView = (next) => {
        setView(next);
    };

    // U28: a captcha rejection gets the widget reset (fresh
    // challenge on the next submit) plus a friendly retry
    // message; returns true when it handled the error so callers
    // skip their normal path.
    const handleCaptchaFailure = (error) => {
        if (!isTurnstileEnabled || !isCaptchaError(error)) {
            return false;
        }
        turnstileWidgetRef.current?.reset();
        onShowError(new Error("Verification didn't go through — please try once more."));
        return true;
    };

    // U29: run the invisible challenge and return its token (null
    // when Turnstile isn't configured, or when the challenge
    // produced none — the auth call then goes tokenless and
    // Supabase arbitrates, with handleCaptchaFailure recovering
    // if it rejects).
    const obtainTurnstileToken = async () => {
        if (!isTurnstileEnabled) {
            return null;
        }
        return turnstileWidgetRef.current?.execute() ?? null;
    };

    async function handleLogin(e){
        e.preventDefault();
        if (busyRef.current) {
            return;
        }
        busyRef.current = true;
        setBusy(true);
        try {
            const token = await obtainTurnstileToken();
            await signIn(email, password, token || undefined);
            // U25: refresh what the browser's password manager
            // holds for this account (fire-and-forget, silent on
            // browsers without the Credential Management API).
            storePasswordCredential({ id: email, password });
            navigate("/search");
        } catch (error) {
            console.log(error);
            if (!handleCaptchaFailure(error)) {
                onShowError(error);
            }
        } finally {
            busyRef.current = false;
            setBusy(false);
        }
    }

    async function handleResetRequest(e){
        e.preventDefault();
        if (busyRef.current) {
            return;
        }
        busyRef.current = true;
        setBusy(true);
        try {
            const token = await obtainTurnstileToken();
            await requestPasswordReset(email, token || undefined);
            switchView('sent');
        } catch (error) {
            console.log(error);
            if (!handleCaptchaFailure(error)) {
                onShowError(error);
            }
        } finally {
            busyRef.current = false;
            setBusy(false);
        }
    }

    const textLinkStyle = { color: "#e05a5a", fontWeight: 600, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit" };
    // U5.1: Juan's review — "Forgot password?" read too large next to
    // the field; it drops to 13px (the "Back to login" link keeps the
    // standard text-link size).
    const forgotLinkStyle = { color: "#e05a5a", fontWeight: 600, cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: "13px" };

    return (
        <>
            <AuthBrand />
            <Card className="max-w-[24em] mx-auto">
                {view === 'login' && (
                    <>
                        <div className="max-w-[340px] mx-auto mb-5">
                            <AuthSwitch active="login" />
                        </div>
                        <form id={"log-in"} method={"post"} onSubmit={handleLogin}>
                            <Title size="xl" fontFamily="playfair">Welcome</Title>
                            <p>Sign in with your email and password:</p>
                            <div className="mt-5 max-w-[340px] mx-auto text-left">
                                <Input
                                    label="Email"
                                    htmlType="email"
                                    name="email"
                                    autoComplete="username"
                                    placeholder="you@example.edu"
                                    value={email}
                                    onChange={(e) => {setEmail(e.target.value)}}
                                />
                            </div>
                            <div className="mt-3 max-w-[340px] mx-auto text-left">
                                <PasswordInput
                                    id="logPass"
                                    name="password"
                                    label="Password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => {setPassword(e.target.value)}}
                                />
                            </div>
                            <div className="mt-2 max-w-[340px] mx-auto text-right">
                                <button type="button" style={forgotLinkStyle} onClick={() => switchView('forgot')}>
                                    Forgot password?
                                </button>
                            </div>
                            <div className={`mt-4 mb-2 max-w-[340px] mx-auto [&>button]:w-full ${busy ? 'pointer-events-none opacity-50' : ''}`} aria-disabled={busy}>
                                <Button
                                    label="Login"
                                    ariaLabel="Login"
                                    type="green"
                                    size="xl"
                                    onClick={(e) => {handleLogin(e)}}
                                />
                            </div>
                            {/* U29: Turnstile, invisible at rest —
                                the container is parked at zero size
                                (no gap under the button) and only
                                takes up space here if a submit-time
                                challenge needs interaction. Nothing
                                renders when no site key is set. */}
                            {isTurnstileEnabled && (
                                <div className="max-w-[340px] mx-auto flex justify-center">
                                    <TurnstileWidget ref={turnstileWidgetRef} />
                                </div>
                            )}
                        </form>
                    </>
                )}
                {view === 'forgot' && (
                    <form id={"forgot-password"} method={"post"} onSubmit={handleResetRequest}>
                        <Title size="xl" fontFamily="playfair">Reset password</Title>
                        <p>Enter your account email and we'll send you a link to reset your password.</p>
                        <div className="mt-5 max-w-[340px] mx-auto text-left">
                            <Input
                                label="Email"
                                htmlType="email"
                                autoComplete="email"
                                placeholder="you@example.edu"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value)}}
                            />
                        </div>
                        <div className={`mt-4 max-w-[340px] mx-auto [&>button]:w-full ${busy ? 'pointer-events-none opacity-50' : ''}`} aria-disabled={busy}>
                            <Button
                                label="Send reset link"
                                ariaLabel="Send reset link"
                                type="green"
                                size="xl"
                                onClick={(e) => {handleResetRequest(e)}}
                            />
                        </div>
                        {/* U29: the reset-email call needs a token
                            too once protection is on — same widget,
                            same invisible-at-rest treatment as the
                            login form. */}
                        {isTurnstileEnabled && (
                            <div className="max-w-[340px] mx-auto flex justify-center">
                                <TurnstileWidget ref={turnstileWidgetRef} />
                            </div>
                        )}
                        <div className="mt-3 mb-2 max-w-[340px] mx-auto">
                            <button type="button" style={textLinkStyle} onClick={() => switchView('login')}>
                                Back to login
                            </button>
                        </div>
                    </form>
                )}
                {view === 'sent' && (
                    <>
                        <Title size="xl" fontFamily="playfair">Check your email</Title>
                        <p>
                            If an account exists for {email || 'that email address'}, we've sent a
                            password reset link. Open it to choose a new password.
                        </p>
                        <div className="mt-4 mb-2 max-w-[340px] mx-auto [&>button]:w-full">
                            <Button
                                label="Back to login"
                                ariaLabel="Back to login"
                                type="green"
                                size="xl"
                                onClick={() => switchView('login')}
                            />
                        </div>
                    </>
                )}
            </Card>
        </>
    );
};

export default LoginPage;
