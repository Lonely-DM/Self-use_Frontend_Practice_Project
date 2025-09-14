// src/pages/Channel.jsx
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "./Channel.css";
import HeadlineCard from "../components/HeadlineCard";
import FeatureCard from "../components/FeatureCard";

export default function Channel({ data }) {
  const { category: raw } = useParams();
  // 兼容中文分类：/channel/%E6%B5%8B%E8%AF%95
  const category = decodeURIComponent(raw || "");

  const { headlines = [], features = [] } = data || {};

  // 只展示当前分类相关内容
  const heads = useMemo(
    () => headlines.filter((h) => h.category === category),
    [headlines, category]
  );
  const feats = useMemo(
    () => features.filter((f) => f.category === category),
    [features, category]
  );

  const hasAny = heads.length > 0 || feats.length > 0;

  return (
    <main className="container channel">
      <header className="channel-head">
        <h1 className="channel-title">{category}</h1>
        <Link to="/" className="channel-back">返回首页</Link>
      </header>

      {!hasAny && (
        <div className="channel-empty">
          <p>暂无“{category}”相关内容。</p>
          <p className="tip">你可以先在 <Link to="/">首页</Link> 补充该分类的新闻或专题。</p>
        </div>
      )}

      {heads.length > 0 && (
        <>
          <h2 className="section-title">头条</h2>
          <div className="headline-grid">
            {heads.map((h) => <HeadlineCard key={h.id} item={h} />)}
          </div>
        </>
      )}

      {feats.length > 0 && (
        <>
          <h2 className="section-title">深度 · 专题</h2>
          <div className="feature-grid">
            {feats.map((f) => <FeatureCard key={f.id} item={f} />)}
          </div>
        </>
      )}
    </main>
  );
}
