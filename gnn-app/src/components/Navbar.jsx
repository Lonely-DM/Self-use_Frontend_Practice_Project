import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ categories = [] }) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" aria-label="GNN Home">
          <span className="brand-badge">GNN</span>
          <span className="brand-title">Galactic News Network</span>
        </Link>

        <nav className="nav-md">
          {categories.map((c) => (
            <NavLink
              key={c}
              to={`/channel/${c}`}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
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
