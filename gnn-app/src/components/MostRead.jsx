// src/components/MostRead.jsx
export default function MostRead({ items = [] }) {
  return (
    <section className="card" style={{ padding: 12, marginTop: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>热读榜</h2>
      <ol style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 10, margin: 0 }}>
        {items.map((m, idx) => (
          <li key={m.id} style={{ display: "flex", gap: 10, alignItems: "start" }}>
            <span style={{
              display: "inline-flex", width: 24, height: 24, borderRadius: "999px",
              background: "#0f172a", color: "#fff", fontSize: 12, fontWeight: 900,
              alignItems: "center", justifyContent: "center", marginTop: 2
            }}>
              {idx + 1}
            </span>
            <a href="#" style={{ fontSize: 14, fontWeight: 600 }}>
              {m.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
