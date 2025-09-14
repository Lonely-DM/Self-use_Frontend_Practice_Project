// src/components/MostRead.jsx
import "./MostRead.css";

export default function MostRead({ items = [] }) {
  return (
    <section className="card mostread">
      <h2 className="mostread-title">热读榜</h2>
      <ol className="mostread-list">
        {items.map((m, idx) => (
          <li key={m.id} className="mostread-item">
            <span className="mostread-rank">{idx + 1}</span>
            <a href="#" className="mostread-link">{m.title}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}
