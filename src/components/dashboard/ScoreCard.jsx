import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import { formatDate, getScoreCategory } from '../../utils/formatters';

export default function ScoreCard({ score, date, count = 0, isLoading = false }) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="card score-summary-card">
        <Skeleton width="50%" height="1.5rem" />
        <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center' }}>
          <Skeleton width="130px" height="130px" borderRadius="50%" />
        </div>
        <Skeleton width="100%" height="3rem" />
      </div>
    );
  }

  // Friendly Empty State with SVG illustration
  if (!score && count === 0) {
    return (
      <div className="card score-summary-card empty-state">
        <div className="calm-empty-illustration">
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="50" r="42" fill="var(--primary-soft)" />
            <circle cx="60" cy="50" r="30" fill="var(--surface-elevated)" stroke="var(--accent-sage)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M46 54C46 54 52 60 60 60C68 60 74 54 74 54" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="42" r="3" fill="var(--text-primary)" />
            <circle cx="70" cy="42" r="3" fill="var(--text-primary)" />
            <path d="M60 22V26M82 32L79 35M38 32L41 35" stroke="var(--accent-sage)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="empty-title">Your first check-in will appear here</h3>
        <p className="empty-desc">
          Take a quiet 2-minute reflection on your daily habits, study time, and rest to see your personalized wellbeing picture.
        </p>
        <Button
          variant="primary"
          size="md"
          iconRight={ArrowRight}
          onClick={() => navigate('/assessment')}
        >
          Start your first check-in
        </Button>
      </div>
    );
  }

  const category = getScoreCategory(score);
  const formattedScore = parseFloat(score).toFixed(1);
  const percentage = Math.min(Math.max(((parseFloat(score) - 3.0) / (10.0 - 3.0)) * 100, 8), 100);
  const circumference = 2 * Math.PI * 40; // r=40 -> ~251.3
  const strokeOffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="card score-summary-card">
      <div className="card-header-flex">
        <div>
          <span className="eyebrow">Latest Check-in</span>
          <h3 className="card-title">Current Wellbeing</h3>
        </div>
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

      <div className="score-visual-row">
        {/* Soft Circular Gauge */}
        <div className="gauge-container">
          <svg className="gauge-svg" viewBox="0 0 100 100">
            <circle
              className="gauge-bg"
              cx="50"
              cy="50"
              r="40"
              strokeWidth="8"
            />
            <circle
              className="gauge-fill"
              cx="50"
              cy="50"
              r="40"
              strokeWidth="8"
              stroke={category.color}
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="gauge-center-text">
            <span className="gauge-score-value">
              {formattedScore}
            </span>
            <span className="gauge-score-max">/ 10</span>
          </div>
        </div>

        {/* Narrative */}
        <div className="score-narrative">
          <p className="score-category-text">
            {category.summary}
          </p>
          {date && (
            <p className="score-date-text">
              <Calendar size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
              Logged {formatDate(date)}
            </p>
          )}

          <div className="score-actions-group">
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/assessment')}
            >
              New check-in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
