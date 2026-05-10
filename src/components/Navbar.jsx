

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Logo } from "./Logo.jsx";
import { Icon } from "./Icons.jsx";
import { S } from "../lib/theme.js";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: "home" },
  { path: "/events", label: "Events", icon: "calendar" },
  { path: "/dashboard", label: "Dashboard", icon: "chart" },
  { path: "/profile", label: "Profile", icon: "user" },
];

export const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar-shell">
      <div className="navbar-inner">
        <button
          className="brand-button"
          onClick={() => goTo("/")}
          aria-label="Go to home page"
        >
          <Logo width={126} />
        </button>

        {user && (
          <div className="desktop-nav">
            {NAV_ITEMS.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link${isActive(path) ? " active" : ""}`}
              >
                <Icon name={icon} size={16} />
                {label}
              </Link>
            ))}
          </div>
        )}

        <div className="navbar-right">
          {user ? (
            <div className="user-chip">
              <img
                src={user.photoURL || "/favicon.svg"}
                alt=""
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: `2px solid ${S.blue}`,
                  objectFit: "cover",
                }}
              />
              <span>{user.displayName?.split(" ")[0] || "User"}</span>
            </div>
          ) : (
            <button
              style={{ ...S.btn, background: S.grad, color: "white" }}
              onClick={() => goTo("/login")}
            >
              Sign In
            </button>
          )}

          {user && (
            <button
              className="mobile-menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <Icon name={open ? "close" : "menu"} size={22} />
            </button>
          )}
        </div>
      </div>

      {user && open && (
        <div className="mobile-nav-panel">
          {NAV_ITEMS.map(({ path, label, icon }) => (
            <button
              key={path}
              className={`mobile-nav-link${isActive(path) ? " active" : ""}`}
              onClick={() => goTo(path)}
            >
              <Icon name={icon} size={18} />
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};


export const GuestNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-shell">
      <div className="navbar-inner">
        <button
          className="brand-button"
          onClick={() => navigate("/")}
          aria-label="Go to home page"
        >
          <Logo width={126} />
        </button>

        <button
          style={{ ...S.btn, background: S.grad, color: "white" }}
          onClick={() => navigate("/login")}
        >
          Create Your Event <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </nav>
  );
};