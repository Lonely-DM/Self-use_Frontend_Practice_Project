import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import HeadlineCard from "../components/HeadlineCard";
import FeatureCard from "../components/FeatureCard";
import Hero from "../components/Hero";
import "./Category.css";

export default function Category({ data }) {
  const { category: raw } = useParams();
  const category = decodeURIComponent(raw || "").trim();

  const { hero, headlines = [], features = [] } = data || {};
  const sameCategory = (a = "", b = "") =>
    a.toString().trim().toLowerCase() === b.toString().trim().toLowerCase();

  // 只取当前分类的数据
  const heads = useMemo(
    () => headlines.filter(h => sameCategory(h.category, category)),
    [headlines, category]
  );
  const feats = useMemo(
    () => features.filter(f => sameCategory(f.category, category)),
    [features, category]
  );

  // Hero 只在它的分类频道页显示，且单独占一行
  const showHero = !!(hero && sameCategory(hero.category, category));

  const hasAny = showHero || heads.length > 0 || feats.length > 0;

  return (
    <main className="container channel">
      <header className="channel-head">
        <h1 className="channel-title">{category}</h1>
        <Link to="/" className="channel-back">返回首页</Link>
      </header>

      {!hasAny && <div className="channel-empty">暂无“{category}”相关内容。</div>}

      {showHero && (
        <section className="channel-hero">
          <Hero data={hero} />
        </section>
      )}

      {heads.length > 0 && (
        <>
          <h2 className="section-title">头条</h2>
          <div className="headline-grid">
            {heads.map(h => <HeadlineCard key={h.id} item={h} />)}
          </div>
        </>
      )}

      {feats.length > 0 && (
        <>
          <h2 className="section-title">深度 · 专题</h2>
          <div className="feature-grid">
            {feats.map(f => <FeatureCard key={f.id} item={f} />)}
          </div>
        </>
      )}
    </main>
  );
}
