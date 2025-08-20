import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  // Fetch profile using token from localStorage
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setError("Not logged in.");
    return;
  }

  fetch('http://localhost:5000/api/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    })
    .then(data => setProfile(data))
    .catch(() => setError("Failed to load profile"));
}, []);


  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Weight Trend Chart Data
  const weightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [60, 61, 62, 63, 62, 61],
        borderColor: '#2f80ed',
        backgroundColor: 'rgba(47, 128, 237, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Blood Pressure Chart Data
  const bpData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Systolic (mmHg)',
        data: [120, 118, 122, 119, 121, 120],
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Diastolic (mmHg)',
        data: [80, 78, 81, 79, 80, 79],
        borderColor: '#eb5757',
        backgroundColor: 'rgba(235, 87, 87, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <main className="profile container">
      {/* Header card */}
      <section className="profile-header card">
        <img className="profile-img" src="/images/profile.jpg" alt="User avatar" />
        <div className="profile-title">
          <h1 className="h1">Your Profile</h1>
          <p className="sub">Manage personal info and preferences.</p>
        </div>
      </section>

      {/* Info cards */}
      <section className="profile-grid">
        <article className="info-card card">
          <h2 className="h2">Basic Information</h2>
          <div className="info-row">
            <div><strong>Name:</strong> {profile.name || "Jane Doe"}</div>
            <div><strong>Age:</strong> {profile.age || 28}</div>
            <div><strong>Blood Group:</strong> {profile.bloodGroup || "O+"}</div>
            <div><strong>Height:</strong> {profile.height || "1.65 m"}</div>
            <div><strong>Weight:</strong> {profile.weight || "60 kg"}</div>
          </div>
        </article>

        <article className="info-card card">
          <h2 className="h2">Emergency Contact</h2>
          <div className="info-row">
            <div><strong>Contact:</strong> {profile.emergencyContact || "John Doe"}</div>
            <div><strong>Phone:</strong> {profile.emergencyPhone || "+94 77 123 4567"}</div>
            <div><strong>Relation:</strong> {profile.emergencyRelation || "Brother"}</div>
          </div>
        </article>

        <article className="info-card card">
          <h2 className="h2">Health Overview</h2>
          <div className="info-row">
            <div><strong>BMI:</strong> {profile.bmi || 22.0}</div>
            <div><strong>Allergies:</strong> {profile.allergies || "None"}</div>
            <div><strong>Conditions:</strong> {profile.conditions || "—"}</div>
          </div>
        </article>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="chart-card">
          <h3>Weight Trend</h3>
          <Line data={weightData} options={chartOptions} />
        </div>
        <div className="chart-card">
          <h3>Blood Pressure</h3>
          <Line data={bpData} options={chartOptions} />
        </div>
      </section>

      {/* Profile Section */}
      <section className="profile-section">
        <h2>Account Info</h2>
        <div style={{ maxWidth: 400, margin: "20px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
          <div><b>Username:</b> {profile.username}</div>
          <div><b>Email:</b> {profile.email}</div>
          <button onClick={logout} style={{ marginTop: 12, padding: "6px 12px" }}>Logout</button>
        </div>
      </section>
    </main>
  );
}
