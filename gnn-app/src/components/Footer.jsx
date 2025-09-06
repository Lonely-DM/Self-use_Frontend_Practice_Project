// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "#fff", marginTop: 24 }}>
      <div className="container" style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16,
        padding: "24px 0"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              background: "var(--brand)", color: "#fff", fontWeight: 900,
              letterSpacing: ".12em", textTransform: "uppercase",
              padding: "6px 8px", borderRadius: 6, fontSize: 14,
            }}>
              GNN
            </span>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>Galactic News Network</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>
            群星宇宙的权威新闻与分析。© {new Date().getFullYear()} GNN
          </p>
        </div>

        <div>
          <strong style={{ fontSize: 14 }}>栏目</strong>
          <ul style={{ padding: 0, margin: "8px 0 0 0", listStyle: "none", display: "grid", gap: 6 }}>
            <li><a href="#">银河</a></li>
            <li><a href="#">深度</a></li>
            <li><a href="#">科技</a></li>
            <li><a href="#">经济</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
