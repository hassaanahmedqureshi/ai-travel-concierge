"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabase";

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    async function handleGoogle(){
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    }

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = isRegister
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

        if ( error ) setError(error.message);
        else router.push("/");
        setLoading(false);
    }
    return(
        <div style={{ minHeight: "100vh", background: "#f4f4f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "inherit" }}>
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #e4e4e7", padding: "40px", width: "100%", maxWidth: "400px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#18181b" }}>airlines</span>
                    <h1 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#18181b", marginTop: "8px" }}>
                        AI Travel Concierge
                    </h1>
                    <p style={{ fontSize: "13px", color: "#a1a1aa", marginTop: "6px" }}>
                        {isRegister ? "Create an account" : "Welcome back"}
                    </p>
                </div>

                {/* Google */}
                <button
                    onClick={handleGoogle}
                    style={{ color: "#000000", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "10px", borderRadius: "999px", border: "1px solid #e4e4e7", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: "20px" }}
                >
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
                    Continue with Google
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <div style={{ flex: 1, height: "1px", background: "#e4e4e7" }} />
                    <span style={{ fontSize: "12px", color: "#a1a1aa" }}>or</span>
                    <div style={{ flex: 1, height: "1px", background: "#e4e4e7" }} />
                </div>

                {/* Email form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: "10px 16px", borderRadius: "999px", border: "1px solid #e4e4e7", fontSize: "13px", outline: "none", fontFamily: "inherit", color: "#18181b", background: "#f4f4f5" }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: "10px 16px", borderRadius: "999px", border: "1px solid #e4e4e7", fontSize: "13px", outline: "none", fontFamily: "inherit", color: "#18181b", background: "#f4f4f5" }}
                    />
                    {error && <p style={{ fontSize: "12px", color: "#ef4444", textAlign: "center" }}>{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: "10px", borderRadius: "999px", background: "#18181b", color: "#fff", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", opacity: loading ? 0.5 : 1 }}
                    >
                        {isRegister ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "12px", color: "#a1a1aa", marginTop: "20px" }}>
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(""); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#18181b", fontWeight: 600, fontSize: "12px", fontFamily: "inherit" }}
                    >
                        {isRegister ? "Sign in" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    )
}