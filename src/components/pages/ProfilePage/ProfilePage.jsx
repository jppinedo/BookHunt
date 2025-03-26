import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {Button, Container, IconButton, TextField, Divider, Tab, Tabs} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AuthContext } from "@state/AuthContext";
import { AppContext } from '@state/AppContext';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { app } from "@/../firebase.js";
import BookCardSeller from "@custom/Books/BookCardSeller.jsx";
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const { onShowError } = useContext(AppContext);
    const navigate = useNavigate();
    const db = getFirestore(app)

    const [fullName, setFullName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [listedBooks, setListedBooks] = useState([])

    const [deleteVisible, setDeleteVisible] = useState(false);
    const [sideNavVisible, setSideNavVisible] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [bookListingVisible, setBookListingVisible] = useState(false);

    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);

    useEffect(() => {
        async function getName() {
            if (!user) return;

            try {
                const docRef = doc(db, "userInfo", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFullName(`${data.firstName} ${data.lastName}`);
                }
                else {
                    console.warn("No document found!");
                    setFullName("");
                }
            }
            catch (error) {
                onShowError(error);
            }
        }

        getName()
    }, [user])

    useEffect(() => {
        if (!user) return;

        const fetchListedBooks = async () => {
            try {
                const docRef = doc(db, "userInfo", user.uid);
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const booksListed = docSnap.data().booksListed || [];

                    const booksFetched = booksListed.map(async (bookID) => {
                        const bookDocRef = doc(db, "books", bookID);
                        const bookDocSnap = await getDoc(bookDocRef);
                        return bookDocSnap.exists() ? { id: bookDocSnap.id, ...bookDocSnap.data() } : null;
                    });

                    const booksData = (await Promise.all(booksFetched)).filter(book => book !== null);
                    setListedBooks(booksData);
                }
            }
            catch (error) {
                onShowError(error);
            }
        }

        fetchListedBooks();
    }, [user]);

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
                    onShowError(error);
                })
        }
        catch (error) {
            console.log(error);
        }
    }

    async function deleteAccount(e) {
        e.preventDefault();
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential)
        await deleteDoc(doc(db, "userInfo", user.uid));
        await deleteUser(user)
            .then(() => {
                alert("Account successfully deleted.");
                navigate("/login");
            })
            .catch((error) => {
                onShowError(error);
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

    const handleBookClick = (item) => {
        navigate(`/bookConfig/${item.sellerType}/${item.id}`);
    }

    const changeTab = (item) => {
        console.log(item)
        switch(item.id) {
            case 'profile-tab':
                setTabIndex(0);
                break;
            case 'listings-tab':
                setTabIndex(1);
        }
    }

    const BookListingView = () => (
        <>
            <Container sx={{maxHeight: "500px", overflowY: "auto", paddingTop: '2rem', paddingBottom: '2rem'}}>
                {listedBooks.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {listedBooks.map((item, index) => (
                            <BookCardSeller 
                                key={`${item.id}-${index}`} 
                                book={item} 
                                type="grid" 
                                onCardClick={handleBookClick} 
                            />
                        ))}
                    </div>
                ) : (
                    <p>No listed books found.</p>
                )}
            </Container>
        </>
    )

    const ProfileSettings = () => (
        <>
            <div className={"info-area"} style={{padding: '2rem'}}>
                <div className={"name-section"}>
                    <h4 style={{marginRight: "auto"}}>Name</h4>
                    <TextField
                        variant={"outlined"}
                        value={fullName}
                        disabled={true}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: "30px"
                            }
                        }}
                    />
                </div>
                <div className={"email-section"}>
                    <h4 style={{marginRight: "auto"}}>Email</h4>
                    <TextField
                        variant={"outlined"}
                        value={user.email}
                        disabled={true}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: "30px"
                            }
                        }}
                    />
                </div>
                <div className={"old-pass-section"}>
                    <h4 style={{marginRight: "auto"}}>Old Password</h4>
                    <TextField
                        variant={"outlined"}
                        onChange={(e) => {
                            setOldPassword(e.target.value)
                        }}
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
                            }

                        }}
                    />
                </div>
                <div className={"new-pass-section"}>
                    <h4 style={{marginRight: "auto"}}>New Password</h4>
                    <TextField
                        variant={"outlined"}
                        onChange={(e) => {
                            handlePasswordInput(e)
                        }}
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
                            }
                        }}
                    />
                </div>
                <Button variant="contained" onClick={(e) => {
                    changePassword(e)
                }} sx={{mt: 4, width: "300px"}}>
                    Change Password
                </Button>
                <Button variant="contained" onClick={() => {
                    showDelete(true)
                }} sx={{mt: 5, width: "300px", backgroundColor: "red"}}>
                    Delete Account
                </Button>
                <div>
                    {deleteVisible ?
                        <>
                            <h3 style={{marginTop: 10}}>This is permanent. Do you want to proceed? Please type old
                                password in text box.</h3>
                            <Button 
                                variant="contained" 
                                onClick={(e) => deleteAccount(e)} 
                                className="delete-account-btn"
                                sx={{marginRight: "10px", width: "100px", backgroundColor: "red"}}
                            >
                                Yes
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() =>  showDelete(false)} 
                                className="delete-account-btn"
                                sx={{marginLeft: "10px", width: "100px", backgroundColor: "red"}}
                            >
                                No
                            </Button>
                        </> : null}
                </div>
            </div>
        </>
    )

    return (
        <div className={"profile-background"} style={{marginTop: '3rem', marginBottom: '6rem'}}>
            <Tabs 
                value={tabIndex} 
                onChange={(e) => changeTab(e.target)} 
                aria-label="Profile tabs"
                sx={{borderBottom: '2px solid #eee'}}
                variant="fullWidth"
            >
                <Tab label="Profile" id="profile-tab" aria-controls="tabpanel" />
                <Tab label="Book Listings" id="listings-tab" aria-controls="tabpanel" />
            </Tabs>
            {tabIndex === 0 ? <ProfileSettings/> : null}
            {tabIndex === 1 ? <BookListingView /> : null}
        </div>
    );
};

export default ProfilePage;