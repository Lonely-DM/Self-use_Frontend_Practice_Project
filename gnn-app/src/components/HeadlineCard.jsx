// src/components/HeadlineCard.jsx
import "./HeadlineCard.css";

export default function HeadlineCard({ item }) {
  return (
    <a href="#" className="card headline-card">
      <div className="headline-media">
        <img className="headline-img" src={item.image} alt={item.title} />
      </div>
      <div className="headline-body">
        <span className="badge headline-badge">{item.category}</span>
        <h3 className="headline-title">{item.title}</h3>
      </div>
    </a>
  );
}
