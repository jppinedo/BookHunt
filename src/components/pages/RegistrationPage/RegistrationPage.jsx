import React, {useState, useContext, useRef, useEffect} from "react";
import { Button, Card, Input, Spinner, Title } from "@jppinedo/lienzo";
import { Check, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { AppContext } from '@state/AppContext';
import { AuthContext } from '@state/AuthContext';
import AuthBrand from '@custom/Shared/AuthBrand';
import AuthSwitch from '@custom/Shared/AuthSwitch';
import PasswordInput from '@custom/Shared/PasswordInput';
import ShelveCaptcha from '@custom/Shared/ShelveCaptcha';
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
 * "Enter your text" default.
 *
 * U22: a live password-rules checklist sits under the confirmation
 * field (length / mixed case / match, evaluated on every keystroke)
 * and gates the submit — same wrapper + guard pattern as the sell
 * form (U4), since Lienzo's Button has no disabled state. It replaces
 * the old per-field password hints, including the "Passwords do not
 * match" error, so each rule has exactly one live indicator.
 *
 * U22.1: the gate also requires first name, last name (both trimmed
 * non-empty) and an email passing the same regex validateEmail uses
 * at submit time — the button used to light up on password rules
 * alone while the identity fields were still empty.
 *
 * U24: registration is a step machine — 'form' → 'captcha' →
 * 'submitting' → 'success'. Create account no longer submits: it
 * advances to a captcha-only step where the form disappears and the
 * user shelves the book THREE times (a fresh ShelveCaptcha per
 * round, progress dots + "Round n of 3"), and only the third counted
 * solve fires the real sign-up with the form data held in page
 * state. All field state lives in this page, so Back from the
 * captcha step (or a failed sign-up) returns to the form with
 * everything still typed. Success shows a confirmation screen for
 * ~3 seconds, then navigates to /search — sign-up returns a session
 * (email confirmation is off), so the user lands signed-in.
 *
 * The U23 bot traps ride along: the honeypot "website" field no
 * human ever sees lives in the form step, but its value is page
 * state, so the final submit can still check it after the form has
 * unmounted — a filled honeypot silently aborts back to the form
 * step, no error shown. The too-fast-solve guard (a solve <1s after
 * a shelf mounts doesn't count) now lives inside ShelveCaptcha,
 * since each round's shelf mounts separately. Errors from the
 * server sign-up surface through onShowError exactly as before.
 */

const CAPTCHA_ROUNDS = 3;
const SOLVE_BEAT_MS = 700;
const SUCCESS_REDIRECT_MS = 3000;

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

    // U24: the step machine and the captcha rounds. `roundsDone`
    // drives the progress indicator; `shelfKey` remounts a fresh
    // ShelveCaptcha (new random gap) for each round. `flowRef` is a
    // generation counter — Back (or any reset) bumps it, which
    // invalidates a success-beat timeout still pending from the
    // round the user just left.
    const [step, setStep] = useState('form');
    const [roundsDone, setRoundsDone] = useState(0);
    const [shelfKey, setShelfKey] = useState(0);
    const flowRef = useRef(0);
    const beatTimerRef = useRef(null);

    // U23/U24: the honeypot value. The field itself renders only in
    // the form step, but the value is page state, so the final
    // submit (two steps later) can still check it.
    const [website, setWebsite] = useState('');

    // U24 success screen: hold for ~3s, then land on /search. The
    // cleanup cancels the redirect if the page unmounts first.
    useEffect(() => {
        if (step !== 'success') {
            return undefined;
        }
        const timer = setTimeout(() => {
            navigate('/search');
        }, SUCCESS_REDIRECT_MS);
        return () => clearTimeout(timer);
    }, [step, navigate]);

    // U24: never let a pending success-beat timeout fire into an
    // unmounted page.
    useEffect(() => () => {
        if (beatTimerRef.current) {
            clearTimeout(beatTimerRef.current);
        }
    }, []);

    // U22: the three password rules, re-evaluated on every render so
    // the checklist under the confirmation field is always live. An
    // empty confirmation never counts as a match.
    const passwordRules = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'Contains an uppercase and a lowercase letter', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
        { label: 'Passwords match', met: confirmedPassword.length > 0 && confirmedPassword === password },
    ];
    const passwordRulesPass = passwordRules.every((rule) => rule.met);

    // U22.1: the form only unlocks once the identity fields are in
    // too — names trimmed non-empty and the email passing the exact
    // regex validateEmail enforces at submit time (one shared rule,
    // so the live gate can never disagree with submit validation).
    // U24: this gate now guards the advance to the captcha step; the
    // captcha itself is no longer part of it.
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    const formReady = firstName.trim() !== ''
        && lastName.trim() !== ''
        && EMAIL_REGEX.test(email)
        && passwordRulesPass;

    // U24: back to the form step with the rounds wiped — used by the
    // captcha step's Back button, the honeypot abort, and the
    // sign-up failure path. Field state is untouched, so nothing the
    // user typed is lost.
    const resetToForm = () => {
        if (beatTimerRef.current) {
            clearTimeout(beatTimerRef.current);
            beatTimerRef.current = null;
        }
        flowRef.current += 1;
        setRoundsDone(0);
        setStep('form');
    };

    // U24 step 1 → 2: Create account validates the form exactly as
    // the old submit did, then advances instead of signing up.
    function handleAdvance(e){
        e.preventDefault();
        // U22/U22.1: the advance is gated on the full form (the
        // button wrapper also blocks pointer events — this guard is
        // the backstop, same as the sell form's canSubmit check).
        if (!formReady) {
            return
        }
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        if (!validateEmail() || !validateNameInput(firstName, "fName") || !validateNameInput(lastName, "lName")) {
            return
        }
        flowRef.current += 1;
        setRoundsDone(0);
        setShelfKey((k) => k + 1);
        setStep('captcha');
    }

    // U24 step 2: a counted solve (ShelveCaptcha already refused
    // the inhuman <1s ones). Show the solved shelf for a short beat,
    // then either mount the next round's shelf or, after the third,
    // fire the real sign-up.
    const handleCaptchaSolve = (solved) => {
        if (!solved || step !== 'captcha') {
            return;
        }
        const flow = flowRef.current;
        const next = roundsDone + 1;
        setRoundsDone(next);
        beatTimerRef.current = setTimeout(() => {
            beatTimerRef.current = null;
            if (flowRef.current !== flow) {
                return; // Back was pressed during the beat
            }
            if (next >= CAPTCHA_ROUNDS) {
                void performSignUp();
            } else {
                setShelfKey((k) => k + 1);
            }
        }, SOLVE_BEAT_MS);
    };

    // U24 step 2 → 3/4: the actual sign-up, with the form data held
    // in page state. The honeypot check happens here — a filled
    // "website" field means a bot, so abort silently back to the
    // form step. A server failure does the same trip, but with the
    // error shown the way errors have always been shown here.
    async function performSignUp(){
        if (website) {
            resetToForm();
            return;
        }
        setStep('submitting');
        try {
            await signUp(email, { firstName, lastName, password });
            setStep('success');
        } catch (error) {
            resetToForm();
            onShowError(error);
        }
    }

    function validateEmail() {
        if (EMAIL_REGEX.test(email)) {
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
                {step === 'form' && (
                    <>
                        <div className="w-full mb-5">
                            <AuthSwitch active="register" />
                        </div>
                        <Title size="xl" fontFamily="playfair">Register</Title>
                        <p>Fill out the form to create an account</p>
                        <form id={"log-in"} method={"post"} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            {/* U23 honeypot: off-screen, untabbable,
                                hidden from assistive tech. Humans never
                                see it; form-filling bots do. Its value
                                is page state, so performSignUp can
                                still check it after this form has
                                unmounted (see the U24 note above). */}
                            <div
                                aria-hidden="true"
                                style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}
                            >
                                <label>
                                    Website
                                    <input
                                        type="text"
                                        name="website"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={website}
                                        onChange={(e) => {setWebsite(e.target.value)}}
                                    />
                                </label>
                            </div>
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
                            {/* U22: live password-rules checklist. The
                                label stays muted gray in both states
                                (Juan's spec); only the icon carries
                                the state — green Check when met,
                                coral-dark X when not. */}
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
                                {/* U22/U22.1: Lienzo's Button has no
                                    disabled state, so the gate is the
                                    sell form's U4 pattern — a wrapper
                                    that drops pointer events and fades
                                    until the whole form is ready
                                    (names, valid email, password
                                    rules). U24: clicking it advances
                                    to the captcha step; it no longer
                                    submits. */}
                                <div
                                    className={`[&>button]:w-full ${formReady ? '' : 'pointer-events-none opacity-50'}`}
                                    aria-disabled={!formReady}
                                >
                                    <Button
                                        label="Create account"
                                        ariaLabel="Create account"
                                        type="green"
                                        size="xl"
                                        onClick={(e) => {handleAdvance(e)}}
                                    />
                                </div>
                            </div>
                        </form>
                    </>
                )}

                {(step === 'captcha' || step === 'submitting') && (
                    /* U24 step 2: the form is gone — the card holds
                       only the prompt, the round progress, and the
                       shelf (or the busy state while the sign-up
                       runs). */
                    <div className="flex w-full flex-col items-center gap-4 py-2">
                        <Title size="xl" fontFamily="playfair">One last step</Title>
                        <p className="text-center">Shelve the book {CAPTCHA_ROUNDS} times so we know you&rsquo;re human.</p>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2" aria-hidden="true">
                                {Array.from({ length: CAPTCHA_ROUNDS }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`h-2.5 w-2.5 rounded-full ${i < roundsDone ? 'bg-pio-teal-dark' : 'bg-pio-text-muted/30'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[13px] text-pio-text-muted" aria-live="polite">
                                Round {Math.min(roundsDone + 1, CAPTCHA_ROUNDS)} of {CAPTCHA_ROUNDS}
                            </span>
                        </div>
                        {step === 'submitting' ? (
                            <div className="flex flex-col items-center gap-3 py-6" aria-live="polite">
                                <Spinner size="32px" thickness="4px" />
                                <span className="text-pio-text-muted">Creating your account&hellip;</span>
                            </div>
                        ) : (
                            <>
                                <ShelveCaptcha key={shelfKey} onSolve={handleCaptchaSolve} />
                                <button
                                    type="button"
                                    onClick={resetToForm}
                                    className="text-sm text-pio-text-muted underline-offset-2 hover:underline"
                                >
                                    Back
                                </button>
                            </>
                        )}
                    </div>
                )}

                {step === 'success' && (
                    /* U24 step 3: the confirmation. No button — the
                       redirect to /search fires on its own after
                       ~3 seconds (see the effect above). */
                    <div className="flex w-full flex-col items-center gap-3 py-8 text-center" aria-live="polite">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-pio-teal-dark-pale text-pio-teal-dark">
                            <Check size={36} aria-hidden="true" />
                        </span>
                        <Title size="xl" fontFamily="playfair">Account created successfully</Title>
                        <p className="text-pio-text-muted">Welcome to Book Hunt.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default RegistrationPage;
