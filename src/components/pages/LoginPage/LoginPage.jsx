import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Title } from "@jppinedo/lienzo";
import AuthBrand from '@custom/Shared/AuthBrand';
import { AppContext } from '@state/AppContext';
import { AuthContext } from '@state/AuthContext';

/**
 * LoginPage — was MUI Button/TextField/Typography/Card + Firebase
 * signInWithEmailAndPassword. Now Lienzo Card/Title/Input/Button and the
 * mock AuthContext signIn (any credentials sign in as the demo user).
 * D1: the password field is Lienzo Input with htmlType="password" — the
 * PasswordField workaround (from when Input hardcoded type="text") is
 * deleted, so both fields share the fixed 48px Input height.
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const { onShowError } = useContext(AppContext);
    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e){
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate("/search");
        } catch (error) {
            console.log(error);
            onShowError(error);
        }
    }

    return (
        <>
            <AuthBrand />
            <Card className="max-w-[24em] mx-auto">
                <form id={"log-in"} method={"post"} onSubmit={handleLogin}>
                    <Title size="xl" fontFamily="playfair">Welcome</Title>
                    <p>Sign in with your email and password:</p>
                    <div className="mt-5 max-w-[340px] mx-auto text-left">
                        <Input
                            label="Email"
                            htmlType="email"
                            autoComplete="email"
                            placeholder="you@example.edu"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </div>
                    <div className="mt-3 max-w-[340px] mx-auto text-left">
                        <Input
                            id="logPass"
                            label="Password"
                            htmlType="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </div>
                    <div className="mt-4 mb-2 max-w-[340px] mx-auto">
                        <Button
                            label="Login"
                            ariaLabel="Login"
                            onClick={(e) => {handleLogin(e)}}
                        />
                    </div>
                </form>
                <div className={"register-section"}>
                    <p>Don't have an account?{" "}
                        <button type="button" style={{ color: "#e05a5a", fontWeight: 600, cursor: "pointer", background: "none", border: "none", padding: 0, font: "inherit" }} onClick={() => navigate("/registration")}>
                            Register
                        </button>
                    </p>
                </div>
            </Card>
        </>
    );
};

export default LoginPage;
