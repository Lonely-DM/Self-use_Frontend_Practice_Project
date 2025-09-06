// src/components/Ticker.jsx
export default function Ticker({ items = [] }) {
  return (
    <div style={{ borderTop: "1px solid var(--border)", background: "#f3f4f6" }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
        overflowX: "auto", whiteSpace: "nowrap"
      }}>
        <span style={{
          background: "#0f172a",
          color: "#fff", fontWeight: 800, fontSize: 12,
          padding: "4px 8px", borderRadius: 6,
        }}>
          快讯
        </span>
        {items.map((t, i) => (
          <span key={i} style={{ color: "#374151", fontSize: 14 }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
