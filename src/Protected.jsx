import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@state/AuthContext.jsx";

export function Protected({children}) {
    const { user } = useContext(AuthContext);
    // Router location, not the global `location` (see App.jsx: MemoryRouter).
    const { pathname } = useLocation();

    if (!user) {
        if (pathname === "/login" || pathname === "/registration") {
            return children;
        }
        return <Navigate to={"/login"} replace/>
    }
    else {
        return children;
    }

}
