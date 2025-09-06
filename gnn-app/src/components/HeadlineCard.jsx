// src/components/HeadlineCard.jsx
export default function HeadlineCard({ item }) {
  return (
    <a href="#" className="card">
      <div style={{ aspectRatio: "16 / 10", overflow: "hidden" }}>
        <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: 12 }}>
        <span className="badge" style={{ background: "#f4f4f5", color: "#111827", borderColor: "#e5e7eb" }}>
          {item.category}
        </span>
        <h3 style={{ marginTop: 6, fontSize: 16, fontWeight: 800, lineHeight: 1.35 }}>
          {item.title}
        </h3>
      </div>
    </a>
  );
}
