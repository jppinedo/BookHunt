import React, {useState, useContext} from "react";
import { Button, Card, Input, Title } from "@jppinedo/lienzo";
import { Check, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { AppContext } from '@state/AppContext';
import { AuthContext } from '@state/AuthContext';
import AuthBrand from '@custom/Shared/AuthBrand';
import AuthSwitch from '@custom/Shared/AuthSwitch';
import PasswordInput from '@custom/Shared/PasswordInput';
import './RegistrationPage.css';

/**
 * RegistrationPage — was MUI + Firebase createUserWithEmailAndPassword +
 * Firestore setDoc(userInfo). Now Lienzo primitives + AuthContext signUp
 * (real Supabase Auth when configured, mock otherwise).
 *
 * Layout (fixed 2026-11-25, Juan's screenshot review): the card used to
 * be a fixed max-w-[38.59rem] slab while every field was capped at
 * 300px, so the form huddled on the left of an oversized card with a
 * dead right half. The card now hugs its content like the Login card
 * (max-w 26rem, centered) and the form is a single column of full-width
 * fields. The header is the shared AuthBrand lockup (see its comment),
 * and every field carries a real placeholder instead of Lienzo Input's
 * "Enter your text" default. Success no longer calls alert() — blocked
 * in the sandboxed preview frame — it navigates: to /search when the
 * sign-up returned a session (email confirmation off), else to /login.
 *
 * U22: a live password-rules checklist sits under the confirmation
 * field (length / mixed case / match, evaluated on every keystroke)
 * and gates the submit — same wrapper + guard pattern as the sell
 * form (U4), since Lienzo's Button has no disabled state. It replaces
 * the old per-field password hints, including the "Passwords do not
 * match" error, so each rule has exactly one live indicator.
 */
const RegistrationPage = () => {
    const navigate = useNavigate();
    const { onShowError } = useContext(AppContext);
    const { signUp } = useContext(AuthContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    // U22: the three password rules, re-evaluated on every render so
    // the checklist under the confirmation field is always live. An
    // empty confirmation never counts as a match.
    const passwordRules = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'Contains an uppercase and a lowercase letter', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
        { label: 'Passwords match', met: confirmedPassword.length > 0 && confirmedPassword === password },
    ];
    const passwordRulesPass = passwordRules.every((rule) => rule.met);

    async function handleSignUp(e){
        e.preventDefault();
        // U22: the submit is gated on the password rules (the button
        // wrapper also blocks pointer events — this guard is the
        // backstop, same as the sell form's canSubmit check).
        if (!passwordRulesPass) {
            return
        }
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        if (!validateEmail() || !validateNameInput(firstName, "fName") || !validateNameInput(lastName, "lName")) {
            return
        }
        try {
            const newUser = await signUp(email, { firstName, lastName, password });
            navigate(newUser ? "/search" : "/login");
        } catch (error) {
            onShowError(error);
        }
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
        if (emailRegex.test(email)) {
            return true
        }
        else {
            setEmailError(true);
            return false
        }
    }

    function validateNameInput(e, type) {
        const nameRegex = /^[A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*$/;
        if (e !== '' || nameRegex.test(e)) {
            console.log("true")
            return true
        }
        else {
            if (type === "fName") {
                setFirstNameError(true);
            }
            else if (type === "lName") {
                setLastNameError(true);
            }
            return false
        }
    }

    return (
        <div className='register-wrapper'>
            {/* U21: AuthBrand renders the big centered stacked hero
                lockup — the U16 `wide` alignment prop is gone. */}
            <AuthBrand />
            <Card className="register-card">
                <div className="w-full mb-5">
                    <AuthSwitch active="register" />
                </div>
                <Title size="xl" fontFamily="playfair">Register</Title>
                <p>Fill out the form to create an account</p>
                <form id={"log-in"} method={"post"} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div className="w-full text-left">
                        <Input
                            label="First Name"
                            placeholder="e.g. Jane"
                            autoComplete="given-name"
                            value={firstName}
                            onChange={(e) => {setFirstName(e.target.value)}}
                            hint={firstNameError ? "Invalid characters" : undefined}
                        />
                    </div>
                    <div className="w-full text-left">
                        <Input
                            label="Last Name"
                            placeholder="e.g. Doe"
                            autoComplete="family-name"
                            value={lastName}
                            onChange={(e) => {setLastName(e.target.value)}}
                            hint={lastNameError ? "Invalid characters" : undefined}
                        />
                    </div>
                    <div className="w-full text-left">
                        <Input
                            label="Email"
                            htmlType="email"
                            autoComplete="email"
                            placeholder="you@example.edu"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                            hint={emailError ? "Please enter a valid email address." : undefined}
                        />
                    </div>
                    <hr className="w-full border-gray-300" />
                    <div className="w-full text-left">
                        <PasswordInput
                            id="crPassword"
                            label="Password"
                            autoComplete="new-password"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </div>
                    <div className="w-full text-left">
                        <PasswordInput
                            id="confirmPassword"
                            label="Confirm Password"
                            autoComplete="new-password"
                            placeholder="Repeat your password"
                            value={confirmedPassword}
                            onChange={(e) => {setConfirmedPassword(e.target.value)}}
                        />
                    </div>
                    {/* U22: live password-rules checklist. The label
                        stays muted gray in both states (Juan's spec);
                        only the icon carries the state — green Check
                        when met, coral-dark X when not. */}
                    <ul className="w-full text-left flex flex-col gap-1.5" aria-label="Password requirements">
                        {passwordRules.map((rule) => (
                            <li key={rule.label} className="flex items-center gap-2 text-[13px] text-pio-text-muted">
                                {rule.met
                                    ? <Check size={14} className="shrink-0 text-pio-teal-dark" aria-hidden="true" />
                                    : <X size={14} className="shrink-0 text-pio-coral-dark" aria-hidden="true" />}
                                <span>{rule.label}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="w-full mt-2">
                        {/* U22: Lienzo's Button has no disabled state, so
                            the gate is the sell form's U4 pattern — a
                            wrapper that drops pointer events and fades
                            until every password rule passes. */}
                        <div
                            className={`[&>button]:w-full ${passwordRulesPass ? '' : 'pointer-events-none opacity-50'}`}
                            aria-disabled={!passwordRulesPass}
                        >
                            <Button
                                label="Create account"
                                ariaLabel="Create account"
                                type="green"
                                size="xl"
                                onClick={(e) => {handleSignUp(e)}}
                            />
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default RegistrationPage;
