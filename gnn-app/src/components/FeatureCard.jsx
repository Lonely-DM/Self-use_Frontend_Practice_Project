// src/components/FeatureCard.jsx
import "./FeatureCard.css";

export default function FeatureCard({ item }) {
  if (!item) return null;

  return (
    <a href={item.url || "#"} className="feature-card">
      <div className="feature-media">
        <img src={item.image} alt={item.title} />
      </div>
      <div className="feature-body">
        <span className="badge feature-category">{item.category}</span>
        <h3 className="feature-title">{item.title}</h3>
        {item.desc && <p className="feature-desc">{item.desc}</p>}
      </div>
    </a>
  );
}
