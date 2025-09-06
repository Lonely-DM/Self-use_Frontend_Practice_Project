// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";

export default function Navbar({ categories = [] }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "#fff", borderBottom: "1px solid var(--border)",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: "var(--brand)",
            color: "#fff",
            fontWeight: 900,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            padding: "6px 8px",
            borderRadius: 6,
            fontSize: 14,
          }}>
            GNN
          </span>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>
            Galactic News Network
          </span>
        </Link>

        <nav style={{ display: "none", gap: 16 }} className="nav-md">
          {categories.map((c) => (
            <NavLink
              key={c}
              to={`/channel/${c}`}
              style={({ isActive }) => ({
                fontSize: 14,
                fontWeight: 700,
                color: isActive ? "var(--brand)" : "inherit",
              })}
            >
              {c}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
