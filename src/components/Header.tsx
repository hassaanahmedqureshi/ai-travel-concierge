export default function Header() {
  return (
    <header style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", borderBottom: "1px solid #e4e4e7", padding: "14px 24px", background: "#fff" }}>
      <span className="material-symbols-outlined" style={{ color: "#3f3f46" }}>airlines</span>
      <h1 style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#18181b" }}>
        AI Travel Concierge
      </h1>
    </header>
  );
}
