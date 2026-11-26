/**
 * authentication.js — Phase 1 mock replacement for the old Firebase Auth
 * helper module. Same exported names/signatures the original file offered;
 * backed by the mock demo user instead of Firebase. (Nothing in src/
 * imported this module, but it is kept working for parity.)
 */
import { DEMO_USER } from "./src/services/mockData.js";

export const doCreateUserWithEmailAndPassword = async (email) => {
    return { user: { ...DEMO_USER, email: email || DEMO_USER.email } };
};

export const doSignInWithEmailAndPassword = async (email) => {
    return { user: { ...DEMO_USER, email: email || DEMO_USER.email } };
};

export const doSignOut = async () => {};
