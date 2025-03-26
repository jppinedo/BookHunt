import React, {useState, useContext} from "react";
import {Button, TextField, Card, Divider, Typography} from "@mui/material";
import logo from '@images/BookHuntLogoSmall.png'
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth, app } from "@/../firebase.js";
import { AppContext } from '@state/AppContext';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import './RegistrationPage.css';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const { onShowError } = useContext(AppContext);

    const db = getFirestore(app);

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
            createUserWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    alert("Account Created");
                    writeInfo(user.user)
                    navigate("/login");
                })
                .catch((error) => {
                    onShowError(error);
                })
        }
        else {
            setConfirmedPasswordError(true);
        }
    }

    async function writeInfo(user) {
        await setDoc(doc(db, "userInfo", user.uid), {
            firstName: firstName,
            lastName: lastName,
            userID: user.uid,
            booksSaved: [],
            booksListed: []
        });
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+.\.[^\s@]+$/;
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

    const intputStyles = {
        maxWidth: '300px',
        width: '100%',
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "black",
                borderWidth: "2px",
            },
            "&:hover fieldset": {
                borderColor: "orange", // Ensures hover effect applies
            },
            "&.Mui-focused fieldset": {
                borderColor: "orange",
            },
        },
        "& .MuiInputLabel-root": {
            color: "black",
            "&.Mui-focused": {
                color: "orange",
            },
        },
    }

    return (
        <div className='register-wrapper'>
            <div className={"site-title"}>
                <h1 className={"appName"}>Book Hunt <img src={logo} alt="BookHuntLogo" width={45} height={45}/></h1>
            </div>
            <Card 
                sx={{ 
                maxWidth: '38.59rem',
                borderRadius: '1rem', 
                padding: '2rem 1.5rem 2rem', 
                margin: '0 auto', 
                }}
                className="register-card"
            >
                <Typography variant='h4'>Register</Typography>
                <Typography variant='body'>Fill out the form to create an account</Typography>
                <form id={"log-in"} method={"post"} style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                    <TextField
                        id={"crFirstName"}
                        label={"First Name"}
                        value={firstName}
                        error={firstNameError}
                        helperText={firstNameError ? "Invalid characters" : ""}
                        variant={"outlined"}
                        margin={"normal"}
                        onChange={(e) => {setFirstName(e.target.value)}}
                        sx={intputStyles}
                    />
                    <TextField
                        id={"crLastName"}
                        label={"Last Name"}
                        value={lastName}
                        error={lastNameError}
                        helperText={lastNameError ? "Invalid characters" : ""}
                        variant={"outlined"}
                        margin={"normal"}
                        onChange={(e) => {setLastName(e.target.value)}}
                        sx={intputStyles}
                    />
                    <TextField
                        id={"crEmail"}
                        label={"Email"}
                        helperText={emailError ? "Please enter a valid email address." : ""}
                        value={email}
                        error={emailError}
                        variant={"outlined"}
                        margin={"normal"}
                        onChange={(e) => {setEmail(e.target.value)}}
                        sx={intputStyles}
                    />
                    <Divider component="div" sx={{flex: '0 0 100%'}}/>
                    <TextField
                        id={"crPassword"}
                        label={"Password"}
                        helperText={passwordError ? "Password must be at least 6 characters." : ""}
                        value={password}
                        error={passwordError}
                        variant={"outlined"}
                        type={"password"}
                        margin={"normal"}
                        onChange={(e) => {handlePasswordInput(e)}}
                        sx={intputStyles}
                    />
                    <TextField
                        id={"confirmPassword"}
                        label={"Confirm Password"}
                        helperText={confirmedPasswordError ? "Passwords do not match." : ""}
                        value={confirmedPassword}
                        error={confirmedPasswordError}
                        variant={"outlined"}
                        type={"password"}
                        margin={"normal"}
                        onChange={(e) => {setConfirmedPassword(e.target.value)}}
                        sx={intputStyles}
                    />
                    <Button 
                        id={"logButton"} 
                        variant="contained" 
                        onClick={(e) => {handleSignUp(e)}} 
                        sx={{maxWidth: '340px', width: '100%', margin: '1rem auto'}}
                    >
                        Create account
                    </Button>
                </form>
                <div className="login-section">
                    <p>Already have an account?{" "}
                        <span style={{ color: "orange", cursor: "pointer" }} onClick={() => navigate("/login")}>
                                Log in
                        </span>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default RegistrationPage;