import {User} from "@supabase/auth-js";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "@/lib/supabase";

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
            setUser(session?.user ?? null);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        setUser(null);
    }

    return (
        <header style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e4e4e7", padding: "14px 24px", background: "#fff" }}>
            <div style={{ width: "120px" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ color: "#3f3f46" }}>airlines</span>
                <h1 style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#18181b" }}>
                    AI Travel Concierge
                </h1>
            </div>

        <div style={{ width: "120px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            {user ? (
                <>
                    <button
                        onClick={() => router.push("/itineraries")}
                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "999px", border: "1px solid #e4e4e7", background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#18181b" }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>bookmark</span>
                        Saved
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "999px", border: "1px solid #e4e4e7", background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#18181b" }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
                    </button>
                </>
            ) : (
                <button
                    onClick={() => router.push("/login")}
                    style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 16px", borderRadius: "999px", background: "#18181b", color: "#fff", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>login</span>
                    Login
                </button>
            )}
        </div>
    </header>
  );
}
