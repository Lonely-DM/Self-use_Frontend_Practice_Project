// src/pages/Category.jsx
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import "./Category.css";

export default function Category({ data }) {
  const { category: raw } = useParams();
  const category = decodeURIComponent(raw || "").trim();

  const { hero, headlines = [], latest = [], features = [] } = data || {};

  const sameCategory = (a = "", b = "") =>
    a.toString().trim().toLowerCase() === b.toString().trim().toLowerCase();

  // 合并四类内容 → 统一用 FeatureCard 展示
  const items = useMemo(() => {
    const list = [];

    const pushIfMatch = (obj, type) => {
      if (obj && sameCategory(obj.category, category)) {
        list.push({
          ...obj,
          id: `${type}-${obj.id || "0"}`,
          // 适配 FeatureCard：无 desc 时用 subtitle 兜底
          desc: obj.desc ?? obj.subtitle ?? "",
        });
      }
    };

    pushIfMatch(hero, "hero");
    headlines.forEach((i) => pushIfMatch(i, "headline"));
    latest.forEach((i) => pushIfMatch(i, "latest"));
    features.forEach((i) => pushIfMatch(i, "feature"));

    return list;
  }, [hero, headlines, latest, features, category]);

  return (
    <main className="container channel">
      <header className="channel-head">
        <h1 className="channel-title">{category}</h1>
        <Link to="/" className="channel-back">返回首页</Link>
      </header>

      {items.length === 0 ? (
        <div className="channel-empty">暂无“{category}”相关内容。</div>
      ) : (
        <>
          <div className="channel-count">共 {items.length} 条</div>
          <div className="feature-grid channel-feature-grid">
            {items.map((it) => (
              <FeatureCard key={it.id} item={it} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
