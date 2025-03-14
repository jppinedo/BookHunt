import React, {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { AuthContext } from "@state/AuthContext";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [deleteVisible, setDeleteVisible] = useState(false);

    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);

    async function changePassword(e) {
        e.preventDefault();
        setOldPasswordError(false);

        try {
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential)
            await updatePassword(user, newPassword)
                .then(() => {
                    alert("Password successfully updated!");
                    setOldPassword('');
                    setNewPassword('');
                })
                .catch((error) => {
                    console.log(error);
                    alert("Something went wrong!");
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    async function deleteAccount(e) {
        e.preventDefault();
        await deleteUser(user)
            .then(() => {
                alert("Account successfully deleted.");
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
                alert("Something went wrong!");
            })
    }

    function showDelete(option) {
        if (option === true) {
            setDeleteVisible(true);
        }
        else {
            setDeleteVisible(false);
        }
    }

    const handlePasswordInput = e => {
        setNewPassword(e.target.value);
        if (newPassword.length >= 6) {
            setNewPasswordError(false);
        }
        else {
            setNewPasswordError(true);
        }
    }

    return (
        <>
            <div className={"profile-background"}>
                <div className={"site-title"}>
                    <h1 className={"appName"}>Profile</h1>
                </div>
                <div className={"divider"}/>
                <div className={"info-area"}>
                    <div className={"email-section"}>
                        <h2 style={{marginRight: "auto", marginLeft: "10%"}}>Email</h2>
                        <TextField
                            variant={"outlined"}
                            value={user.email}
                            disabled={true}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    height: "30px"
                                },
                                marginRight: "5%"
                            }}
                        />
                    </div>
                    <div className={"old-pass-section"}>
                        <h2 style={{marginRight: "auto", marginLeft: "10%"}}>Old Password</h2>
                        <TextField
                            variant={"outlined"}
                            onChange={(e) => {setOldPassword(e.target.value)}}
                            error={oldPasswordError}
                            helperText={oldPasswordError ? "Passwords do not match!" : ""}
                            sx={{
                                "& .MuiFormHelperText-root": {
                                    width: "200px"
                                },
                                "& .MuiOutlinedInput-root": {
                                    height: "30px",
                                    "&:hover fieldset": {
                                        borderColor: "orange", // Ensures hover effect applies
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "orange",
                                    }
                                },
                                "& .MuiInputBase-input": {
                                    padding: "0 14px"
                                },
                                marginRight: "5%"
                            }}
                        />
                    </div>
                    <div className={"new-pass-section"}>
                        <h2 style={{marginRight: "auto", marginLeft: "10%"}}>New Password</h2>
                        <TextField
                            variant={"outlined"}
                            onChange={(e) => {handlePasswordInput(e)}}
                            error={newPasswordError}
                            helperText={newPasswordError ? "Password must be at least 6 characters." : ""}
                            sx={{
                                "& .MuiFormHelperText-root": {
                                    width: "190px"
                                },
                                "& .MuiOutlinedInput-root": {
                                    height: "30px",
                                    "&:hover fieldset": {
                                        borderColor: "orange", // Ensures hover effect applies
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "orange",
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    padding: "0 14px"
                                },
                                marginRight: "5%"
                            }}
                        />
                    </div>
                    <Button variant="contained" onClick={(e) => {changePassword(e)}} sx={{m: 8, width: "300px"}}>
                        Change Password
                    </Button>
                    <Button variant="contained" onClick={() => {showDelete(true)}} sx={{mt: 5, width: "300px", backgroundColor: "red"}}>
                        Delete Account
                    </Button>
                    <div>
                        {deleteVisible ?
                            <>
                                <h3 style={{marginTop: 10}}>This is permanent. Do you want to proceed?</h3>
                                <Button variant="contained" onClick={(e) => {deleteAccount(e)}} sx={{marginRight: "10px", width: "100px", backgroundColor: "red"}}>
                                    Yes
                                </Button>
                                <Button variant="contained" onClick={() => {showDelete(false)}} sx={{marginLeft: "10px", width: "100px", backgroundColor: "red"}}>
                                    No
                                </Button>
                            </> : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;