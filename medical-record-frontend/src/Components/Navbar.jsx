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
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
          </svg>
          Emergency: 1990
        </a>
      </div>
    </header>
  );
}