"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Itinerary } from "@/lib/types";

export default function ItinerariesPage() {
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/login"); return; }
            const { data } = await supabase.from("itineraries").select("*").order("created_at", { ascending: false });
            setItineraries(data ?? []);
            setLoading(false);
        }
        load();
    }, [router]);

    async function handleDelete(id: string) {
        await supabase.from("itineraries").delete().eq("id", id);
        setItineraries((prev) => prev.filter((i) => i.id !== id));
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f4f4f5", fontFamily: "inherit" }}>
            <header style={{ background: "#fff", borderBottom: "1px solid #e4e4e7", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                <button onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#71717a", fontFamily: "inherit" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
                    Back
                </button>
                <h1 style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#18181b" }}>
                    My Itineraries
                </h1>
            </header>

            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>
                {loading && <p style={{ textAlign: "center", color: "#a1a1aa", fontSize: "13px" }}>Loading...</p>}

                {!loading && itineraries.length === 0 && (
                    <div style={{ textAlign: "center", marginTop: "60px", color: "#a1a1aa" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#d4d4d8", display: "block", marginBottom: "12px" }}>bookmark</span>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: "#52525b" }}>No saved itineraries yet</p>
                        <p style={{ fontSize: "12px", marginTop: "6px" }}>Go plan a trip and save it!</p>
                        <button onClick={() => router.push("/")} style={{ marginTop: "16px", padding: "8px 20px", borderRadius: "999px", background: "#18181b", color: "#fff", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                            Plan a Trip
                        </button>
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {itineraries.map((item) => (
                        <div key={item.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e4e4e7", padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                            <div>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: "#18181b" }}>{item.title}</p>
                                <p style={{ fontSize: "12px", color: "#a1a1aa", marginTop: "2px" }}>
                                    {new Date(item.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                style={{ display: "flex", alignItems: "center", padding: "6px", borderRadius: "999px", border: "1px solid #fecaca", background: "#fff5f5", cursor: "pointer", color: "#ef4444" }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}