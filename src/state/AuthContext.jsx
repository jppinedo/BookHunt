import { createContext, useEffect, useState } from "react";
import { DEMO_USER, upsertMockProfile } from "@services/mockData.js";
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
 * { user, setUser, signIn, signUp, signOut }, where user is
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
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(isSupabaseConfigured ? null : DEMO_USER);

    // Supabase mode: restore any existing session, then follow auth changes.
    useEffect(() => {
        if (!isSupabaseConfigured) return undefined;

        let cancelled = false;
        supabase.auth.getSession().then(({ data }) => {
            if (!cancelled) setUser(mapSupabaseUser(data.session?.user ?? null));
        });

        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(mapSupabaseUser(session?.user ?? null));
            },
        );

        return () => {
            cancelled = true;
            subscription.subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email, password) => {
        if (!isSupabaseConfigured) {
            const signedIn = { ...DEMO_USER, email: email || DEMO_USER.email };
            setUser(signedIn);
            return signedIn;
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw friendlyAuthError(error);
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        return mapped;
    };

    const signUp = async (email, { firstName = '', lastName = '', password } = {}) => {
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

    const values = {
        user,
        setUser,
        signIn,
        signUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
}
