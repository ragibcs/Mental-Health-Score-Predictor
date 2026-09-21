import React, { useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import { formatShortDate, getScoreCategory } from '../../utils/formatters';

// Cubic spline for smooth curve
function getSmoothCurvePath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function ScoreTrend({ history = [], isLoading = false }) {
  const [activePoint, setActivePoint] = useState(null);

  if (isLoading) {
    return (
      <div className="card score-trend-card">
        <Skeleton width="40%" height="1.5rem" />
        <div style={{ margin: '1.5rem 0' }}>
          <Skeleton width="100%" height="170px" />
        </div>
      </div>
    );
  }

  // Sort chronological for plotting
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  if (sortedHistory.length < 2) {
    return (
      <div className="card score-trend-card">
        <div className="card-header-flex">
          <div>
            <span className="eyebrow">Your Journey</span>
            <h3 className="card-title">Score Trajectory</h3>
          </div>
        </div>
        <div className="trend-empty-state">
          <Info size={24} className="text-muted" />
          <p>
            {sortedHistory.length === 1
              ? 'Complete one more check-in to see your smooth trend curve across time.'
              : 'Complete multiple check-ins to visualize how your wellbeing patterns shift.'}
          </p>
        </div>
      </div>
    );
  }

  // SVG dimensions
  const minScore = 3.0;
  const maxScore = 10.0;
  const width = 540;
  const height = 180;
  const paddingX = 36;
  const paddingTop = 20;
  const paddingBottom = 26;
  const chartHeight = height - paddingTop - paddingBottom;

  // Map score to Y coordinate (invert so higher score is higher on screen)
  const getY = (val) => {
    const clamped = Math.min(Math.max(val, minScore), maxScore);
    return height - paddingBottom - ((clamped - minScore) / (maxScore - minScore)) * chartHeight;
  };

  // Category band Y coordinates
  const yGoodTop = getY(10.0);
  const yGoodBottom = getY(7.5);
  const yModBottom = getY(5.8);
  const yNeedsBottom = getY(3.0);

  const points = sortedHistory.map((item, idx) => {
    const x = paddingX + (idx / (sortedHistory.length - 1)) * (width - paddingX * 2);
    const scoreVal = parseFloat(item.predicted_score ?? item.score ?? 0);
    const y = getY(scoreVal);
    return {
      x,
      y,
      score: scoreVal,
      date: item.created_at,
      id: item.id || idx,
      item,
    };
  });

  const smoothCurve = getSmoothCurvePath(points);
  const lastX = points[points.length - 1].x;
  const firstX = points[0].x;
  const bottomY = height - paddingBottom;
  const smoothArea = `${smoothCurve} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

  // Difference between first and last check-in
  const firstScore = points[0].score;
  const lastScore = points[points.length - 1].score;
  const diff = lastScore - firstScore;

  return (
    <div className="card score-trend-card">
      <div className="card-header-flex">
        <div>
          <span className="eyebrow">Your Rhythm Over Time</span>
          <h3 className="card-title">Wellbeing Trajectory</h3>
        </div>
        <div className="trend-badge-pill">
          <TrendingUp size={14} />
          <span>
            {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} pts overall
          </span>
        </div>
      </div>

      <div className="trend-chart-wrapper">
        <svg
          className="trend-svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="calmAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.20" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Faint Background Bands for the 3 Categories */}
          {/* 1. Good / Balanced band (>= 7.5) */}
          <rect
            x={paddingX}
            y={yGoodTop}
            width={width - paddingX * 2}
            height={yGoodBottom - yGoodTop}
            fill="var(--status-good)"
            fillOpacity="0.08"
            rx="4"
          />

          {/* 2. Moderate band (5.8 to 7.5) */}
          <rect
            x={paddingX}
            y={yGoodBottom}
            width={width - paddingX * 2}
            height={yModBottom - yGoodBottom}
            fill="var(--status-mod)"
            fillOpacity="0.07"
            rx="4"
          />

          {/* 3. Needs Attention band (< 5.8) */}
          <rect
            x={paddingX}
            y={yModBottom}
            width={width - paddingX * 2}
            height={yNeedsBottom - yModBottom}
            fill="var(--status-needs)"
            fillOpacity="0.07"
            rx="4"
          />

          {/* Subtle guide lines */}
          <line
            x1={paddingX}
            y1={yGoodBottom}
            x2={width - paddingX}
            y2={yGoodBottom}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={yModBottom}
            x2={width - paddingX}
            y2={yModBottom}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />

          {/* Soft Area Fill */}
          <path d={smoothArea} fill="url(#calmAreaGradient)" />

          {/* Smooth Curve */}
          <path
            d={smoothCurve}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {points.map((pt) => {
            const cat = getScoreCategory(pt.score);
            const isHovered = activePoint?.id === pt.id;
            return (
              <g key={pt.id}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#FFFFFF"
                  stroke={cat.color}
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={() => setActivePoint(pt)}
                  onMouseLeave={() => setActivePoint(null)}
                  onClick={() => setActivePoint(pt)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover / Tap Tooltip */}
        {activePoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${Math.max((activePoint.y / height) * 100 - 15, 5)}%`,
            }}
          >
            <strong>{activePoint.score.toFixed(1)} / 10</strong>
            <span>{formatShortDate(activePoint.date)}</span>
          </div>
        )}
      </div>

      <div className="trend-x-axis">
        <span>{formatShortDate(points[0].date)}</span>
        <span className="trend-legend-label">{points.length} check-ins recorded</span>
        <span>{formatShortDate(points[points.length - 1].date)}</span>
      </div>
    </div>
  );
}
