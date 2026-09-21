import React from 'react';
import { User, Smartphone, Moon, BookOpen, Edit2 } from 'lucide-react';
import Button from '../ui/Button';

export default function ReviewAssessment({ formData, onEditStep }) {
  return (
    <div className="review-assessment-container">
      <div className="review-header">
        <h3 className="review-title">Review Your Information</h3>
        <p className="review-subtitle">
          Please verify that the details below are accurate before generating your AI mental health wellbeing score.
        </p>
      </div>

      <div className="review-grid">
        {/* Card 1: Demographics */}
        <div className="card review-card">
          <div className="review-card-header">
            <div className="review-card-title-group">
              <div className="review-icon-box">
                <User size={18} color="var(--primary)" />
              </div>
              <h4>Demographics</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={Edit2}
              onClick={() => onEditStep(1)}
              className="edit-step-btn"
            >
              Edit
            </Button>
          </div>
          <div className="review-items">
            <div className="review-item">
              <span className="review-label">Age</span>
              <span className="review-val">{formData.Age} years</span>
            </div>
            <div className="review-item">
              <span className="review-label">Gender</span>
              <span className="review-val">{formData.gender}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Country</span>
              <span className="review-val">{formData.country}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Academic Level</span>
              <span className="review-val">{formData.academic_level}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Digital & Social Habits */}
        <div className="card review-card">
          <div className="review-card-header">
            <div className="review-card-title-group">
              <div className="review-icon-box">
                <Smartphone size={18} color="var(--primary)" />
              </div>
              <h4>Digital Habits</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={Edit2}
              onClick={() => onEditStep(2)}
              className="edit-step-btn"
            >
              Edit
            </Button>
          </div>
          <div className="review-items">
            <div className="review-item">
              <span className="review-label">Most Used Platform</span>
              <span className="review-val font-semibold">{formData.most_used_platform}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Primary Purpose</span>
              <span className="review-val">{formData.purpose_of_use}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Daily Social Media</span>
              <span className="review-val">{formData.avg_daily_usage_hours} hrs / day</span>
            </div>
            <div className="review-item">
              <span className="review-label">Daily Phone Unlocks</span>
              <span className="review-val">{formData.daily_unlocks} unlocks / day</span>
            </div>
          </div>
        </div>

        {/* Card 3: Daily Lifestyle */}
        <div className="card review-card">
          <div className="review-card-header">
            <div className="review-card-title-group">
              <div className="review-icon-box">
                <Moon size={18} color="var(--primary)" />
              </div>
              <h4>Daily Lifestyle</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={Edit2}
              onClick={() => onEditStep(3)}
              className="edit-step-btn"
            >
              Edit
            </Button>
          </div>
          <div className="review-items">
            <div className="review-item">
              <span className="review-label">Sleep Duration</span>
              <span className="review-val font-semibold">{formData.sleep_hours_per_night} hrs / night</span>
            </div>
            <div className="review-item">
              <span className="review-label">Physical Activity</span>
              <span className="review-val">{formData.physical_activity_hours} hrs / day</span>
            </div>
          </div>
        </div>

        {/* Card 4: Academic & Stress */}
        <div className="card review-card">
          <div className="review-card-header">
            <div className="review-card-title-group">
              <div className="review-icon-box">
                <BookOpen size={18} color="var(--primary)" />
              </div>
              <h4>Academic & Stress</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={Edit2}
              onClick={() => onEditStep(4)}
              className="edit-step-btn"
            >
              Edit
            </Button>
          </div>
          <div className="review-items">
            <div className="review-item">
              <span className="review-label">Daily Study Time</span>
              <span className="review-val">{formData.study_hours} hrs / day</span>
            </div>
            <div className="review-item">
              <span className="review-label">Self-Assessed Stress</span>
              <span className="review-val font-semibold text-primary">{formData.stress_level}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
