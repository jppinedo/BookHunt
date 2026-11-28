import { createContext, useEffect, useState } from "react";
import { DEMO_USER, upsertMockProfile, deleteMockProfile } from "@services/mockData.js";
import { supabase, isSupabaseConfigured } from "@services/supabaseClient.js";
import { createUserProfile } from "@services/BookFirestore.js";

export const AuthContext = createContext();

/**
 * Map a transport-level auth failure to a message a person can act on.
 * When the request never reaches Supabase — offline, or the embedding
 * page's Content-Security-Policy blocks connect-src to the project
 * domain (which is what the Muse preview shell does) — supabase-js
 * surfaces a raw "NetworkError when attempting to fetch resource" /
 * "Failed to fetch". Say what actually happened instead.
 */
function friendlyAuthError(error) {
    const message = (error && error.message) || "";
    const isNetworkFailure =
        (error && error.name === "AuthRetryableFetchError") ||
        error instanceof TypeError ||
        /network|failed to fetch/i.test(message);
    if (isNetworkFailure) {
        return new Error(
            "Couldn't reach the sign-in server — the request was blocked or the connection dropped before it arrived. Check your connection and try again.",
        );
    }
    return error;
}

/**
 * Auth provider — same context shape in both modes:
 * { user, setUser, signIn, signUp, signOut, passwordRecovery,
 *   requestPasswordReset, updatePassword, changePassword,
 *   deleteAccount }, where user is
 * { uid, id, email, displayName } (uid kept for Firebase-era callers).
 *
 * Phase E1 modes, chosen by configuration (see services/supabaseClient.js):
 *   - Supabase configured: real auth via supabase.auth — signUp (with
 *     first_name/last_name user metadata, which the handle_new_user
 *     trigger copies into the profiles table), signInWithPassword,
 *     signOut, getSession + onAuthStateChange for session restore.
 *     The app starts signed OUT; there is no demo user.
 *   - Not configured: the Phase 1 mock — the app starts signed in as the
 *     demo user and signIn/signUp accept any credentials, so the
 *     preview/demo runs with zero setup.
 */
