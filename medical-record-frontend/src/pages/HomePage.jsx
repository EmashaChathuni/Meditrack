import './HomePage.css';
import Testimonials from '../Components/Testimonials';

function HomePage() {
  return (
    <div className="home-page">

    
  <section className="hero-section">
    <div className="hero-content">
      <h1 className="hero-title">Welcome to MediTrack</h1>
      <p className="hero-subtitle">
        Securely manage your medical records, appointments, and health data—all in one place.
      </p>
      <a href="/signup" className="hero-cta">Get Started</a>
    </div>
    <div className="hero-image-wrapper">
      <img
        src="/images/hero-image.webp"
        alt="Medical dashboard"
        className="hero-image"
      />
    </div>
  </section>  

      

       {/* 3. Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="/images/secure.jpg" alt="Secure" />
            <h4>Secure Data Storage</h4>
            <p>Your health records are safe with bank-level encryption.</p>
          </div>
          <div className="feature-card">
            <img src="/images/cloud.jpg" alt="Access Anywhere" />
            <h4>Anywhere Access</h4>
            <p>View and manage your records anytime, on any device.</p>
          </div>
          <div className="feature-card">
            <img src="/images/history.jpg" alt="Organized History" />
            <h4>Organized History</h4>
            <p>All lab reports, prescriptions, and visits in one place.</p>
          </div>
          <div className="feature-card">
            <img src="/images/chart.jpg" alt="Data Insights" />
            <h4>Data Insights</h4>
            <p>Charts and stats for a better understanding of your health.</p>
          </div>
        </div>
      </section>


      {/* 2. About Section */}
      <section id="about" className="about-section">
        <div className="about-text">
          <h2>About MediTrack</h2>
          <p>
          MediTrack isn’t just a medical record app – it’s your personal health companion.
           We bring all your health information together in one secure, easy-to-use platform.
            From storing your lab reports and doctor’s notes to tracking your prescriptions 
            and past check-ups, MediTrack ensures your health history is always organized, accessible, and protected.
          </p>
          <p>
          With MediTrack, you don’t have to worry about missing reports or scattered files. 
          Whether you’re planning your next doctor visit or reviewing your wellness progress, everything you need is just a click away. 
          Our goal is simple: empower you to take full control of your health, anytime, anywhere
            
            </p>
        </div>
        <div className="about-img">
          <img src="/images/about.jpg" alt="About MediTrack" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose MedTrack?</h2>
        <div className="feature-list">
          <div className="feature">
            <h3>📂 Store Records</h3>
            <p>Upload and organize all your medical documents in one secure place.</p>
          </div>
          <div className="feature">
            <h3>📅 Manage Appointments</h3>
            <p>Never miss a checkup. Keep track of all your upcoming visits.</p>
          </div>
          <div className="feature">
            <h3>🔐 Privacy First</h3>
            <p>Your health data is encrypted and accessible only by you.</p>
          </div>
        </div>
      </section>




      {/* 4. How It Works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="how-steps">
          <div className="step-card">
            <span className="step-number">1</span>
            <h4>Sign Up</h4>
            <p>Create your free secure account in just a few clicks.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h4>Upload Records</h4>
            <p>Add your lab reports, prescriptions, and notes.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h4>Track & Manage</h4>
            <p>Access and edit your health info anytime.</p>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="testimonials-section">
        
        <Testimonials />
      </section>
      
      {/* 7. Call to Action */}
      <section className="cta-section">
        <h2>Ready to Take Control of Your Health?</h2>
        <h3>Keep all your health readings in one place. Start by creating an account.</h3>
        <a href="/signup" className="btn-primary">Create Your Account</a>
      </section>

    </div>
  );
}

export default HomePage;
