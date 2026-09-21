import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Download,
  Trash2,
  Eye,
  PlusCircle,
  Calendar,
  Sparkles,
  Smartphone,
  Moon,
  Activity,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import * as api from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import { formatDate, getScoreCategory } from '../utils/formatters';

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getAssessmentHistory();
      setHistory(data);
    } catch (err) {
      addToast(err.message || 'Unable to load your check-in history right now.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
  };

  const handleExecuteDelete = async () => {
    if (!deleteTargetId) return;

    setIsDeleting(true);
    try {
      await api.deleteAssessment(deleteTargetId);
      addToast('Check-in removed from your history.', 'success');
      setHistory((prev) => prev.filter((item) => item.id !== deleteTargetId));
      if (selectedAssessment?.id === deleteTargetId) {
        setIsDetailModalOpen(false);
      }
      setDeleteTargetId(null);
    } catch (err) {
      addToast(err.message || 'Could not remove check-in.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getItemScore = (item) => item.predicted_score ?? item.score ?? 0;
  const getItemData = (item) => ({
    age: item.age ?? item.Age ?? item.student_data?.Age ?? 'N/A',
    gender: item.gender ?? item.student_data?.gender ?? 'N/A',
    country: item.country ?? item.student_data?.country ?? 'N/A',
    academic_level: item.academic_level ?? item.student_data?.academic_level ?? 'N/A',
    most_used_platform: item.most_used_platform ?? item.student_data?.most_used_platform ?? 'Social Media',
    purpose_of_use: item.purpose_of_use ?? item.student_data?.purpose_of_use ?? 'General',
    avg_daily_usage_hours: item.avg_daily_usage_hours ?? item.student_data?.avg_daily_usage_hours ?? 'N/A',
    daily_unlocks: item.daily_unlocks ?? item.student_data?.daily_unlocks ?? 'N/A',
    sleep_hours_per_night: item.sleep_hours_per_night ?? item.student_data?.sleep_hours_per_night ?? 'N/A',
    physical_activity_hours: item.physical_activity_hours ?? item.student_data?.physical_activity_hours ?? 'N/A',
    study_hours: item.study_hours ?? item.student_data?.study_hours ?? 'N/A',
    stress_level: item.stress_level ?? item.student_data?.stress_level ?? 'Normal',
  });

  const handleExportCSV = () => {
    if (history.length === 0) {
      addToast('No check-ins available to export.', 'warning');
      return;
    }

    const headers = [
      'ID', 'Date', 'Score', 'Age', 'Gender', 'Country', 'Academic Level',
      'Platform', 'Purpose', 'Daily Usage (hrs)', 'Daily Unlocks',
      'Sleep (hrs)', 'Activity (hrs)', 'Study (hrs)', 'Stress Level'
    ];

    const rows = history.map((item) => {
      const d = getItemData(item);
      const score = getItemScore(item);
      return [
        item.id,
        item.created_at,
        typeof score === 'number' ? score.toFixed(2) : score,
        d.age,
        d.gender,
        d.country,
        d.academic_level,
        d.most_used_platform,
        d.purpose_of_use,
        d.avg_daily_usage_hours,
        d.daily_unlocks,
        d.sleep_hours_per_night,
        d.physical_activity_hours,
        d.study_hours,
        d.stress_level,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mindpulse_checkins_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Your check-in history was downloaded as CSV.', 'success');
  };

  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    const d = getItemData(item);
    const score = getItemScore(item);
    const platform = d.most_used_platform.toLowerCase();
    const stress = d.stress_level.toLowerCase();
    const scoreStr = score.toString();
    const dateStr = formatDate(item.created_at).toLowerCase();

    return (
      platform.includes(query) ||
      stress.includes(query) ||
      scoreStr.includes(query) ||
      dateStr.includes(query)
    );
  });

  return (
    <div className="history-page">
      <div className="history-container">
        {/* Page Header */}
        <div className="history-header-row">
          <div>
            <span className="eyebrow">Past Reflections</span>
            <h1 className="history-title">Check-in History</h1>
            <p className="history-subtitle">
              Browse, filter, and reflect on your previous check-ins and wellbeing journeys.
            </p>
          </div>

          <div className="history-action-buttons">
            <Button
              variant="outline"
              size="md"
              icon={Download}
              onClick={handleExportCSV}
              disabled={history.length === 0}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={PlusCircle}
              onClick={() => navigate('/assessment')}
            >
              New check-in
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="card history-filter-card">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Filter by platform, stress level, date, or score..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter check-ins"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Card List of Check-ins */}
        {isLoading ? (
          <div className="history-cards-stack">
            <Skeleton width="100%" height="130px" borderRadius="20px" />
            <Skeleton width="100%" height="130px" borderRadius="20px" />
            <Skeleton width="100%" height="130px" borderRadius="20px" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="card history-empty-card">
            <div className="calm-empty-illustration">
              <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
                <circle cx="50" cy="45" r="38" fill="var(--primary-soft)" />
                <circle cx="50" cy="45" r="26" fill="#FFFFFF" stroke="var(--accent-sage)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M38 48C38 48 43 54 50 54C57 54 62 48 62 48" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3>
              {searchQuery
                ? 'No check-ins match your search'
                : 'No check-ins completed yet'}
            </h3>
            <p className="empty-desc">
              {searchQuery
                ? 'Try searching with different keywords or clear the filter to see all records.'
                : 'Take your first 2-minute check-in to start building your personal rhythm log.'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                icon={PlusCircle}
                onClick={() => navigate('/assessment')}
              >
                Start your first check-in
              </Button>
            )}
          </div>
        ) : (
          <div className="history-cards-stack">
            {filteredHistory.map((item) => {
              const score = getItemScore(item);
              const d = getItemData(item);
              const cat = getScoreCategory(score);
              return (
                <div key={item.id} className="card history-entry-card">
                  {/* Left block: Date + Score + Category Badge */}
                  <div className="entry-identity-col">
                    <div className="entry-date-row">
                      <Calendar size={14} className="entry-calendar-icon" />
                      <span className="entry-date-text">{formatDate(item.created_at)}</span>
                    </div>

                    <div className="entry-score-category-row">
                      <div
                        className="entry-score-pill"
                        style={{
                          backgroundColor: cat.bg,
                          color: cat.text,
                          borderColor: cat.border,
                        }}
                      >
                        <span className="entry-score-num">{parseFloat(score).toFixed(1)}</span>
                        <span className="entry-score-scale">/ 10</span>
                      </div>

                      <span
                        className="calm-category-badge"
                        style={{
                          backgroundColor: cat.bg,
                          borderColor: cat.border,
                          color: cat.text,
                        }}
                      >
                        <span className="badge-dot" style={{ backgroundColor: cat.color }} />
                        <span>{cat.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Middle block: Key behavioral inputs */}
                  <div className="entry-details-grid">
                    <div className="entry-metric-pill">
                      <Smartphone size={14} className="metric-icon" />
                      <span>{d.most_used_platform} · {d.avg_daily_usage_hours}h</span>
                    </div>
                    <div className="entry-metric-pill">
                      <Moon size={14} className="metric-icon" />
                      <span>{d.sleep_hours_per_night}h sleep</span>
                    </div>
                    <div className="entry-metric-pill">
                      <BookOpen size={14} className="metric-icon" />
                      <span>{d.study_hours}h study</span>
                    </div>
                    <div className="entry-metric-pill">
                      <Activity size={14} className="metric-icon" />
                      <span>{d.stress_level} stress</span>
                    </div>
                  </div>

                  {/* Right block: Action buttons */}
                  <div className="entry-actions-col">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => {
                        setSelectedAssessment(item);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      className="remove-entry-btn"
                      onClick={() => confirmDelete(item.id)}
                      aria-label="Remove check-in"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setSelectedAssessment(null);
          setIsDetailModalOpen(false);
        }}
        title="Check-in Reflection"
        subtitle={
          selectedAssessment?.created_at
            ? `Logged on ${formatDate(selectedAssessment.created_at)}`
            : 'Evaluation Details'
        }
        size="lg"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              className="text-terracotta"
              onClick={() => {
                confirmDelete(selectedAssessment?.id);
              }}
            >
              Remove check-in
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Close
            </Button>
          </div>
        }
      >
        {selectedAssessment && (() => {
          const mScore = getItemScore(selectedAssessment);
          const mData = getItemData(selectedAssessment);
          const mCat = getScoreCategory(mScore);
          return (
            <div className="modal-assessment-content">
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
                    backgroundColor: '#FFFFFF',
                    borderColor: mCat.border,
                    color: mCat.text,
                  }}
                >
                  <span className="badge-dot" style={{ backgroundColor: mCat.color }} />
                  <span>{mCat.label}</span>
                </span>
              </div>

              <h4 className="modal-section-title">What you shared in this check-in</h4>
              <div className="modal-params-grid">
                <div className="param-cell">
                  <span className="param-label">Age</span>
                  <span className="param-value">{mData.age} years</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Gender</span>
                  <span className="param-value">{mData.gender}</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Country</span>
                  <span className="param-value">{mData.country}</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Academic stage</span>
                  <span className="param-value">{mData.academic_level}</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Primary platform</span>
                  <span className="param-value font-semibold">
                    {mData.most_used_platform}
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Main purpose</span>
                  <span className="param-value">{mData.purpose_of_use}</span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Daily screen time</span>
                  <span className="param-value">
                    {mData.avg_daily_usage_hours} hrs/day
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Daily phone unlocks</span>
                  <span className="param-value">
                    {mData.daily_unlocks} unlocks
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Sleep per night</span>
                  <span className="param-value">
                    {mData.sleep_hours_per_night} hrs
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Physical activity</span>
                  <span className="param-value">
                    {mData.physical_activity_hours} hrs/day
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Dedicated study</span>
                  <span className="param-value">
                    {mData.study_hours} hrs/day
                  </span>
                </div>
                <div className="param-cell">
                  <span className="param-label">Reported stress</span>
                  <span className="param-value font-semibold">
                    {mData.stress_level}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Gentle Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        title="Remove this check-in?"
        subtitle="This action is gentle and private."
        size="sm"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setDeleteTargetId(null)}
              disabled={isDeleting}
            >
              Keep check-in
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleExecuteDelete}
              isLoading={isDeleting}
            >
              Remove
            </Button>
          </div>
        }
      >
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
          Removing this check-in will take it off your history and recalculate your overall average. You can always take a new reflection whenever you're ready.
        </p>
      </Modal>
    </div>
  );
}
