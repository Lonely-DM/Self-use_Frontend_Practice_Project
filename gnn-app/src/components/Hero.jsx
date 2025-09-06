// src/components/Hero.jsx
export default function Hero({ data }) {
  if (!data) return null;
  return (
    <a href="#" className="card">
      <div style={{ aspectRatio: "16 / 9", overflow: "hidden" }}>
        <img src={data.image} alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: 16 }}>
        <span className="badge">{data.category}</span>
        <h1 style={{ margin: "8px 0 6px 0", fontSize: 24, fontWeight: 900, lineHeight: 1.2 }}>
          {data.title}
        </h1>
        <p style={{ color: "var(--muted)" }}>{data.subtitle}</p>
      </div>
    </a>
  );
}
