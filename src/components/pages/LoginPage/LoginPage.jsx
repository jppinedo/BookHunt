import React from "react";
import {Button, TextField} from "@mui/material";
import logo from '@images/BookHuntLogoSmall.png';

const LoginPage = () => (
    <>
        <div className={"site-title"}>
            <h1 className={"appName"}>Book Hunt <img src={logo} alt="BookHuntLogo" width={45} height={45}/></h1>
        </div>
        <div className={"sign-in-area"}>
            <form id={"log-in"} method={"post"}>
                <h1>Welcome</h1>
                <TextField
                    id={"logName"}
                    label={"Username/Email"}
                    variant={"outlined"}
                    sx={{
                        m: 5,
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "black",
                            borderWidth: "2px",
                        },
                        "& .Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "orange",
                                color: "orange",
                            },
                        },
                        "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "orange",
                            },
                        },
                        "& .MuiInputLabel-outlined": {
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
                    sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "black",
                            borderWidth: "2px",
                        },
                        "& .Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "orange",
                                color: "orange",
                            },
                        },
                        "&:hover": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "orange",
                            },
                        },
                        "& .MuiInputLabel-outlined": {
                            color: "black",
                            "&.Mui-focused": {
                                color: "orange",
                            },
                        },
                    }}
                />
                <Button id={"logButton"} variant="contained" sx={{m: 2}}>
                    Login
                </Button>
            </form>
            <div className={"register-section"}>
                <p>Don't have an account? Register</p>
            </div>
        </div>
    </>
  );

  export default LoginPage;