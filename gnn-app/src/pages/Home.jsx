import "./Home.css";
import Hero from "../components/Hero";
import HeadlineCard from "../components/HeadlineCard";
import LatestList from "../components/LatestList";
import MostRead from "../components/MostRead";
import FeatureCard from "../components/FeatureCard";

export default function Home({ data }) {
  const { hero, headlines = [], latest = [], mostRead = [], features = [] } = data;

  // 顶区：左右各 2 条
  const leftHeadlines = headlines.slice(0, 2);
  const rightHeadlines = headlines.slice(2, 4);

  return (
    <main>
      {/* 顶区：左2条 | 中间Hero | 右2条 */}
      <div className="container-wide top-grid">
        <section className="headlines-left">
          {leftHeadlines.map((h) => (
            <HeadlineCard key={h.id} item={h} />
          ))}
        </section>

        <section className="hero-center">
          <Hero data={hero} />
        </section>

        <section className="headlines-right">
          {rightHeadlines.map((h) => (
            <HeadlineCard key={h.id} item={h} />
          ))}
        </section>
      </div>

      {/* 侧栏行：最新（左） | 热读（右） */}
      <div className="container-wide rail-grid">
        <section className="rail-latest">
          <LatestList items={latest} />
        </section>
        <aside className="rail-mostread">
          <MostRead items={mostRead} />
        </aside>
      </div>

      {/* 深度 · 专题 */}
      <div className="container-wide feature-wrap">
        <div className="feature-head">
          <h2>深度 · 专题</h2>
          <a className="more-link" href="#">更多</a>
        </div>
        <div className="feature-grid">
          {features.slice(0, 8).map((f) => (
            <FeatureCard key={f.id} item={f} />
          ))}
        </div>
      </div>
    </main>
  );
}
