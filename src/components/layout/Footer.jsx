import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand & Mission */}
          <div className="footer-col brand-col">
            <Link to="/" className="navbar-brand">
              <div className="navbar-logo-icon">
                <Activity size={20} color="#ffffff" />
              </div>
              <span className="navbar-brand-text">
                Mind<span className="text-primary">Pulse</span>
              </span>
            </Link>
            <p className="footer-description">
              Evidence-based AI predictive modeling designed to assess student digital habits, social media usage patterns, and emotional wellbeing.
            </p>
            <div className="footer-badge">
              <Heart size={14} color="var(--danger)" />
              <span>Built for Student Mental Wellness</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home Overview</Link>
              </li>
              <li>
                <Link to="/assessment">Start Assessment</Link>
              </li>
              <li>
                <Link to="/dashboard">Personal Dashboard</Link>
              </li>
              <li>
                <Link to="/history">Assessment History</Link>
              </li>
            </ul>
          </div>

          {/* Crisis Hotlines & Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Crisis Support</h4>
            <p className="crisis-note">
              If you or someone you know is struggling or in distress, help is available 24/7.
            </p>
            <ul className="crisis-list">
              <li>
                <strong>US National Helpline:</strong>{' '}
                <a href="tel:988" className="crisis-link">
                  Dial 988
                </a>
              </li>
              <li>
                <strong>Crisis Text Line:</strong>{' '}
                <a href="sms:741741" className="crisis-link">
                  Text HOME to 741741
                </a>
              </li>
              <li>
                <strong>International Resources:</strong>{' '}
                <a
                  href="https://findahelpline.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crisis-link"
                >
                  findahelpline.com <ExternalLink size={12} style={{ display: 'inline' }} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="footer-disclaimer">
          <div className="disclaimer-icon">
            <ShieldAlert size={20} color="var(--warning)" />
          </div>
          <p className="disclaimer-text">
            <strong>Medical Disclaimer:</strong> MindPulse provides AI-driven predictive estimations for educational and self-awareness purposes only. It does not constitute clinical psychological diagnosis, medical treatment, or healthcare advice. Consult a certified mental healthcare professional for personal medical evaluations.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MindPulse HealthTech Analytics. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
