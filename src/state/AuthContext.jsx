import { createContext, useState, useEffect} from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false)
            if (currentUser) setUser(currentUser)
            else {setUser(null)}
        });
        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, []);
    const values = {
        user: user,
        setUser: setUser
    }

    return <AuthContext.Provider value={values}>
        {!loading &&
            children
        }
    </AuthContext.Provider>
}