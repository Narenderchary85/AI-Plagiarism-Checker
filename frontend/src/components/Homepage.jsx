import React, { useState, useEffect } from 'react';
import './Homepage.css';
import { Link } from 'react-router';

const Homepage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "AI-Powered Detection",
      description: "Scan your documents in real-time with high-accuracy AI plagiarism detection.",
      icon: "🧠"
    },
    {
      title: "Deep Content Analysis",
      description: "Break down your writing structure and citation sources using advanced NLP.",
      icon: "📄"
    },
    {
      title: "User Dashboard",
      description: "Track your reports, submission history, and analysis insights in one place.",
      icon: "📊"
    }
  ];
  

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing! We'll contact you at ${email}`);
    setEmail('');
  };

  return (
    <div className="homepage">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span>AI-Plagiasrim Checker</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="auth-buttons">
         <Link to="/login"> <button className="login-btn">Login</button></Link>
          <Link to="/signin"><button className="signup-btn">Sign Up</button></Link>
        </div>
        <button className="mobile-menu-btn">☰</button>
      </nav>

      <section className="hero">
        <div className="hero-content">
        <h1 className="hero-title">
          Empower Your <span className="highlight">Academic Integrity</span>
        </h1>
        <p className="hero-subtitle">
          Detect plagiarism, analyze assignments, and maintain originality — all in one powerful platform.
        </p>

          <div className="hero-buttons">
          <Link to="/signin"><button className="primary-btn">Try It Free</button></Link>
          <button className="secondary-btn">How It Works</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-elements">
          <div className="floating-card card1">📃 Plagiarism Scan</div>
          <div className="floating-card card2">📈 Progress Reports</div>
          <div className="floating-card card3">📂 Submission History</div>
          </div>
          <div className="main-image">
            {/* <img src="https://illustrations.popsy.co/amber/student-sitting-at-desk.svg" alt="Student learning" /> */}
          </div>
        </div>
      </section>
      <section id="features" className="features-section">
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">Everything you need to succeed in your academic journey</p>
        
        <div className="features-container">
          <div className="feature-selector">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`feature-tab ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
              >
                {feature.icon} {feature.title}
              </button>
            ))}
          </div>
          <div className="feature-display">
            <div className="feature-content">
              <h3>{features[activeFeature].title}</h3>
              <p>{features[activeFeature].description}</p>
              <button className="learn-more-btn">Learn More →</button>
            </div>
            <div className="feature-animation">
              <div className={`animation-placeholder anim-${activeFeature}`}>
                {features[activeFeature].icon}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Simple steps to get started with our platform</p>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Document</h3>
            <p>Select the file you want to scan for plagiarism.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Scan & Analyze</h3>
            <p>Our AI analyzes your document for originality and citation issues.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Download Report</h3>
            <p>Get a detailed report with matched sources and percentage score.</p>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for the latest features and academic tips</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>AI-Plagiasrim Checker</h3>
            <p>Empowering the future of education through innovative technology.</p>
            <div className="social-icons">
              <a href="#"><span>📱</span></a>
              <a href="#"><span>📘</span></a>
              <a href="#"><span>📸</span></a>
              <a href="#"><span>💼</span></a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Updates</a>
            <a href="#">FAQ</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Community</a>
            <a href="#">Tutorials</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AI-Plagiasrim Checker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;