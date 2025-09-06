// src/pages/Home.jsx
import "./Home.css";
import Hero from "../components/Hero";
import HeadlineCard from "../components/HeadlineCard";
import LatestList from "../components/LatestList";
import MostRead from "../components/MostRead";

export default function Home({ data }) {
  const { hero, headlines, latest, mostRead } = data;

  return (
    <main>
      <div className="container home-grid">
        {/* 左：头条 + 副头条 */}
        <section className="home-left">
          <Hero data={hero} />
          <div className="headline-grid">
            {headlines.map((h) => (
              <HeadlineCard key={h.id} item={h} />
            ))}
          </div>
        </section>

        {/* 右：最新 + 热读榜 */}
        <aside className="home-right">
          <LatestList items={latest} />
          <MostRead items={mostRead} />
        </aside>
      </div>

      {/* 示例：深度专题区块，你可做分页或更多内容 */}
      <div className="container feature-wrap">
        <div className="feature-head">
          <h2>深度 · 专题</h2>
          <a className="more-link" href="#">更多</a>
        </div>
        <div className="feature-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <a key={i} href="#" className="card feature-card">
              <div className="feature-media">
                <img
                  src={`https://images.unsplash.com/photo-15${40 + i}0000000-abcdef012345?q=80&w=1200&auto=format&fit=crop`}
                  alt="专题配图"
                />
              </div>
              <div className="feature-body">
                <p className="feature-tag">Feature</p>
                <h3>专题：边境恒星基地的供给链与舰队后勤</h3>
                <p className="feature-desc">
                  从能源币结算到跨物种口味适配，后勤系统如何影响远征节奏？
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
