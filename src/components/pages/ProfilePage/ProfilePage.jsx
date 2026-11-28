import React, {useContext, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Title } from "@jppinedo/lienzo";
import PasswordInput from '@custom/Shared/PasswordInput';
import Modal from '@custom/Shared/Modal';
import TurnstileWidget from '@custom/Shared/TurnstileWidget';
import { isTurnstileEnabled, isCaptchaError } from '@utils/turnstile';
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { SearchContext } from '@state/SearchContext';
import { ToastContext } from '@state/ToastContext';
import { getUserProfile } from "@services/BookFirestore";
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';
import './ProfilePage.css';

/**
 * ProfilePage — was MUI Tabs/Tab/TextField/Button/IconButton + Firebase
 * Auth (reauthenticate/updatePassword/deleteUser) + Firestore userInfo doc.
 * Now: Lienzo Button + Title + Input (D1: passwords use
 * Input htmlType="password" — the old PasswordField workaround is gone),
 * and the mock service layer (getUserProfile).
 * U31: password change and account deletion are REAL now — both were
 * Phase-1 alert-only stubs (deletion literally just signed the user
 * out and claimed success). Change Password verifies the old password
 * by re-authenticating, then calls AuthContext.changePassword
 * (supabase.auth.updateUser). Delete Account verifies the password the
 * same way, then calls AuthContext.deleteAccount, which invokes the
 * delete_current_user() Postgres function — the auth.users row goes,
 * and the schema's cascades take the profile, listings and saved
 * books with it. Both re-auth calls carry a Turnstile token when
 * Turnstile is configured, because CAPTCHA protection is enabled on
 * the project and signInWithPassword requires one.
 * U32: the two flows no longer share one widget instance. When
 * Cloudflare demanded interaction during a delete, the challenge
 * rendered in the page BEHIND the modal's overlay — visible but
 * unclickable; Juan had to close the modal to reach it. The delete
 * flow now executes its own TurnstileWidget mounted inside the
 * modal, so the challenge appears there, above the overlay.
 * Change Password keeps the page-level instance (no overlay there).
 * U9: this page used to carry a second tab, "Book Listings", inside this
 * narrow form card. A list doesn't belong in a form container — the
 * listings are now their own page (/my-listings, MyListingsPage), the
 * Tabs are gone, and Profile is just the settings form. The AppContext
 * profileTab that tracked the tabs went with them.
 */
