import React, { useState } from "react";
import { auth } from "../firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");

        if (!email.includes("@")) {
            setError("Enter valid email");
            return;
        }

        if (password.length < 6) {
            setError("Password must be 6+ characters");
            return;
        }

        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Signup successful ✅");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login successful ✅");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login">
            <h2>{isSignup ? "Signup" : "Login"}</h2>

            <input
                type="email"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSubmit}>
                {isSignup ? "Signup" : "Login"}
            </button>

            <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: "pointer" }}>
                {isSignup ? "Already have account? Login" : "Create new account"}
            </p>

            {error && <p className="error">{error}</p>}
        </div>
    );
}