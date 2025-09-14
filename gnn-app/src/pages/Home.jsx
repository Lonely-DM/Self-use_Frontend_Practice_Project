// src/pages/Home.jsx
import "./Home.css";
import Hero from "../components/Hero";
import HeadlineCard from "../components/HeadlineCard";
import LatestList from "../components/LatestList";
import MostRead from "../components/MostRead";
import FeatureCard from "../components/FeatureCard";

export default function Home({ data }) {
  const { hero, headlines, latest, mostRead, features = [] } = data;

  return (
    <main>
      <div className="container home-grid">
        <section className="home-left">
          <Hero data={hero} />
          <div className="headline-grid">
            {headlines.slice(0, 3).map((h) => (
              <HeadlineCard key={h.id} item={h} />
            ))}
          </div>
        </section>

        <aside className="home-right">
          <LatestList items={latest} />
          <MostRead items={mostRead} />
        </aside>
      </div>

      {/* 深度 · 专题 */}
      <div className="container feature-wrap">
        <div className="feature-head">
          <h2>深度 · 专题</h2>
          <a className="more-link" href="#">更多</a>
        </div>
        <div className="feature-grid">
          {features.slice(0, 6).map((f) => (
            <FeatureCard key={f.id} item={f} />
          ))}
        </div>
      </div>
    </main>
  );
}
