import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo & Description */}
        <div className="footer-section">
          <h2 className="footer-logo">MediTrack</h2>
          <p>Your personal medical record assistant – secure, private, and always available.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/lab-reports">Lab Reports</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@meditrack.com</p>
          <p>Phone: +94 77 123 4567</p>
          <p>Colombo, Sri Lanka</p>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MediTrack. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
