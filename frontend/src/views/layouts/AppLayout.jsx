import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';
import BrandMark from '@/views/components/common/BrandMark';

export default function AppLayout() {
  const { user, logout } = useAuthViewModel();
  const [open, setOpen] = useState(false);
  const initial = user?.fullName?.trim()?.[0] || 'P';

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <BrandMark />
          <div>
            <strong>Project Management System</strong>
            <p>Workspace</p>
          </div>
        </div>
        <nav className="side-nav" onClick={() => setOpen(false)}>
          <NavLink to="/dashboard">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 13h7V4H4v9zm0 7h7v-5H4v5zm9 0h7V11h-7v9zm0-16v5h7V4h-7z" /></svg>
            Dashboard
          </NavLink>
          <NavLink to="/projects">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 4H4v6h6V4zm10 0h-6v6h6V4zM10 14H4v6h6v-6zm10 0h-6v6h6v-6z" /></svg>
            Projects
          </NavLink>
        </nav>
        <div className="sidebar-user">
          <div className="user-chip">
            <span className="user-avatar">{initial}</span>
            <div className="user-meta">
              <strong>{user?.fullName}</strong>
              <p>{user?.email}</p>
            </div>
          </div>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      {open ? <div className="sidebar-scrim" onClick={() => setOpen(false)} /> : null}

      <div className="app-main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-btn"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <span className="topbar-title">Project Management System</span>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
