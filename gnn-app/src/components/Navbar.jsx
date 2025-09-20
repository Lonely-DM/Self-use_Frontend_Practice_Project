import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ categories = [] }) {
  return (
    <header className="navbar">
      <div className="container-wide navbar-inner">
        <Link to="/" className="brand" aria-label="GNN Home">
          <span className="brand-badge">GNN</span>
          <span className="brand-title">Galactic News Network</span>
        </Link>

        <nav className="nav-md">
          {categories.map((c) => (
            <NavLink
              key={c}
              to={`/channel/${encodeURIComponent(c)}`}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              end
            >
              {c}
            </NavLink>

          ))}
        </nav>
      </div>
    </header>
  );
}
