import React, {useState} from "react";
import {Button, TextField} from "@mui/material";
import logo from '@images/BookHuntLogoSmall.png'
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from "@/../firebase.js";

const RegistrationPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmedPasswordError, setConfirmedPasswordError] = useState(false);

    async function handleSignUp(e){
        e.preventDefault();
        if (!validateEmail()) {
            setEmailError(true);
            return
        }
        setEmailError(false);
        setConfirmedPasswordError(false);
        if (password === confirmedPassword) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    console.log(user);
                    alert("Account Created");
                    navigate("/login");
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else {
            setConfirmedPasswordError(true);
        }
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+.\.[^\s@]+$/;
        return emailRegex.test(email);
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
        <>
            <div className={"site-title"}>
                <h1 className={"appName"}>Book Hunt <img src={logo} alt="BookHuntLogo" width={45} height={45}/></h1>
            </div>
            <div className={"sign-in-area"}>
                <form id={"log-in"} method={"post"}>
                    <h1>Register</h1>
                    <TextField
                        id={"crEmail"}
                        label={"Email"}
                        helperText={emailError ? "Please enter a valid email address." : ""}
                        value={email}
                        error={emailError}
                        variant={"outlined"}
                        margin={"normal"}
                        onChange={(e) => {setEmail(e.target.value)}}
                        sx={{
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
                        }}
                    />
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
                        sx={{
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
                        }}
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
                        sx={{
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
                        }}
                    />
                    <Button id={"logButton"} variant="contained" onClick={(e) => {handleSignUp(e)}} sx={{m: 2}}>
                        Create
                    </Button>
                </form>
                <div className={"login-section"}>
                    <p>Already have an account?{" "}
                        <span style={{ color: "orange", cursor: "pointer" }} onClick={() => navigate("/login")}>
                                Log in
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default RegistrationPage;