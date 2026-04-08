import { Outlet, NavLink } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <NavLink to="/" className="logo">
          <span className="logo-mark">✦</span>
          <span className="logo-text">Spark</span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Ideas
          </NavLink>
          <NavLink to="/submit" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            + New Idea
          </NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Spark — Validate before you build</p>
      </footer>
    </div>
  );
}
