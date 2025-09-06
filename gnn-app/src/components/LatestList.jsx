// src/components/LatestList.jsx
import { useMemo, useState } from "react";

export default function LatestList({ items = [] }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim();
    if (!s) return items;
    return items.filter((i) => i.title.includes(s));
  }, [q, items]);

  return (
    <section className="card" style={{ padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900 }}>最新</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索最新"
          style={{
            width: 160, padding: "8px 10px", border: "1px solid var(--border)",
            borderRadius: 10, fontSize: 12, outline: "none"
          }}
        />
      </div>
      <ul style={{ display: "grid", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
        {list.map((a) => (
          <li key={a.id} style={{ display: "flex", gap: 12 }}>
            <a href="#" style={{ display: "flex", gap: 12, width: "100%" }}>
              <div style={{
                width: 128, height: 80, overflow: "hidden", borderRadius: 10, flexShrink: 0
              }}>
                <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, margin: 0 }}>
                  {a.title}
                </h4>
                <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "var(--muted)" }}>{a.time}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