function mapSupabaseUser(supabaseUser) {
    if (!supabaseUser) return null;
    const meta = supabaseUser.user_metadata || {};
    const displayName = [meta.first_name, meta.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();
    return {
        uid: supabaseUser.id,
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        displayName: displayName || supabaseUser.email || "",
        // U30: the first name on its own, for the post-login welcome
        // toast ("Welcome to Book Hunt, {first name}"). Sourced from
        // the same user_metadata first_name signUp stores; '' when
        // the account predates it or never set one.
        firstName: meta.first_name || "",
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(isSupabaseConfigured ? null : DEMO_USER);
    // U5: true between Supabase's PASSWORD_RECOVERY event (the user
    // landed from a reset-password email link) and the password update
    // that completes the flow. RedirectHandler routes to the
    // set-new-password screen while this is set.
    const [passwordRecovery, setPasswordRecovery] = useState(false);

    // Supabase mode: restore any existing session, then follow auth changes.
    useEffect(() => {
        if (!isSupabaseConfigured) return undefined;

        let cancelled = false;
        supabase.auth.getSession().then(({ data }) => {
            if (!cancelled) setUser(mapSupabaseUser(data.session?.user ?? null));
        });

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
                setUser(mapSupabaseUser(session?.user ?? null));
            },
        );

        return () => {
            cancelled = true;
            subscription.subscription.unsubscribe();
        };
    }, []);

    // U28: signIn / signUp / requestPasswordReset each accept an
    // optional Turnstile captchaToken and forward it to Supabase
    // (options: { captchaToken }) only when one is supplied — with
    // no token the calls are exactly the pre-U28 ones. Mock mode
    // ignores the token entirely. Once CAPTCHA protection is
    // enabled in the Supabase dashboard, calls WITHOUT a valid
    // token are rejected server-side.
    const signIn = async (email, password, captchaToken) => {
        if (!isSupabaseConfigured) {
            const signedIn = { ...DEMO_USER, email: email || DEMO_USER.email };
            setUser(signedIn);
            return signedIn;
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
            ...(captchaToken ? { options: { captchaToken } } : {}),
        });
        if (error) throw friendlyAuthError(error);
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        return mapped;
    };

    const signUp = async (email, { firstName = '', lastName = '', password, captchaToken } = {}) => {
        if (!isSupabaseConfigured) {
            const newUser = { ...DEMO_USER, email: email || DEMO_USER.email };
            upsertMockProfile({
                id: newUser.uid,
                firstName,
                lastName,
                email: newUser.email,
                booksSaved: [],
                booksListed: [],
            });
            setUser(newUser);
            return newUser;
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, last_name: lastName },
                ...(captchaToken ? { captchaToken } : {}),
            },
        });
        if (error) throw friendlyAuthError(error);
        const mapped = mapSupabaseUser(data.user);
        // The handle_new_user trigger already created the profile row from
        // the metadata above. When a session exists right away (email
        // confirmation off), upsert the profile too so the names are set
        // even if the trigger is ever dropped. Without a session, RLS
        // blocks the insert — and the trigger has it covered anyway.
        if (data.session && mapped) {
            try {
                await createUserProfile(mapped, { firstName, lastName });
            } catch (profileError) {
                console.error("Error creating user profile: ", profileError);
            }
            setUser(mapped);
        }
        return mapped;
    };

    const signOut = async () => {
        if (isSupabaseConfigured) {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    // U5: "Forgot password?" — Supabase Auth emails the reset link; the
    // link lands back on the app (served from the origin root; routing
    // is in-memory, and supabase-js reads the recovery tokens from the
    // URL hash itself and fires PASSWORD_RECOVERY). Supabase answers
    // the same way whether or not the email has an account, and the UI
    // shows the same confirmation either way — no account-existence
    // leak. Mock mode: no email exists to send; resolve so the UI
    // shows the identical confirmation (demo parity).
    const requestPasswordReset = async (email, captchaToken) => {
        if (!isSupabaseConfigured) return;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/`,
            ...(captchaToken ? { captchaToken } : {}),
        });
        if (error) throw friendlyAuthError(error);
    };

    // U5: completes the recovery flow (also the call a signed-in user
    // would use). On success the recovery flag clears and the session
    // is a normal signed-in session. Mock mode: resolve (no-op).
    const updatePassword = async (newPassword) => {
        if (isSupabaseConfigured) {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw friendlyAuthError(error);
        }
        setPasswordRecovery(false);
    };

    // U31: the Profile page's Change Password, as a named operation.
    // Same underlying call as updatePassword (supabase.auth
    // .updateUser({ password })); the caller (ProfilePage) verifies
    // the OLD password by re-authenticating before invoking this.
    // Mock mode: no credential store exists — resolve (local
    // success), exactly like updatePassword's mock path.
    const changePassword = async (newPassword) => {
        await updatePassword(newPassword);
    };

    // U31: REAL account deletion. supabase-js has no client-side
    // self-delete, so Supabase mode calls the delete_current_user()
    // Postgres function (SECURITY DEFINER, deletes the caller's own
    // auth.users row where id = auth.uid(); the schema's cascades
    // wipe profiles/listings/saved_books with it — see
    // supabase/delete-account.sql; Juan runs that SQL once, and
    // until he does this rpc errors and the caller must NOT pretend
    // success). The caller verifies the password first and signs
    // out after. Mock mode: clear the demo user's mock footprint
    // and sign out locally.
    const deleteAccount = async () => {
        if (!isSupabaseConfigured) {
            if (user) deleteMockProfile(user.uid);
            setUser(null);
            return;
        }
        const { error } = await supabase.rpc("delete_current_user");
        if (error) throw friendlyAuthError(error);
    };

    const values = {
        user,
        setUser,
        signIn,
        signUp,
        signOut,
        passwordRecovery,
        requestPasswordReset,
        updatePassword,
        changePassword,
        deleteAccount,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
}
