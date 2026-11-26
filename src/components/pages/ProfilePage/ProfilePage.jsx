import React, {useContext, useEffect, useRef, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Tabs, Title } from "@jppinedo/lienzo";
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { getUserProfile, getListedBooks } from "@services/BookFirestore";
import BookCardSeller from "@custom/Books/BookCardSeller.jsx";
import BreadcrumbNav from '@custom/Navigation/BreadcrumbNav';
import './ProfilePage.css';

/**
 * ProfilePage — was MUI Tabs/Tab/TextField/Button/IconButton + Firebase
 * Auth (reauthenticate/updatePassword/deleteUser) + Firestore userInfo doc.
 * Now: Lienzo Tabs molecule + Button + Title + Input (D1: passwords use
 * Input htmlType="password" — the old PasswordField workaround is gone),
 * and the mock service layer
 * (getUserProfile / getListedBooks). Password change and account deletion
 * are MOCK no-ops in Phase 1 (no real auth backend to call); they validate
 * input and report success exactly where Supabase Auth calls will go.
 */
const ProfilePage = () => {
    const { user, signOut } = useContext(AuthContext);
    const { onShowError, profileTab, setProfileTab } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [fullName, setFullName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [listedBooks, setListedBooks] = useState([])

    const [deleteVisible, setDeleteVisible] = useState(false);

    // U1.1: the breadcrumb trail changes with the active tab (Profile /
    // My Listings). Lienzo Tabs is uncontrolled — it owns its active tab
    // and offers no onChange — so the page learns about switches from
    // clicks on the rendered tab buttons (click-capture on the wrapper
    // below), and the "Profile" crumb switches back by clicking the
    // real tab button.
    // U2: the active tab now lives in AppContext (profileTab) because
    // the header menu's "My Listings" item needs to read it (active
    // mark) and target it (deep link, next effect).
    const activeTab = profileTab;
    const setActiveTab = setProfileTab;

    const handleTabsClick = (e) => {
        const tabEl = e.target.closest('[role="tab"]');
        if (!tabEl) return;
        setActiveTab(tabEl.id === 'tab-listings-tab' ? 'listings' : 'profile');
    };

    const goToProfileTab = () => {
        document.getElementById('tab-profile-tab')?.click();
        setActiveTab('profile');
    };

    // U2 deep link: the header menu's "My Listings" navigates here with
    // location state { tab: 'listings' }. Tabs has no prop to open on a
    // given tab, so switch the same way the breadcrumb does — click the
    // real tab button. The location.key guard makes each navigation
    // count once (a manual tab switch afterwards isn't overridden).
    const handledNavKey = useRef(null);
    useEffect(() => {
        if (location.state?.tab !== 'listings' || handledNavKey.current === location.key) return;
        handledNavKey.current = location.key;
        document.getElementById('tab-listings-tab')?.click();
        setActiveTab('listings');
    }, [location, setActiveTab]);

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

    // Set listed books array from the (mock) listings table
    useEffect(() => {
        if (!user) return;

        const fetchListedBooks = async () => {
            try {
                setListedBooks(await getListedBooks(user));
            }
            catch (error) {
                onShowError(error);
            }
        }

        fetchListedBooks();
    }, [user]);

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
    async function deleteAccount(e) {
        e.preventDefault();
        if (!oldPassword) {
            setOldPasswordError(true);
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
    }

    const handlePasswordInput = e => {
        const value = e.target.value;
        setNewPassword(value);
        setNewPasswordError(value.length < 6);
    }

    const handleBookClick = (item) => {
        navigate(`/bookConfig/${item.sellerType}/${item.id}`);
    }

    const BookListingView = (
        <div style={{maxHeight: "500px", overflowY: "auto", padding: '0.25rem 1.25rem 1.5rem', boxSizing: 'border-box'}}>
            {listedBooks.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {listedBooks.map((item, index) => (
                        <BookCardSeller
                            key={`${item.id}-${index}`}
                            book={item}
                            type="grid"
                            onCardClick={handleBookClick}
                        />
                    ))}
                </div>
            ) : (
                <p>No listed books found.</p>
            )}
        </div>
    )

    // D1: every field on this form is the same Lienzo Input at the same
    // fixed 48px height. The read-only fields used to be hand-rolled
    // 30px native inputs and the passwords a separate PasswordField
    // primitive (built when Lienzo Input hardcoded type="text") — three
    // implementations, three heights. Input now takes htmlType, so the
    // workaround is deleted and all four fields line up.
    const readOnlyField = (label, value) => (
        <div className="mb-3 text-left">
            <Input label={label} value={value} readOnly />
        </div>
    );

    const ProfileSettings = (
        <div className={"info-area"} style={{padding: '2rem'}}>
            {readOnlyField("Name", fullName)}
            {readOnlyField("Email", user?.email || '')}
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
                <Button label="Change Password" onClick={(e) => { changePassword(e) }} />
                <Button label="Delete Account" type="red" onClick={() => { showDelete(true) }} />
            </div>
            <div>
                {deleteVisible ?
                    <>
                        <h3 style={{marginTop: 10}}>This is permanent. Do you want to proceed? Please type old
                            password in text box.</h3>
                        <div className="flex justify-center gap-3">
                            <Button label="Yes" type="red" onClick={(e) => deleteAccount(e)} />
                            <Button label="No" type="red" onClick={() => showDelete(false)} />
                        </div>
                    </> : null}
            </div>
        </div>
    )

    if (!user) return null;

    return (
        <div className={"profile-background"} style={{marginTop: '1rem', marginBottom: '6rem'}}>
            <Title size="lg" thikness="bold" fontFamily="playfair" className="pt-4">Profile</Title>
            {/* U1.1: breadcrumb bar below the title; the trail extends to
                "My Listings" while the Book Listings tab is active. */}
            <div className="px-5">
                <BreadcrumbNav
                    crumbs={activeTab === 'listings' ? [
                        { label: 'Home', to: '/search' },
                        { label: 'Profile', onClick: goToProfileTab },
                        { label: 'My Listings', current: true },
                    ] : [
                        { label: 'Home', to: '/search' },
                        { label: 'Profile', current: true },
                    ]}
                    fallback="/search"
                />
            </div>
            <div onClickCapture={handleTabsClick}>
                <Tabs
                    tabs={[
                        { id: 'profile-tab', label: 'Profile', content: ProfileSettings },
                        { id: 'listings-tab', label: 'Book Listings', content: BookListingView },
                    ]}
                />
            </div>
        </div>
    );
};

export default ProfilePage;
