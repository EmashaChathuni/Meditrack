import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // <-- This line ensures cookies are sent
    });
    const data = await res.json();
    if (res.ok) {
      navigate("/dashboard"); // Redirect after successful login
    } else {
      setError("Invalid credentials");
    }
  } catch {
    setError("Login failed. Please try again.");
  }
};



  return (
    <div className="login-container">
      <img
        src="/images/login.jpg"
        alt="Login background"
        className="login-image"
      />
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login</button>
        {error && <div style={{color: "red"}}>{error}</div>}
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