const ProfilePage = () => {
    const { user, signOut, signIn, changePassword, deleteAccount } = useContext(AuthContext);
    const { onShowError } = useContext(AppContext);
    const { showToast } = useContext(ToastContext);
    // U7: the breadcrumb's Home crumb resets the search session.
    const { resetSearch } = useContext(SearchContext);
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [deleteVisible, setDeleteVisible] = useState(false);
    // U5: the delete confirmation carries its OWN password field. The
    // old flow told the user to "type old password in text box" — the
    // Change Password section's field, two scrolls up — so the confirm
    // step is self-contained. U5.1: it renders in the app-level Modal
    // (see ProfileSettings), not the inline panel U5 first shipped —
    // Juan's review: a destructive confirm belongs in a modal.
    const [deletePassword, setDeletePassword] = useState('');
    const [deletePasswordError, setDeletePasswordError] = useState(false);
    // U31: in-modal error line for the real delete flow (wrong
    // password, captcha failure, rpc failure) and its busy state.
    const [deleteError, setDeleteError] = useState('');
    const [deleteBusy, setDeleteBusy] = useState(false);

    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);
    // U31: form-level error line + busy state for Change Password.
    const [passwordFormError, setPasswordFormError] = useState('');
    const [changeBusy, setChangeBusy] = useState(false);

    // U31: an invisible-at-rest Turnstile widget serves the
    // re-authentication flows on this page. It renders nothing
    // and loads nothing until execute() is called at submit time
    // (see TurnstileWidget / U29).
    // U32: TWO instances now — this page-level one serves Change
    // Password only; the delete flow has its own, mounted inside
    // the confirmation modal (see the Modal JSX below), so an
    // interactive challenge renders inside the modal instead of
    // behind its overlay. The instances share the singleton API
    // script but no promise state.
    const turnstileWidgetRef = useRef(null);
    const deleteTurnstileWidgetRef = useRef(null);

    // Pull first/last name from the (mock) profiles table
    useEffect(() => {
        async function getName() {
            if (!user) return;

            try {
                const data = await getUserProfile(user.uid);
                if (data) {
                    setFullName(`${data.firstName} ${data.lastName}`);
                }
                else {
                    console.warn("No document found!");
                    setFullName("");
                }
            }
            catch (error) {
                onShowError(error);
            }
        }

        getName()
    }, [user])

    // U31: run the invisible Turnstile challenge on the given
    // widget instance and return its token (null when Turnstile
    // isn't configured — the re-auth call then goes tokenless,
    // the pre-U28 behavior). U32: the widget is a parameter
    // because each flow executes its OWN instance (page-level
    // for Change Password, modal-level for Delete Account).
    const obtainTurnstileToken = async (widgetRef) => {
        if (!isTurnstileEnabled) {
            return null;
        }
        return widgetRef.current?.execute() ?? null;
    };

    // U31: prove the user knows the current password by signing in
    // with it again. CAPTCHA protection is enabled on the project,
    // so the re-auth carries a Turnstile token when configured.
    // Throws whatever signIn throws; callers map the error.
    const reauthenticate = async (password, widgetRef) => {
        const token = await obtainTurnstileToken(widgetRef);
        await signIn(user.email, password, token || undefined);
    };

    // U31: turn a re-auth failure into the line the user sees —
    // a captcha rejection gets the reset-and-retry treatment
    // (applied to the instance that produced the token), a
    // credential rejection gets the caller's "incorrect" wording,
    // anything else (e.g. a network failure, already humanized by
    // AuthContext) speaks for itself.
    const passwordCheckErrorMessage = (error, incorrectText, widgetRef) => {
        if (isTurnstileEnabled && isCaptchaError(error)) {
            widgetRef.current?.reset();
            return "Verification didn't go through — please try once more.";
        }
        if (/invalid login credentials/i.test((error && error.message) || '')) {
            return incorrectText;
        }
        return (error && error.message) || "Something went wrong. Please try again.";
    };

    // U31: real Change Password — verify the old password by
    // re-authenticating, then updateUser via AuthContext. The
    // field validation is the one the form always had.
    async function handleChangePassword(e) {
        e.preventDefault();
        setOldPasswordError(false);
        setPasswordFormError('');

        if (!oldPassword) {
            setOldPasswordError(true);
            return;
        }
        if (newPassword.length < 6) {
            setNewPasswordError(true);
            return;
        }
        if (changeBusy) {
            return;
        }
        setChangeBusy(true);
        try {
            await reauthenticate(oldPassword, turnstileWidgetRef);
        }
        catch (error) {
            setPasswordFormError(passwordCheckErrorMessage(error, "Your old password is incorrect.", turnstileWidgetRef));
            setChangeBusy(false);
            return;
        }
        try {
            await changePassword(newPassword);
            showToast("Password successfully updated.");
            setOldPassword('');
            setNewPassword('');
        }
        catch (error) {
            onShowError(error);
        }
        finally {
            setChangeBusy(false);
        }
    }

    // U31: real account deletion. U5: validates the confirmation
    // modal's own password field (the old flow validated the Change
    // Password section's Old Password). The password is then
    // VERIFIED by re-authenticating — the stub never checked it —
    // and only then does the delete_current_user() rpc run. Any
    // failure leaves the user signed in, in the modal, with the
    // error in front of them; nothing pretends success.
    async function handleDeleteAccount(e) {
        e.preventDefault();
        if (!deletePassword) {
            setDeletePasswordError(true);
            return;
        }
        if (deleteBusy) {
            return;
        }
        setDeleteBusy(true);
        setDeleteError('');
        try {
            // U32: the token comes from the modal's own widget
            // instance, so an interactive challenge opens inside
            // this modal, not in the page behind it.
            await reauthenticate(deletePassword, deleteTurnstileWidgetRef);
        }
        catch (error) {
            setDeleteError(passwordCheckErrorMessage(error, "Incorrect password — your account was not deleted.", deleteTurnstileWidgetRef));
            setDeleteBusy(false);
            return;
        }
        try {
            await deleteAccount();
        }
        catch (error) {
            // e.g. delete-account.sql hasn't been run yet, so the
            // rpc doesn't exist. Stay signed in; say so plainly.
            console.error("Account deletion failed: ", error);
            setDeleteError("Your account couldn't be deleted. Please try again later.");
            setDeleteBusy(false);
            return;
        }
        await signOut();
        navigate("/login");
    }

    function showDelete(option) {
        if (option !== true) {
            // U32: closing mid-challenge settles the modal widget's
            // in-flight execute() right away (its unmount cleanup
            // would settle it too — the Modal renders nothing when
            // closed — but the explicit reset makes the cancel
            // immediate rather than teardown-dependent).
            deleteTurnstileWidgetRef.current?.reset();
        }
        setDeleteVisible(option === true);
        if (option !== true) {
            setDeletePassword('');
            setDeletePasswordError(false);
            setDeleteError('');
        }
    }

    const handlePasswordInput = e => {
        const value = e.target.value;
        setNewPassword(value);
        setNewPasswordError(value.length < 6);
    }

    // D1: every field on this form is the same Lienzo Input at the same
    // fixed 48px height. The read-only fields used to be hand-rolled
    // 30px native inputs and the passwords a separate PasswordField
    // primitive (built when Lienzo Input hardcoded type="text") — three
    // implementations, three heights. Input now takes htmlType, so the
    // workaround is deleted and all four fields line up.
    // U5: Name and Email used to render as readOnly Lienzo Inputs —
    // pixel-identical to the editable fields, so they LOOKED editable
    // and silently weren't (audit finding). They are now plain-text
    // rows in a muted, flat box that reads as information, not a
    // field, with a hint saying where they're managed. Nothing on
    // this form saves them: the only save action is Change Password,
    // which concerns the password fields alone.
    const readOnlyField = (label, value) => (
        <div className="mb-3 text-left">
            <span className="block text-gray-700 font-jakarta text-sm font-medium">{label}</span>
            <div className="flex h-12 items-center rounded-lg bg-gray-opacity-14 px-3 font-jakarta text-[15px] text-gray-500">
                {value || '—'}
            </div>
        </div>
    );

    const ProfileSettings = (
        <div className={"info-area"} style={{padding: '2rem'}}>
            {/* U31: invisible at rest; executed only at submit
                time. U32: this page-level instance now serves the
                Change Password re-auth alone — Delete Account has
                its own instance inside the modal below. */}
            <TurnstileWidget ref={turnstileWidgetRef} />
            {readOnlyField("Name", fullName)}
            {readOnlyField("Email", user?.email || '')}
            <p className="mb-3 text-left text-sm text-gray-500" style={{marginTop: '-0.25rem'}}>
                Name and email are managed by your account sign-in and can't be changed here.
            </p>
            <div className="mt-3 text-left">
                <Input
                    label="Old Password"
                    htmlType="password"
                    autoComplete="current-password"
                    value={oldPassword}
                    onChange={(e) => { setOldPassword(e.target.value) }}
                    hint={oldPasswordError ? "Please type your old password." : undefined}
                />
            </div>
            <div className="mt-3 text-left">
                <Input
                    label="New Password"
                    htmlType="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={handlePasswordInput}
                    hint={newPasswordError ? "Password must be at least 6 characters." : undefined}
                />
            </div>
            {passwordFormError && (
                <p className="mt-3 text-center text-sm font-medium text-pio-coral-dark">{passwordFormError}</p>
            )}
            <div className="mt-6 flex flex-col items-center gap-3">
                <span style={changeBusy ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>
                    <Button label={changeBusy ? "Updating…" : "Change Password"} type="green" size="lg" onClick={(e) => { handleChangePassword(e) }} />
                </span>
                {/* U7: Delete Account is a small text link now, not a
                    red pill button competing with Change Password —
                    muted red text, underline on hover. It still opens
                    the same U5.1 confirmation modal. */}
                <button
                    type="button"
                    onClick={() => { showDelete(true) }}
                    className="bg-transparent border-0 cursor-pointer p-0 font-jakarta text-[13px] font-medium text-pio-coral-dark/70 underline-offset-4 transition-colors hover:text-pio-coral-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pio-coral"
                >
                    Delete Account
                </button>
            </div>
            {/* U5.1: the delete confirmation is a modal (shared Modal
                component) — same self-contained password field and the
                same delete flow as U5's inline panel; only the
                presentation moved. (U31 made that flow real — see
                handleDeleteAccount.) Cancel, Escape, and an overlay
                click all route through showDelete(false), which also
                clears the field. */}
            <Modal
                open={deleteVisible}
                onClose={() => showDelete(false)}
                title="Delete your account permanently?"
            >
                <p className="text-sm text-gray-500">
                    This can't be undone. Confirm with your password to delete your account.
                </p>
                <div className="mt-3 text-left">
                    <PasswordInput
                        id="deleteConfirmPass"
                        label="Password"
                        autoComplete="current-password"
                        value={deletePassword}
                        onChange={(e) => { setDeletePassword(e.target.value); setDeletePasswordError(false); setDeleteError(''); }}
                        hint={deletePasswordError ? "Please type your password to confirm." : undefined}
                    />
                </div>
                {deleteError && (
                    <p className="mt-3 text-sm font-medium text-pio-coral-dark">{deleteError}</p>
                )}
                {/* U32: the delete flow's OWN Turnstile instance,
                    mounted inside the modal. Parked at zero size
                    while idle, so the modal looks exactly as
                    before; if Cloudflare requires interaction, the
                    widget flips in-flow right here — inside the
                    modal body, above the overlay, clickable — and
                    the modal grows to fit it. The flex wrapper
                    only centers it when it does appear. */}
                <div className="flex justify-center">
                    <TurnstileWidget ref={deleteTurnstileWidgetRef} />
                </div>
                <div className="mt-5 flex justify-center gap-3" style={deleteBusy ? { pointerEvents: 'none', opacity: 0.6 } : undefined}>
                    <Button label={deleteBusy ? "Deleting…" : "Delete my account"} type="red" onClick={(e) => handleDeleteAccount(e)} />
                    <Button label="Cancel" onClick={() => showDelete(false)} />
                </div>
            </Modal>
        </div>
    )

    if (!user) return null;

    return (
        <div className={"profile-background"} style={{marginTop: '1rem', marginBottom: '6rem'}}>
            <Title size="lg" thikness="bold" fontFamily="playfair" className="pt-4">Profile</Title>
            {/* U1.1: breadcrumb bar below the title. U9: the trail is
                just Home > Profile now — the "My Listings" extension
                belonged to the removed Book Listings tab. */}
            <div className="px-5">
                <BreadcrumbNav
                    crumbs={[
                        { label: 'Home', to: '/search', onClick: resetSearch },
                        { label: 'Profile', current: true },
                    ]}
                    fallback="/search"
                />
            </div>
            {ProfileSettings}
        </div>
    );
};

export default ProfilePage;
