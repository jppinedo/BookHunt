import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Title } from "@jppinedo/lienzo";
import AuthBrand from '@custom/Shared/AuthBrand';
import AuthSwitch from '@custom/Shared/AuthSwitch';
import PasswordInput from '@custom/Shared/PasswordInput';
import { AppContext } from '@state/AppContext';
import { AuthContext } from '@state/AuthContext';

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
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const { onShowError } = useContext(AppContext);
    const { signIn, requestPasswordReset } = useContext(AuthContext);

    const [view, setView] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e){
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate("/search");
        } catch (error) {
            console.log(error);
            onShowError(error);
        }
    }

    async function handleResetRequest(e){
        e.preventDefault();
        try {
            await requestPasswordReset(email);
            setView('sent');
        } catch (error) {
            console.log(error);
            onShowError(error);
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
                                    autoComplete="email"
                                    placeholder="you@example.edu"
                                    value={email}
                                    onChange={(e) => {setEmail(e.target.value)}}
                                />
                            </div>
                            <div className="mt-3 max-w-[340px] mx-auto text-left">
                                <PasswordInput
                                    id="logPass"
                                    label="Password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => {setPassword(e.target.value)}}
                                />
                            </div>
                            <div className="mt-2 max-w-[340px] mx-auto text-right">
                                <button type="button" style={forgotLinkStyle} onClick={() => setView('forgot')}>
                                    Forgot password?
                                </button>
                            </div>
                            <div className="mt-4 mb-2 max-w-[340px] mx-auto [&>button]:w-full">
                                <Button
                                    label="Login"
                                    ariaLabel="Login"
                                    type="green"
                                    size="xl"
                                    onClick={(e) => {handleLogin(e)}}
                                />
                            </div>
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
                        <div className="mt-4 max-w-[340px] mx-auto [&>button]:w-full">
                            <Button
                                label="Send reset link"
                                ariaLabel="Send reset link"
                                type="green"
                                size="xl"
                                onClick={(e) => {handleResetRequest(e)}}
                            />
                        </div>
                        <div className="mt-3 mb-2 max-w-[340px] mx-auto">
                            <button type="button" style={textLinkStyle} onClick={() => setView('login')}>
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
                                onClick={() => setView('login')}
                            />
                        </div>
                    </>
                )}
            </Card>
        </>
    );
};

export default LoginPage;
