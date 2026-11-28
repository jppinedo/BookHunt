import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Title } from "@jppinedo/lienzo";
import PasswordInput from '@custom/Shared/PasswordInput';
import Modal from '@custom/Shared/Modal';
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { SearchContext } from '@state/SearchContext';
import { getUserProfile } from "@services/BookFirestore";
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';
import './ProfilePage.css';

/**
 * ProfilePage — was MUI Tabs/Tab/TextField/Button/IconButton + Firebase
 * Auth (reauthenticate/updatePassword/deleteUser) + Firestore userInfo doc.
 * Now: Lienzo Button + Title + Input (D1: passwords use
 * Input htmlType="password" — the old PasswordField workaround is gone),
 * and the mock service layer (getUserProfile). Password change and account
 * deletion are MOCK no-ops in Phase 1 (no real auth backend to call); they
 * validate input and report success exactly where Supabase Auth calls
 * will go.
 * U9: this page used to carry a second tab, "Book Listings", inside this
 * narrow form card. A list doesn't belong in a form container — the
 * listings are now their own page (/my-listings, MyListingsPage), the
 * Tabs are gone, and Profile is just the settings form. The AppContext
 * profileTab that tracked the tabs went with them.
 */
const ProfilePage = () => {
    const { user, signOut } = useContext(AuthContext);
    const { onShowError } = useContext(AppContext);
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

    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);

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

    // Mock: a real Supabase version reauthenticates and calls
    // supabase.auth.updateUser({ password }) here.
    async function changePassword(e) {
        e.preventDefault();
        setOldPasswordError(false);

        if (!oldPassword) {
            setOldPasswordError(true);
            return;
        }
        if (newPassword.length < 6) {
            setNewPasswordError(true);
            return;
        }
        alert("Password successfully updated! (mock auth — no real password was changed)");
        setOldPassword('');
        setNewPassword('');
    }

    // Mock: a real Supabase version deletes the profile row + auth user here.
    // U5: validates the confirmation panel's own password field (the
    // old flow validated the Change Password section's Old Password).
    async function deleteAccount(e) {
        e.preventDefault();
        if (!deletePassword) {
            setDeletePasswordError(true);
            return;
        }
        try {
            await signOut();
            alert("Account successfully deleted. (mock auth — signed out only)");
            navigate("/login");
        }
        catch (error) {
            onShowError(error);
        }
    }

    function showDelete(option) {
        setDeleteVisible(option === true);
        if (option !== true) {
            setDeletePassword('');
            setDeletePasswordError(false);
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
            <div className="mt-6 flex flex-col items-center gap-3">
                <Button label="Change Password" type="green" size="lg" onClick={(e) => { changePassword(e) }} />
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
                same deleteAccount logic as U5's inline panel; only the
                presentation moved. Cancel, Escape, and an overlay click
                all route through showDelete(false), which also clears
                the field. */}
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
                        onChange={(e) => { setDeletePassword(e.target.value); setDeletePasswordError(false); }}
                        hint={deletePasswordError ? "Please type your password to confirm." : undefined}
                    />
                </div>
                <div className="mt-5 flex justify-center gap-3">
                    <Button label="Delete my account" type="red" onClick={(e) => deleteAccount(e)} />
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
