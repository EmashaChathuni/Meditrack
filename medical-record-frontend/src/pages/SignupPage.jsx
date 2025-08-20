import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './SignupPage.css';

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Changed from '/api/auth/signup' to '/api/auth/register'
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include', // <-- Added this line
    });
    
    if (res.ok) {
      // After successful registration, try to login automatically
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // <-- Added this line
      });
      
      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.token) {
        localStorage.setItem('token', loginData.token);
        navigate("/dashboard"); // Changed from "/login/dashboard"
      } else {
        navigate("/login");
      }
    } else {
      const errorData = await res.json();
      setError(errorData.error || "Signup failed. Try a different username/email.");
    }
  } catch (err) {
    setError("Signup failed. Please try again.");
  }
};


  return (
    <div className="signup-container">
      <img
        src="/images/signup.webp"
        alt="Signup background"
        className="signup-image"
      />
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="signup-input"
          required
        />
        <input
          name="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="signup-input"
          required
        />
        <input
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="signup-input"
          required
        />
        <button type="submit" className="signup-button">Register</button>
        {error && <div style={{color:'red'}}>{error}</div>}
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;