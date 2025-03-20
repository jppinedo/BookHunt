import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {Button, Container, IconButton, TextField} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AuthContext } from "@state/AuthContext";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { app } from "@/../firebase.js";
import BookCardSeller from "@custom/Books/BookCardSeller.jsx";

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const db = getFirestore(app)

    const [fullName, setFullName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [listedBooks, setListedBooks] = useState([])

    const [deleteVisible, setDeleteVisible] = useState(false);
    const [sideNavVisible, setSideNavVisible] = useState(false);
    const [profileSettingsVisible, setProfileSettingsVisible] = useState(true);
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
                console.error("Error fetching user full name: ", error)
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
                console.error("Error fetching listed books!", error);
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
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential)
        await deleteDoc(doc(db, "userInfo", user.uid));
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

    function showPage(page) {
        switch (page) {
            case "profileSettings":
                setProfileSettingsVisible(true);
                setBookListingVisible(false);
                showSideNav();
                break;
            case "bookListing":
                setProfileSettingsVisible(false);
                setBookListingVisible(true);
                showSideNav();
                break;
            default:
                break;
        }
    }

    function showDelete(option) {
        if (option === true) {
            setDeleteVisible(true);
        }
        else {
            setDeleteVisible(false);
        }
    }

    function showSideNav() {
        setSideNavVisible(prevState => !prevState)
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

    const BookListingView = () => (
        <div className={"profile-background"}>
            <div className={"page-title"}>
                <h1 style={{margin: "0 0 25px"}}>Book Listings</h1>
            </div>
            <div className={"divider"}/>
            {sideNavVisible ?
                <>
                    <div className={"profile-side-nav"}>
                        <h3>Account Settings</h3>
                        <Button variant="contained" onClick={() => showPage("profileSettings")} sx={{width: "175px", m: "5px"}}>Profile Settings</Button>
                        <Button variant="contained" onClick={() => showPage("bookListing")} sx={{width: "175px", m: "5px"}}>Book Listings</Button>
                    </div>
                </> : null}
            <IconButton onClick={showSideNav} sx={{display: "flex", ml: "15px"}}>
                {sideNavVisible ? <ArrowForwardIosIcon/> : <ArrowBackIosNewIcon/>}
            </IconButton>
            <Container sx={{maxHeight: "500px", overflowY: "auto"}}>
                {listedBooks.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {listedBooks.map((item, index) => (
                            <BookCardSeller key={`${item.id}-${index}`} book={item} type="grid" onCardClick={handleBookClick} />
                        ))}
                    </div>
                ) : (
                    <p>No listed books found.</p>
                )}
            </Container>
        </div>
    )

    const ProfileSettings = () => (
        <div className={"profile-background"}>
            <div className={"page-title"}>
                <h1 style={{margin: "0 0 25px"}}>Profile</h1>
            </div>
            <div className={"divider"}/>
            {sideNavVisible ?
                <>
                    <div className={"profile-side-nav"}>
                        <h3>Account Settings</h3>
                        <Button variant="contained" onClick={() => showPage("profileSettings")} sx={{width: "175px", m: "5px"}}>Profile Settings</Button>
                        <Button variant="contained" onClick={() => showPage("bookListing")} sx={{width: "175px", m: "5px"}}>Book Listings</Button>
                    </div>
                </> : null}
            <IconButton onClick={showSideNav} sx={{display: "flex", ml: "15px"}}>
                {sideNavVisible ? <ArrowForwardIosIcon/> : <ArrowBackIosNewIcon/>}
            </IconButton>
            <div className={"info-area"}>
                <div className={"name-section"}>
                    <h2 style={{marginRight: "auto", marginLeft: "10%"}}>Name</h2>
                    <TextField
                        variant={"outlined"}
                        value={fullName}
                        disabled={true}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                height: "30px"
                            },
                            marginRight: "5%"
                        }}
                    />
                </div>
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
                            },
                            marginRight: "5%"
                        }}
                    />
                </div>
                <div className={"new-pass-section"}>
                    <h2 style={{marginRight: "auto", marginLeft: "10%"}}>New Password</h2>
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
                            },
                            marginRight: "5%"
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
                            <Button variant="contained" onClick={(e) => {
                                deleteAccount(e)
                            }} sx={{marginRight: "10px", width: "100px", backgroundColor: "red"}}>
                                Yes
                            </Button>
                            <Button variant="contained" onClick={() => {
                                showDelete(false)
                            }} sx={{marginLeft: "10px", width: "100px", backgroundColor: "red"}}>
                                No
                            </Button>
                        </> : null}
                </div>
            </div>
        </div>
    )

    return (
        <>
            {profileSettingsVisible ? <ProfileSettings/> : null}
            {bookListingVisible ? <BookListingView /> : null}
        </>
    );
};

export default ProfilePage;