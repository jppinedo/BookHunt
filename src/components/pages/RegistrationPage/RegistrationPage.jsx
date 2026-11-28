import React, {useState, useContext} from "react";
import { Button, Card, Input, Title } from "@jppinedo/lienzo";
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
    const [passwordError, setPasswordError] = useState(false);
    const [confirmedPasswordError, setConfirmedPasswordError] = useState(false);

    async function handleSignUp(e){
        e.preventDefault();
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        setConfirmedPasswordError(false);
        if (!validateEmail() || !validateNameInput(firstName, "fName") || !validateNameInput(lastName, "lName")) {
            return
        }
        if (password === confirmedPassword) {
            try {
                const newUser = await signUp(email, { firstName, lastName, password });
                navigate(newUser ? "/search" : "/login");
            } catch (error) {
                onShowError(error);
            }
        }
        else {
            setConfirmedPasswordError(true);
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

    const handlePasswordInput = e => {
        setPassword(e.target.value);
        if (password.length >= 6) {
            setPasswordError(false);
        }
        else {
            setPasswordError(true);
        }
    }

    return (
        <div className='register-wrapper'>
            {/* U16: `wide` — AuthBrand's wrapper matches this page's
                26rem card box so the lockup aligns to its left edge. */}
            <AuthBrand wide />
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
                            onChange={handlePasswordInput}
                            hint={passwordError ? "Password must be at least 6 characters." : undefined}
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
                            hint={confirmedPasswordError ? "Passwords do not match." : undefined}
                        />
                    </div>
                    <div className="w-full mt-2 [&>button]:w-full">
                        <Button
                            label="Create account"
                            ariaLabel="Create account"
                            type="green"
                            size="xl"
                            onClick={(e) => {handleSignUp(e)}}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default RegistrationPage;
