import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  // Function to check authentication
  const isAuth = () => {
    const token = localStorage.getItem("token");
    return token !== null; // returns true if logged in
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/"); // Redirect to home after logout
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="nav-brand" aria-label="MediTrack Home">
          <span className="nav-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" />
            </svg>
          </span>
          <span className="nav-brand-text">MediTrack</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-menu" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          {/* Show Login / Signup if NOT logged in */}
          {!isAuth() && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Sign Up
              </NavLink>
            </>
          )}

          {/* Show Logout if logged in */}
          {isAuth() && (
            <button onClick={logout} className="nav-link logout-btn">
              Logout
            </button>
          )}

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Profile
          </NavLink>

          {/* Health Tips Link */}
          <NavLink
            to="/health-tips"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Health Tips
          </NavLink>
        </nav>

        {/* Emergency Call Button */}
        <a
          href="tel:1990"
          className="emergency-btn"
          title="Call 1990 Suwa Seriya"
        >
          📞 Emergency: 1990
        </a>
      </div>
    </header>
  );
}
