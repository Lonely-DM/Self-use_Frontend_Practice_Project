// src/pages/Category.jsx
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import HeadlineCard from "../components/HeadlineCard";

export default function Category({ data }) {
  const { name } = useParams();
  const list = useMemo(() => {
    const all = [];
    // 将 hero 与 headlines 混合后按类别筛选
    if (data.hero && data.hero.category === name) {
      all.push({ ...data.hero, id: "hero" });
    }
    all.push(...data.headlines.filter((h) => h.category === name));
    return all;
  }, [name, data]);

  return (
    <main className="container" style={{ padding: "24px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>{name}</h1>
        <Link to="/" style={{ color: "var(--brand)", fontWeight: 700 }}>
          返回首页
        </Link>
      </div>

      {list.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>暂无该频道内容，稍后再来看看～</p>
      ) : (
        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
          }}
        >
          {list.map((item) => (
            <HeadlineCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
