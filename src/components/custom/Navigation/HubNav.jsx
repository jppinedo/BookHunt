import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {BottomNavigation, BottomNavigationAction, Box} from '@mui/material';
import { useLocation } from "react-router-dom";

const HubNav = () => {
    const currentLocation = useLocation();
    const navigate = useNavigate();

    const [selectedPage, setSelectedPage] = useState(currentLocation.pathname);

    useEffect(() => {
        setSelectedPage(currentLocation.pathname);
    }, [currentLocation.pathname]);

    return (
        <Box id={"hubNav"} sx={{backgroundColor: "white", borderRadius: 1}}>
            <BottomNavigation
                showLabels
                value={selectedPage}
                onChange={(event, newValue) => {
                    setSelectedPage(newValue);
                    navigate(newValue);
                }}
                sx={{backgroundColor: "transparent", width: "100%"}}
            >
                <BottomNavigationAction label={"Book Search"} value={"/search"}
                                        sx={{
                                            color: currentLocation.pathname === "/search" ? "orange" : "black",
                                            width: 166,
                                            "& .MuiBottomNavigationAction-label": {
                                                fontSize: "1.3rem"
                                            },
                                            "& .Mui-selected": {
                                                color: "orange",
                                                fontSize: "1.4rem !important"
                                            },
                                        }}
                />
                <BottomNavigationAction label={"Books Saved"} value={"/saved"}
                                        sx={{
                                            color: currentLocation.pathname === "/saved" ? "orange" : "black",
                                            width: 166,
                                            "& .MuiBottomNavigationAction-label": {
                                                fontSize: "1.3rem"
                                            },
                                            "& .Mui-selected": {
                                                color: "orange",
                                                fontSize: "1.4rem !important"
                                            },
                                        }}
                />
                <BottomNavigationAction label={"Profile"} value={"/profile"}
                                        sx={{
                                            color: currentLocation.pathname === "/profile" ? "orange" : "black",
                                            width: 166,
                                            "& .MuiBottomNavigationAction-label": {
                                                fontSize: "1.3rem"
                                            },
                                            "& .Mui-selected": {
                                                color: "orange",
                                                fontSize: "1.4rem !important"
                                            },
                                        }}
                />
            </BottomNavigation>
        </Box>
    )
}

export default HubNav;
