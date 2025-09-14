// src/components/LatestList.jsx
import { useMemo, useState } from "react";
import "./LatestList.css";

export default function LatestList({ items = [] }) {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim();
    if (!s) return items;
    return items.filter((i) => i.title.includes(s));
  }, [q, items]);

  return (
    <section className="card latest">
      <div className="latest-head">
        <h2 className="latest-title">最新</h2>
        <input
          className="latest-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索最新"
          aria-label="搜索最新"
        />
      </div>

      <ul className="latest-list">
        {list.map((a) => (
          <li key={a.id} className="latest-item">
            <a href="#" className="latest-link">
              <div className="latest-thumb">
                <img src={a.image} alt={a.title} />
              </div>
              <div className="latest-meta">
                <h4 className="latest-item-title">{a.title}</h4>
                <p className="latest-time">{a.time}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
