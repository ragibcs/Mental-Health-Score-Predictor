import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  RotateCcw,
  LayoutDashboard,
  Moon,
  Smartphone,
  Activity,
  Compass,
  ArrowRight,
  LifeBuoy,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getScoreCategory } from '../utils/formatters';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(false);

  const predictionData = location.state?.prediction;
  const studentData = location.state?.studentData || predictionData?.input_data;

  useEffect(() => {
    // Trigger slow breath animation on gauge
    const timer = setTimeout(() => {
      setAnimatedScore(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Empty state if navigated to directly
  if (!predictionData && !studentData) {
    return (
      <div className="result-empty-page">
        <div className="card text-center" style={{ maxWidth: '520px', margin: '4rem auto', padding: '3.5rem 2rem' }}>
          <div className="empty-icon-circle" style={{ margin: '0 auto 1.5rem' }}>
            <Heart size={36} color="var(--primary)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>No recent check-in found</h2>
          <p className="text-secondary" style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            It looks like you haven't taken a check-in during this session yet. Take two quiet minutes to see where you stand.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/assessment')}>
            Start a check-in
          </Button>
        </div>
      </div>
    );
  }

  const score = parseFloat(
    predictionData?.predicted_mental_health_score || predictionData?.score || 7.0
  );
  const formattedScore = score.toFixed(1);
  const category = getScoreCategory(score);

  // Normalize scale 3.0 to 10.0 for gauge display (percent 0-100)
  const percentage = Math.min(Math.max(((score - 3.0) / (10.0 - 3.0)) * 100, 8), 100);
  const circumference = 2 * Math.PI * 72; // r=72 -> ~452.39
  const strokeDashoffset = animatedScore
    ? circumference - (circumference * percentage) / 100
    : circumference;

  // 1. "What shaped this": 3 plain-language observations derived from user inputs
  const observations = [];

  // Sleep observation
  const sleepHours = studentData?.sleep_hours_per_night ?? 7;
  if (sleepHours < 6.5) {
    observations.push({
      icon: Moon,
      title: 'Rest & Recovery',
      text: `At ${sleepHours} hours of sleep, your body and mind are getting less than the 7–9 hour restful range. Even an extra 30–45 minutes can make mornings feel noticeably clearer.`,
    });
  } else if (sleepHours <= 9.0) {
    observations.push({
      icon: Moon,
      title: 'Rest & Recovery',
      text: `Your ${sleepHours} hours of sleep sit comfortably within the 7–9 hour restful range, giving your nervous system consistent time to recharge.`,
    });
  } else {
    observations.push({
      icon: Moon,
      title: 'Rest & Recovery',
      text: `You logged ${sleepHours} hours of sleep. While long rest can feel good, staying consistent with gentle daytime waking hours supports your natural body clock.`,
    });
  }

  // Screen time & digital habit observation
  const screenHours = studentData?.avg_daily_usage_hours ?? 3.5;
  const platform = studentData?.most_used_platform || 'social media';
  const unlocks = studentData?.daily_unlocks ?? 60;
  if (screenHours > 4.5 || unlocks > 80) {
    observations.push({
      icon: Smartphone,
      title: 'Digital Connection',
      text: `Spending around ${screenHours} hours on ${platform} with ~${unlocks} unlocks means your attention shifts frequently throughout the day. Short screen pauses can ease mental fatigue.`,
    });
  } else {
    observations.push({
      icon: Smartphone,
      title: 'Digital Connection',
      text: `Your ${screenHours} hours on ${platform} reflects a measured digital presence, helping keep notifications from breaking your daily focus.`,
    });
  }

  // Physical activity & study balance observation
  const activityHours = studentData?.physical_activity_hours ?? 1.0;
  const studyHours = studentData?.study_hours ?? 4.0;
  if (activityHours >= 1.0) {
    observations.push({
      icon: Activity,
      title: 'Movement & Focus',
      text: `Balancing ${studyHours} hours of focused study with ${activityHours} hours of physical movement provides a wonderful natural release for mental tension.`,
    });
  } else {
    observations.push({
      icon: Activity,
      title: 'Movement & Focus',
      text: `With ${studyHours} hours of study and ${activityHours} hours of movement, your day tends to be stationary. A quick 15-minute walk outside can bring fresh circulation to tired eyes.`,
    });
  }

  // 2. "Small things that may help": 2-3 gentle, non-prescriptive suggestions generated by simple rules
  const suggestions = [];

  if (sleepHours < 7.0) {
    suggestions.push({
      title: 'A gentle evening wind-down',
      desc: 'Try putting your phone out of arm\'s reach 20–30 minutes before sleep. Giving your eyes a break from backlight helps your thoughts settle naturally.',
    });
  }

  if (screenHours >= 4.0 || unlocks >= 60) {
    suggestions.push({
      title: 'Quiet pocket hours',
      desc: 'Pick one pocket of the day—like lunchtime or your first morning coffee—as a completely notification-free moment.',
    });
  }

  if (activityHours < 1.0) {
    suggestions.push({
      title: 'Ten minutes in daylight',
      desc: 'A brief, unhurried walk in natural daylight between study sessions helps reset concentration without draining your battery.',
    });
  }

  if (studentData?.stress_level === 'High' || studentData?.stress_level === 'Very High' || suggestions.length < 2) {
    suggestions.push({
      title: 'Give yourself permission to pause',
      desc: 'When academic expectations feel heavy, remember that taking five slow, quiet breaths is productive care, not wasted time.',
    });
  }

  // Cap at 3 gentle suggestions
  const displaySuggestions = suggestions.slice(0, 3);

  return (
    <div className="result-page">
      <div className="result-container">
        {/* Main Result Card */}
        <div className="card result-card-hero animate-fade-in">
          <div className="result-header text-center">
            <span className="result-opening-eyebrow">
              <Sparkles size={14} className="eyebrow-icon" />
              <span>Your check-in is ready</span>
            </span>
            <h1 className="result-title">Here is your wellbeing picture today</h1>
            <p className="result-subtitle">
              A gentle reflection based on your rest, digital habits, and daily rhythm.
            </p>
          </div>

          <div className="result-score-presentation">
            {/* Soft Circular Ring Gauge */}
            <div className="result-gauge-box">
              <svg className="result-gauge-svg" viewBox="0 0 176 176">
                {/* Background Ring */}
                <circle
                  className="gauge-bg"
                  cx="88"
                  cy="88"
                  r="72"
                  strokeWidth="10"
                />
                {/* Animated Score Ring (Slow Breath) */}
                <circle
                  className="gauge-fill-breath"
                  cx="88"
                  cy="88"
                  r="72"
                  strokeWidth="10"
                  stroke={category.color}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 88 88)"
                />
              </svg>
              <div className="result-gauge-center">
                <span className="result-big-number">
                  {formattedScore}
                </span>
                <span className="result-score-scale">out of 10</span>
              </div>
            </div>

            {/* Score interpretation summary */}
            <div className="result-summary-box">
              <div className="result-badge-row">
                <span
                  className="calm-category-badge"
                  style={{
                    backgroundColor: category.bg,
                    borderColor: category.border,
                    color: category.text,
                  }}
                >
                  <span className="badge-dot" style={{ backgroundColor: category.color }} />
                  <span>{category.label}</span>
                </span>
              </div>

              <h2 className="result-status-heading">
                {score >= 7.5
                  ? 'Your daily rhythm shows a supportive, healthy balance.'
                  : score >= 5.8
                  ? 'Your routine shows mild pressure points, but a steady foundation.'
                  : 'You may be carrying a little extra strain right now.'}
              </h2>
              <p className="result-status-desc">{category.summary}</p>

              {/* Action Buttons */}
              <div className="result-action-buttons">
                {isAuthenticated ? (
                  <Button
                    variant="primary"
                    size="md"
                    icon={LayoutDashboard}
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    iconRight={ArrowRight}
                    onClick={() => navigate('/register')}
                  >
                    Save & track this check-in
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="md"
                  icon={RotateCcw}
                  onClick={() => navigate('/assessment')}
                >
                  Start a new check-in
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: "What shaped this" - 3 plain-language observations */}
        <div className="result-section">
          <div className="section-header">
            <span className="section-eyebrow">Personal Observations</span>
            <h2 className="section-title">What shaped this check-in</h2>
            <p className="section-subtitle">
              Three quiet takeaways from what you shared about your habits and days.
            </p>
          </div>

          <div className="observations-grid">
            {observations.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card observation-card">
                  <div className="obs-icon-circle">
                    <Icon size={20} color="var(--primary)" />
                  </div>
                  <h3 className="obs-card-title">{item.title}</h3>
                  <p className="obs-card-text">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: "Small things that may help" - 2-3 gentle suggestions */}
        <div className="card suggestions-card">
          <div className="suggestions-header">
            <div className="sug-icon-box">
              <Compass size={24} color="var(--primary)" />
            </div>
            <div>
              <h2 className="sug-title">Small things that may help</h2>
              <p className="sug-subtitle">
                Gentle, low-pressure ideas to explore if you want to nurture your routine.
              </p>
            </div>
          </div>

          <div className="suggestions-list">
            {displaySuggestions.map((sug, idx) => (
              <div key={idx} className="sug-item">
                <div className="sug-bullet">{idx + 1}</div>
                <div className="sug-body">
                  <h3 className="sug-heading">{sug.title}</h3>
                  <p className="sug-text">{sug.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5 & 6: Educational Disclaimer & Persistent Need Support Link */}
        <div className="result-footer-block text-center">
          <p className="result-disclaimer">
            This is an educational estimate, not a diagnosis. If things feel heavy, talking to someone you trust or a professional can help.
          </p>

          <button
            type="button"
            className="need-support-link"
            onClick={() => setIsSupportModalOpen(true)}
          >
            <LifeBuoy size={16} className="support-link-icon" />
            <span>Need support? Free, confidential places to talk</span>
          </button>
        </div>
      </div>

      {/* Support & Helplines Modal */}
      {isSupportModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsSupportModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-dialog-title"
        >
          <div className="modal-card calm-support-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="support-modal-icon">
                  <LifeBuoy size={22} color="var(--primary)" />
                </div>
                <div>
                  <h2 id="support-dialog-title" className="support-modal-heading">
                    You don't have to carry this alone
                  </h2>
                  <p className="support-modal-sub">
                    Reaching out for a listening ear is a sign of self-awareness and strength.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSupportModalOpen(false)}
                aria-label="Close support dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="support-modal-content">
              <div className="support-channel-card">
                <h3 className="support-channel-title">Campus & Student Health Resources</h3>
                <p className="support-channel-desc">
                  Most colleges, universities, and schools have dedicated student counseling offices, peer support networks, and academic advisors ready to help without judgment.
                </p>
              </div>

              <div className="support-channel-card">
                <h3 className="support-channel-title">Local & National Helplines</h3>
                <p className="support-channel-desc">
                  No matter where you are in the world, free, anonymous crisis support lines are available 24/7 via call or text. Look up your local health service or crisis hotline—trained listeners are always ready to listen quietly.
                </p>
              </div>

              <div className="support-channel-card">
                <h3 className="support-channel-title">Someone You Trust</h3>
                <p className="support-channel-desc">
                  Sometimes sharing what you're carrying with a close friend, family member, professor, or mentor can take immediate weight off your shoulders.
                </p>
              </div>
            </div>

            <div className="support-modal-actions">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsSupportModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
