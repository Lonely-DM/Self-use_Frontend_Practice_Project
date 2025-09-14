// src/components/Hero.jsx
import "./Hero.css";

export default function Hero({ data }) {
  if (!data) return null;

  return (
    <a href="#" className="card hero">
      <div className="hero-media">
        <img className="hero-img" src={data.image} alt={data.title} />
      </div>

      <div className="hero-body">
        <span className="badge">{data.category}</span>
        <h1 className="hero-title">{data.title}</h1>
        <p className="hero-subtitle">{data.subtitle}</p>
      </div>
    </a>
  );
}
