import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Smartphone,
  Moon,
  Activity,
  Heart,
  Calendar,
  BookOpen,
  CheckCircle2,
  Smile,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import useReveal from '../hooks/useReveal';
import * as api from '../services/api';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [apiOnline, setApiOnline] = useState(true);
  const pageRef = useRef(null);

  // Sections fade and rise into place as the visitor scrolls.
  useReveal(pageRef);

  useEffect(() => {
    api.checkApiHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  return (
    <div className="landing-page" ref={pageRef}>
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        {/* Signature ambient gradient blobs */}
        <div className="calm-blob hero-blob-1" aria-hidden="true" />
        <div className="calm-blob hero-blob-2" aria-hidden="true" />

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} color="var(--primary)" />
              <span>A Gentle Reflection Sanctuary for Students</span>
            </div>

            <h1 className="hero-title">
              Understand your daily rhythm in a <span className="hero-highlight">quiet space</span>.
            </h1>

            <p className="hero-description">
              Explore how screen time, study habits, and sleep shape your day-to-day wellbeing. No pressure, no judgment—just a clearer look at how you are doing today.
            </p>

            <div className="hero-cta-group">
              <Button
                variant="primary"
                size="lg"
                iconRight={ArrowRight}
                onClick={() => navigate('/assessment')}
              >
                {isAuthenticated ? 'Take a check-in' : 'Start a gentle check-in'}
              </Button>
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                >
                  View my space
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Sign in to keep history
                </Button>
              )}
            </div>

            <div className="hero-social-proof">
              <div className="proof-item">
                <CheckCircle2 size={16} className="proof-icon" />
                <span>Zero judgment</span>
              </div>
              <div className="proof-item">
                <CheckCircle2 size={16} className="proof-icon" />
                <span>Thoughtful educational estimate</span>
              </div>
              <div className="proof-item">
                <CheckCircle2 size={16} className="proof-icon" />
                <span>Takes just 2 minutes</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Preview Card */}
          <div className="hero-visual">
            <div className="hero-card-preview">
              <div className="preview-header">
                <div className="preview-badge">
                  <span className="live-dot" />
                  <span>Check-in Preview</span>
                </div>
                <span className="preview-sample-pill">Sample reflection</span>
              </div>

              <div className="preview-gauge-box">
                <div className="preview-gauge-ring">
                  <svg viewBox="0 0 100 100" className="preview-gauge-svg">
                    <circle cx="50" cy="50" r="42" stroke="var(--track-bg)" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="var(--good)"
                      strokeWidth="8"
                      strokeDasharray="264"
                      strokeDashoffset="66"
                      strokeLinecap="round"
                      fill="none"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="preview-gauge-center">
                    <span className="preview-score-big">7.8</span>
                    <span className="preview-score-sub">/ 10</span>
                  </div>
                </div>
              </div>

              <div className="preview-category-box">
                <span className="calm-category-badge good">
                  <span className="badge-dot" />
                  <span>Good / Balanced</span>
                </span>
                <p className="preview-narrative">
                  Your daily habits show steady rest and balanced study time today.
                </p>
              </div>

              <div className="preview-metrics-grid">
                <div className="preview-metric">
                  <span className="p-metric-label">Screen time</span>
                  <span className="p-metric-val">3.5 hrs/day</span>
                </div>
                <div className="preview-metric">
                  <span className="p-metric-label">Nightly sleep</span>
                  <span className="p-metric-val">7.5 hrs (restful)</span>
                </div>
                <div className="preview-metric">
                  <span className="p-metric-label">Study focus</span>
                  <span className="p-metric-val">4.0 hrs/day</span>
                </div>
                <div className="preview-metric">
                  <span className="p-metric-label">Reported stress</span>
                  <span className="p-metric-val">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PILLARS BANNER ================= */}
      <section className="stats-banner-section">
        <div className="stats-banner-container">
          <div className="stat-banner-item reveal">
            <div className="stat-banner-icon">
              <Compass size={22} />
            </div>
            <div>
              <h3 className="stat-banner-number">12 Factors</h3>
              <p className="stat-banner-label">Holistic daily rhythm inputs</p>
            </div>
          </div>

          <div className="stat-banner-item reveal">
            <div className="stat-banner-icon">
              <Heart size={22} />
            </div>
            <div>
              <h3 className="stat-banner-number">Zero Judgments</h3>
              <p className="stat-banner-label">Safe space for self-reflection</p>
            </div>
          </div>

          <div className="stat-banner-item reveal">
            <div className="stat-banner-icon">
              <Calendar size={22} />
            </div>
            <div>
              <h3 className="stat-banner-number">Longitudinal</h3>
              <p className="stat-banner-label">Track changes through semesters</p>
            </div>
          </div>

          <div className="stat-banner-item reveal">
            <div className="stat-banner-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="stat-banner-number">Private</h3>
              <p className="stat-banner-label">Your reflections stay yours</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="section-header text-center reveal">
            <span className="eyebrow">A 3-Step Journey</span>
            <h2 className="section-title">How MindPulse Works</h2>
            <p className="section-subtitle">
              Take a few quiet minutes to reflect on your day and see how your habits connect.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card reveal">
              <div className="step-icon-box">
                <Smartphone size={24} />
              </div>
              <h3 className="step-card-title">1. Share your rhythms</h3>
              <p className="step-card-desc">
                Answer gentle questions about your daily screen time, sleep hours, study routine, and how stressful things feel right now.
              </p>
            </div>

            <div className="step-card reveal">
              <div className="step-icon-box">
                <Smile size={24} />
              </div>
              <h3 className="step-card-title">2. See your estimate</h3>
              <p className="step-card-desc">
                Receive an educational wellbeing score with plain-language observations on what supported your day and what might need attention.
              </p>
            </div>

            <div className="step-card reveal">
              <div className="step-icon-box">
                <Activity size={24} />
              </div>
              <h3 className="step-card-title">3. Explore small steps</h3>
              <p className="step-card-desc">
                Reflect on gentle, non-prescriptive micro-habits and watch your smooth rhythm curve evolve over the semester.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY VALUE PILLARS ================= */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header text-center reveal">
            <span className="eyebrow">Designed for Real Life</span>
            <h2 className="section-title">A Calm Look at Everyday Factors</h2>
            <p className="section-subtitle">
              Everyday habits connect in subtle ways. Here is what we look at together.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card reveal">
              <div className="feature-icon-wrapper">
                <Smartphone size={22} />
              </div>
              <h3 className="feature-title">Digital Life & Screentime</h3>
              <p className="feature-text">
                Understanding whether your social media use brings relaxation, study connection, or fatigue.
              </p>
            </div>

            <div className="feature-card reveal">
              <div className="feature-icon-wrapper">
                <Moon size={22} />
              </div>
              <h3 className="feature-title">Restful Sleep Windows</h3>
              <p className="feature-text">
                Seeing how nighttime screen usage and quiet rest hours protect your cognitive energy.
              </p>
            </div>

            <div className="feature-card reveal">
              <div className="feature-icon-wrapper">
                <BookOpen size={22} />
              </div>
              <h3 className="feature-title">Academic & Study Rhythm</h3>
              <p className="feature-text">
                Balancing study focus with moments of recovery so stress doesn't quietly build up.
              </p>
            </div>

            <div className="feature-card reveal">
              <div className="feature-icon-wrapper">
                <Activity size={22} />
              </div>
              <h3 className="feature-title">Movement & Activity</h3>
              <p className="feature-text">
                How gentle physical activity acts as an everyday anchor when academic demands rise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA BANNER ================= */}
      <section className="cta-banner-section">
        <div className="cta-container">
          <div className="cta-card reveal">
            <div className="cta-content">
              <span className="eyebrow">Begin Whenever You Are Ready</span>
              <h2 className="cta-title">Take a quiet moment for yourself</h2>
              <p className="cta-subtitle">
                A 2-minute check-in to reflect on your daily rhythms and explore small, supportive adjustments.
              </p>
              <div className="cta-buttons">
                <Button
                  variant="primary"
                  size="lg"
                  iconRight={ArrowRight}
                  onClick={() => navigate('/assessment')}
                >
                  Start your check-in
                </Button>
                {!isAuthenticated && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/register')}
                  >
                    Create a free space
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
