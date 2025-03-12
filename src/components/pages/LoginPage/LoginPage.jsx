import { useState } from 'react'
import React from "react";
import { useNavigate } from "react-router-dom";
import {Button, TextField} from "@mui/material";
import logo from '@images/BookHuntLogoSmall.png'
import { signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "@/../firebase.js";

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e){
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                console.log(user);
                navigate("/search");
            })
            .catch((error) => {
                console.log(error);
                alert("Invalid credentials.");
            })
    }

    return (
        <>
            <div className={"site-title"}>
                <h1 className={"appName"}>Book Hunt <img src={logo} alt="BookHuntLogo" width={45} height={45}/></h1>
            </div>
            <div className={"sign-in-area"}>
                <form id={"log-in"} method={"post"}>
                    <h1>Welcome</h1>
                    <TextField
                        id={"logName"}
                        label={"Email"}
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
                        id={"logPass"}
                        label={"Password"}
                        variant={"outlined"}
                        type={"password"}
                        margin={"normal"}
                        onChange={(e) => {setPassword(e.target.value)}}
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
                    <Button id={"crButton"} variant="contained" onClick={(e) => {handleLogin(e)}} sx={{m: 2}}>
                        Login
                    </Button>
                </form>
                <div className={"register-section"}>
                    <p>Don't have an account?{" "}
                        <span style={{ color: "orange", cursor: "pointer" }} onClick={() => navigate("/registration")}>
                            Register
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginPage;