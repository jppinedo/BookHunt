import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@state/AuthContext.jsx";

export function Protected({children}) {
    const { user } = useContext(AuthContext);

    if (!user) {
        if (location.pathname === "/login" || location.pathname === "/registration") {
            return children;
        }
        return <Navigate to={"/login"} replace/>
    }
    else {
        return children;
    }

}