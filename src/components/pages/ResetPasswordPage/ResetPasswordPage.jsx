import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card, Title } from "@jppinedo/lienzo";
import AuthBrand from '@custom/Shared/AuthBrand';
import PasswordInput from '@custom/Shared/PasswordInput';
import { AppContext } from '@state/AppContext';
import { AuthContext } from '@state/AuthContext';
import { useToast } from '@state/ToastContext';

/**
 * ResetPasswordPage — U5: where a password-reset email link lands.
 *
 * Supabase's reset email points back at the app root; supabase-js
 * reads the recovery tokens from the URL hash on load and fires
 * PASSWORD_RECOVERY, which AuthContext records as `passwordRecovery`
 * and RedirectHandler uses to route here. This screen is the
 * set-new-password form: updateUser({ password }) completes the
 * flow, the recovery flag clears, and the (already signed-in)
 * recovery session continues to /search with a "Password updated"
 * toast.
 *
 * Arriving here without a recovery session (expired or hand-typed
 * link) shows an invalid-link message instead of a dead form. The
 * auth event can land a beat after first paint, so the invalid
 * message waits for a short grace period before appearing.
 */
const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { onShowError } = useContext(AppContext);
    const { user, passwordRecovery, updatePassword } = useContext(AuthContext);
    const { showToast } = useToast();

    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [confirmedPasswordError, setConfirmedPasswordError] = useState(false);
    const [graceOver, setGraceOver] = useState(false);

    const canSetPassword = Boolean(user || passwordRecovery);

    useEffect(() => {
        if (canSetPassword) return undefined;
        const timer = setTimeout(() => setGraceOver(true), 2000);
        return () => clearTimeout(timer);
    }, [canSetPassword]);

    async function handleUpdate(e) {
        e.preventDefault();
        setPasswordError(false);
        setConfirmedPasswordError(false);
        if (password.length < 6) {
            setPasswordError(true);
            return;
        }
        if (password !== confirmedPassword) {
            setConfirmedPasswordError(true);
            return;
        }
        try {
            await updatePassword(password);
            showToast("Password updated");
            navigate("/search");
        } catch (error) {
            onShowError(error);
        }
    }

    return (
        <>
            <AuthBrand />
            <Card className="max-w-[24em] mx-auto">
                {!canSetPassword && !graceOver ? (
                    <>
                        <Title size="xl" fontFamily="playfair">Reset password</Title>
                        <p>Verifying your reset link…</p>
                    </>
                ) : !canSetPassword ? (
                    <>
                        <Title size="xl" fontFamily="playfair">Link expired</Title>
                        <p>This password reset link is invalid or has expired. Request a new one from the login screen.</p>
                        <div className="mt-4 mb-2 max-w-[340px] mx-auto [&>button]:w-full">
                            <Button
                                label="Back to login"
                                ariaLabel="Back to login"
                                type="green"
                                size="xl"
                                onClick={() => navigate("/login")}
                            />
                        </div>
                    </>
                ) : (
                    <form id={"reset-password"} method={"post"} onSubmit={handleUpdate}>
                        <Title size="xl" fontFamily="playfair">Set a new password</Title>
                        <p>Choose a new password for your account:</p>
                        <div className="mt-5 max-w-[340px] mx-auto text-left">
                            <PasswordInput
                                id="resetPass"
                                label="New Password"
                                autoComplete="new-password"
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                hint={passwordError ? "Password must be at least 6 characters." : undefined}
                            />
                        </div>
                        <div className="mt-3 max-w-[340px] mx-auto text-left">
                            <PasswordInput
                                id="resetConfirmPass"
                                label="Confirm Password"
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                value={confirmedPassword}
                                onChange={(e) => { setConfirmedPassword(e.target.value) }}
                                hint={confirmedPasswordError ? "Passwords do not match." : undefined}
                            />
                        </div>
                        <div className="mt-4 mb-2 max-w-[340px] mx-auto [&>button]:w-full">
                            <Button
                                label="Update password"
                                ariaLabel="Update password"
                                type="green"
                                size="xl"
                                onClick={(e) => { handleUpdate(e) }}
                            />
                        </div>
                    </form>
                )}
            </Card>
        </>
    );
};

export default ResetPasswordPage;
