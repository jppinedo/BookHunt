import React, {useState} from "react";
import {Button, TextField} from "@mui/material";
import logo from '@images/BookHuntLogoSmall.png'
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth, app } from "@/../firebase.js";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const RegistrationPage = () => {
    const navigate = useNavigate();

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
                    console.log(error);
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

    return (
        <>
            <div className={"site-title"}>
                <h1 className={"appName"}>Book Hunt <img src={logo} alt="BookHuntLogo" width={45} height={45}/></h1>
            </div>
            <div className={"sign-in-area"}>
                <form id={"log-in"} method={"post"}>
                    <h1>Register</h1>
                    <TextField
                        id={"crFirstName"}
                        label={"First Name"}
                        value={firstName}
                        error={firstNameError}
                        helperText={firstNameError ? "Invalid characters" : ""}
                        variant={"outlined"}
                        margin={"normal"}
                        onChange={(e) => {setFirstName(e.target.value)}}
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
                        id={"crLastName"}
                        label={"Last Name"}
                        value={lastName}
                        error={lastNameError}
                        helperText={lastNameError ? "Invalid characters" : ""}
                        variant={"outlined"}
                        margin={"normal"}
                        onChange={(e) => {setLastName(e.target.value)}}
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