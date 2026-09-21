import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import { formatDate, getScoreCategory } from '../../utils/formatters';

export default function RecentAssessments({
  assessments = [],
  isLoading = false,
  onViewDetail,
}) {
  if (isLoading) {
    return (
      <div className="card recent-assessments-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <Skeleton width="40%" height="1.5rem" />
          <Skeleton width="20%" height="1rem" />
        </div>
        <div className="recent-cards-grid">
          <Skeleton width="100%" height="90px" borderRadius="18px" />
          <Skeleton width="100%" height="90px" borderRadius="18px" />
          <Skeleton width="100%" height="90px" borderRadius="18px" />
        </div>
      </div>
    );
  }

  return (
    <div className="card recent-assessments-card">
      <div className="card-header-flex">
        <div>
          <span className="eyebrow">Past Reflections</span>
          <h3 className="card-title">Recent Check-ins</h3>
        </div>
        <Link to="/history" className="view-all-link">
          <span>View all history</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="recent-empty-state">
          <p>No check-ins completed yet. When you take a check-in, your reflections will be preserved here.</p>
        </div>
      ) : (
        <div className="recent-cards-grid">
          {assessments.slice(0, 4).map((item) => {
            const itemScore = item.predicted_score ?? item.score;
            const platform = item.most_used_platform || item.student_data?.most_used_platform || 'Social Media';
            const stress = item.stress_level || item.student_data?.stress_level || 'Normal';
            const cat = getScoreCategory(itemScore);
            return (
              <div
                key={item.id}
                className="recent-checkin-card"
                onClick={() => onViewDetail && onViewDetail(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewDetail && onViewDetail(item);
                  }
                }}
                aria-label={`View check-in from ${formatDate(item.created_at)}`}
              >
                <div className="recent-checkin-top">
                  <div
                    className="recent-score-pill"
                    style={{
                      backgroundColor: cat.bg,
                      color: cat.text,
                      borderColor: cat.border,
                    }}
                  >
                    <span className="recent-score-val">{parseFloat(itemScore).toFixed(1)}</span>
                    <span className="recent-score-scale">/ 10</span>
                  </div>
                  <span
                    className="calm-category-badge"
                    style={{
                      backgroundColor: cat.bg,
                      borderColor: cat.border,
                      color: cat.text,
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                    }}
                  >
                    <span className="badge-dot" style={{ backgroundColor: cat.color }} />
                    <span>{cat.label}</span>
                  </span>
                </div>

                <div className="recent-checkin-middle">
                  <span className="recent-platform-badge">
                    {platform} · {stress} Stress
                  </span>
                  <span className="recent-checkin-date">
                    <Calendar size={12} className="inline-icon" />
                    {formatDate(item.created_at)}
                  </span>
                </div>

                <div className="recent-checkin-footer">
                  <span className="recent-view-link">View reflection details</span>
                  <ChevronRight size={14} className="recent-arrow-icon" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
