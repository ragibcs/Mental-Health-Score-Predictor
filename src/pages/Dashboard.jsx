import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  Smartphone,
  Layers,
  Heart,
  Calendar,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as api from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StatCard from '../components/dashboard/StatCard';
import ScoreCard from '../components/dashboard/ScoreCard';
import ScoreTrend from '../components/dashboard/ScoreTrend';
import RecentAssessments from '../components/dashboard/RecentAssessments';
import { getGreeting, formatDate, getScoreCategory } from '../utils/formatters';

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, historyData] = await Promise.all([
        api.getDashboardStats(),
        api.getAssessmentHistory(),
      ]);
      setStats(statsData);
      setHistory(historyData);
    } catch (err) {
      addToast(err.message || 'Unable to refresh dashboard data right now.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleOpenDetail = (assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAssessment(null);
    setIsModalOpen(false);
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'friend';
  const latestScore = stats?.latest_score;
  const avgScore = stats?.average_score;
  const totalCount = stats?.total_assessments || 0;
  const latestCat = latestScore ? getScoreCategory(latestScore) : null;

  // Calculate typical screen time across recorded history
  let typicalScreenHours = '—';
  if (history.length > 0) {
    const validUsage = history
      .map((h) => parseFloat(h.avg_daily_usage_hours ?? h.student_data?.avg_daily_usage_hours))
      .filter((n) => !isNaN(n));
    if (validUsage.length > 0) {
      const avgUsage = validUsage.reduce((a, b) => a + b, 0) / validUsage.length;
      typicalScreenHours = `${avgUsage.toFixed(1)} hrs`;
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header with time-based greeting & user's first name */}
        <div className="dashboard-header-row">
          <div>
            <span className="eyebrow">{getGreeting()}, {firstName}</span>
            <h1 className="dashboard-main-title">Your Wellbeing Space</h1>
            <p className="dashboard-subtitle">
              A quiet view of your daily rhythms, rest patterns, and reflections.
            </p>
          </div>

          <div className="dashboard-actions">
            <Button
              variant="primary"
              size="md"
              icon={Sparkles}
              onClick={() => navigate('/assessment')}
            >
              Take a check-in
            </Button>
          </div>
        </div>

        {/*
          Single bento grid.
            rows 1-2 : score hero (2x2)  |  two stat tiles
            row  3   : trend (2)         |  recent check-ins (2)
        */}
        <div className="dashboard-bento">
          <ScoreCard
            score={latestScore}
            date={stats?.last_assessment_date}
            count={totalCount}
            isLoading={isLoading}
          />

          <StatCard
            tint="violet"
            title="Latest check-in"
            value={latestScore ? `${parseFloat(latestScore).toFixed(1)} / 10` : '—'}
            subtitle={stats?.last_assessment_date ? `Logged ${formatDate(stats.last_assessment_date)}` : 'No checks logged yet'}
            icon={Heart}
            color={latestCat?.color || 'var(--primary)'}
            badgeText={latestCat?.label}
            badgeBg={latestCat?.bg}
            badgeColor={latestCat?.text}
            badgeBorder={latestCat?.border}
            isLoading={isLoading}
          />

          <StatCard
            tint="emerald"
            title="Your average"
            value={avgScore ? `${parseFloat(avgScore).toFixed(1)} / 10` : '—'}
            subtitle="Overall composite across checks"
            icon={Clock}
            color="var(--accent-sage)"
            isLoading={isLoading}
          />

          <StatCard
            tint="cyan"
            title="Typical screen time"
            value={typicalScreenHours}
            subtitle="Average daily social media usage"
            icon={Smartphone}
            color="var(--primary)"
            isLoading={isLoading}
          />

          <StatCard
            tint="amber"
            title="Check-ins so far"
            value={totalCount.toString()}
            subtitle="Personal reflections recorded"
            icon={Layers}
            color="var(--moderate)"
            isLoading={isLoading}
          />

          <ScoreTrend history={history} isLoading={isLoading} />

          <RecentAssessments
            assessments={history}
            isLoading={isLoading}
            onViewDetail={handleOpenDetail}
          />
        </div>
      </div>

      {/* Assessment Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Check-in Reflection"
        subtitle={
          selectedAssessment?.created_at
            ? `Logged on ${formatDate(selectedAssessment.created_at)}`
            : 'Reflection Details'
        }
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </div>
        }
      >
        {selectedAssessment && (() => {
          const mScore = selectedAssessment.predicted_score ?? selectedAssessment.score ?? 0;
          const mCat = getScoreCategory(mScore);
          const age = selectedAssessment.age ?? selectedAssessment.Age ?? selectedAssessment.student_data?.Age ?? 'N/A';
          const gender = selectedAssessment.gender ?? selectedAssessment.student_data?.gender ?? 'N/A';
          const country = selectedAssessment.country ?? selectedAssessment.student_data?.country ?? 'N/A';
          const academicLevel = selectedAssessment.academic_level ?? selectedAssessment.student_data?.academic_level ?? 'N/A';
          const platform = selectedAssessment.most_used_platform ?? selectedAssessment.student_data?.most_used_platform ?? 'Social Media';
          const purpose = selectedAssessment.purpose_of_use ?? selectedAssessment.student_data?.purpose_of_use ?? 'General';
          const usageHours = selectedAssessment.avg_daily_usage_hours ?? selectedAssessment.student_data?.avg_daily_usage_hours ?? 'N/A';
          const unlocks = selectedAssessment.daily_unlocks ?? selectedAssessment.student_data?.daily_unlocks ?? 'N/A';
          const sleep = selectedAssessment.sleep_hours_per_night ?? selectedAssessment.student_data?.sleep_hours_per_night ?? 'N/A';
          const exercise = selectedAssessment.physical_activity_hours ?? selectedAssessment.student_data?.physical_activity_hours ?? 'N/A';
          const study = selectedAssessment.study_hours ?? selectedAssessment.student_data?.study_hours ?? 'N/A';
          const stress = selectedAssessment.stress_level ?? selectedAssessment.student_data?.stress_level ?? 'Normal';

          return (
            <div className="modal-assessment-content">
              {/* Score header banner */}
              <div
                className="modal-score-banner"
                style={{
                  backgroundColor: mCat.bg,
                  borderColor: mCat.border,
                }}
              >
                <div>
                  <span className="modal-score-label">Wellbeing Estimate</span>
                  <div className="modal-score-number" style={{ color: mCat.text }}>
                    <strong>{parseFloat(mScore).toFixed(1)}</strong>
                    <span> / 10</span>
                  </div>
                </div>
                <span
                  className="calm-category-badge"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: mCat.border,
                    color: mCat.text,
                  }}
                >
                  <span className="badge-dot" style={{ backgroundColor: mCat.color }} />
                  <span>{mCat.label}</span>
                </span>
              </div>

              {/* Parameter breakdown */}
              <h3 className="modal-section-title">What you shared in this check-in</h3>
              <div className="modal-params-grid">
                <div className="param-cell">
                  <span className="param-label">Age</span>
                  <span className="param-value">{age} years</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Gender</span>
                  <span className="param-value">{gender}</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Country</span>
                  <span className="param-value">{country}</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Academic stage</span>
                  <span className="param-value">{academicLevel}</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Primary platform</span>
                  <span className="param-value font-semibold">
                    {platform}
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Main purpose</span>
                  <span className="param-value">{purpose}</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Daily screen time</span>
                  <span className="param-value">
                    {usageHours} hrs/day
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Daily phone unlocks</span>
                  <span className="param-value">
                    {unlocks} unlocks
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Sleep per night</span>
                  <span className="param-value">
                    {sleep} hrs
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Physical activity</span>
                  <span className="param-value">
                    {exercise} hrs/day
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Dedicated study</span>
                  <span className="param-value">
                    {study} hrs/day
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Reported stress</span>
                  <span className="param-value font-semibold">
                    {stress}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
