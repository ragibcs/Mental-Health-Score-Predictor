import React from 'react';
import {
  User,
  Globe,
  GraduationCap,
  Smartphone,
  Compass,
  Unlock,
  Moon,
  Activity,
  BookOpen,
  Sparkles
} from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { COUNTRIES, ACADEMIC_LEVELS, PURPOSES_OF_USE, PLATFORMS } from '../../utils/constants';

export default function AssessmentForm({
  formData,
  errors,
  onChange,
}) {
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

  const academicOptions = [
    { value: 'High School', label: 'High School' },
    { value: 'Undergraduate', label: 'Undergraduate (College / Bachelor)' },
    { value: 'Graduate', label: 'Graduate (Master / Doctorate)' },
  ];

  const purposeOptions = [
    { value: 'Entertainment', label: 'Entertainment & Leisure' },
    { value: 'Education', label: 'Education & Learning' },
    { value: 'Networking', label: 'Social & Networking' },
    { value: 'News', label: 'News & Current Affairs' },
  ];

  const stressLevels = [
    { value: 'Low', label: 'Low', desc: 'Calm & balanced', key: 'stress-low' },
    { value: 'Medium', label: 'Medium', desc: 'Occasional pressure', key: 'stress-medium' },
    { value: 'High', label: 'High', desc: 'Frequent tension', key: 'stress-high' },
    { value: 'Very High', label: 'Very High', desc: 'Overwhelmed', key: 'stress-very-high' },
  ];

  // Restful range calculation on sleep slider (2 to 14): 7 to 9 hrs
  const sleepMin = 2;
  const sleepMax = 14;
  const restfulLeft = ((7 - sleepMin) / (sleepMax - sleepMin)) * 100;
  const restfulWidth = ((9 - 7) / (sleepMax - sleepMin)) * 100;

  return (
    <div className="calm-assessment-form">
      {/* ================= SECTION 1: ABOUT YOU ================= */}
      <section className="form-section-block">
        <div className="step-intro">
          <div className="section-step-badge">Part 1</div>
          <h2 className="step-heading">Tell us a little about yourself</h2>
          <p className="step-description">
            These simple background details help contextualize your daily rhythm and study patterns.
          </p>
        </div>

        <div className="form-grid-2">
          <Input
            label="Your Age"
            type="number"
            name="Age"
            min={10}
            max={100}
            value={formData.Age || ''}
            onChange={(e) => onChange('Age', parseInt(e.target.value, 10) || '')}
            placeholder="e.g. 21"
            icon={User}
            error={errors.Age}
            hint="Between 10 and 100 years."
            required
          />

          <div className="form-group">
            <label className="form-label">
              <span>Gender</span>
            </label>
            <div className="pill-selection-row" role="radiogroup" aria-label="Gender selection">
              {genderOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={formData.gender === opt.value}
                  className={`choice-pill-btn ${formData.gender === opt.value ? 'selected' : ''}`}
                  onClick={() => onChange('gender', opt.value)}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            {errors.gender && <p className="form-error">{errors.gender}</p>}
          </div>
        </div>

        <div className="form-grid-2">
          <Select
            label="Country of Residence"
            name="country"
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
            value={formData.country}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder="Select country"
            icon={Globe}
            error={errors.country}
            required
          />

          <Select
            label="Academic Level"
            name="academic_level"
            options={academicOptions}
            value={formData.academic_level}
            onChange={(e) => onChange('academic_level', e.target.value)}
            placeholder="Select academic stage"
            icon={GraduationCap}
            error={errors.academic_level}
            required
          />
        </div>
      </section>

      <div className="form-section-divider" />

      {/* ================= SECTION 2: YOUR DIGITAL LIFE ================= */}
      <section className="form-section-block">
        <div className="step-intro">
          <div className="section-step-badge">Part 2</div>
          <h2 className="step-heading">Your digital life</h2>
          <p className="step-description">
            Our devices keep us connected, but they also shape how our minds rest and recharge.
          </p>
        </div>

        {/* Most Used Platform Grid */}
        <div className="form-group">
          <label className="form-label">
            <span>Primary Social Platform</span>
            <span className="form-label-sub">{formData.most_used_platform || 'Choose one'}</span>
          </label>
          <div className="platform-grid" role="radiogroup" aria-label="Most used platform">
            {PLATFORMS.map((plat) => {
              const isSelected = formData.most_used_platform === plat.value;
              return (
                <button
                  key={plat.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`platform-pill-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => onChange('most_used_platform', plat.value)}
                >
                  <Smartphone size={16} className="platform-icon" />
                  <span>{plat.label}</span>
                </button>
              );
            })}
          </div>
          {errors.most_used_platform && (
            <p className="form-error">{errors.most_used_platform}</p>
          )}
        </div>

        <div className="form-grid-2" style={{ marginTop: '1.5rem' }}>
          <Select
            label="Main Purpose of Use"
            name="purpose_of_use"
            options={purposeOptions}
            value={formData.purpose_of_use}
            onChange={(e) => onChange('purpose_of_use', e.target.value)}
            placeholder="What brings you online most?"
            icon={Compass}
            error={errors.purpose_of_use}
            required
          />

          <Input
            label="Daily Phone Unlocks"
            type="number"
            name="daily_unlocks"
            min={0}
            max={500}
            value={formData.daily_unlocks ?? ''}
            onChange={(e) => onChange('daily_unlocks', parseInt(e.target.value, 10) || 0)}
            placeholder="e.g. 65"
            icon={Unlock}
            error={errors.daily_unlocks}
            hint="Estimated times you check your phone each day."
            required
          />
        </div>

        {/* Daily Screen Time Range Slider */}
        <div className="calm-slider-container">
          <div className="slider-header">
            <label className="slider-label" htmlFor="screen-time-slider">
              Daily Social Screen Time
            </label>
            <div className="slider-large-value">
              <strong>{formData.avg_daily_usage_hours}</strong>
              <span>hrs / day</span>
            </div>
          </div>
          <div className="calm-slider-track-box">
            <input
              id="screen-time-slider"
              type="range"
              min="0"
              max="16"
              step="0.5"
              className="calm-range-input"
              value={formData.avg_daily_usage_hours}
              onChange={(e) => onChange('avg_daily_usage_hours', parseFloat(e.target.value))}
              aria-label="Daily social screen time in hours"
            />
          </div>
          <div className="slider-ticks">
            <span>0h</span>
            <span>4h</span>
            <span>8h</span>
            <span>12h</span>
            <span>16h+</span>
          </div>
          {errors.avg_daily_usage_hours && (
            <p className="form-error">{errors.avg_daily_usage_hours}</p>
          )}
        </div>
      </section>

      <div className="form-section-divider" />

      {/* ================= SECTION 3: YOUR DAILY RHYTHM ================= */}
      <section className="form-section-block">
        <div className="step-intro">
          <div className="section-step-badge">Part 3</div>
          <h2 className="step-heading">Your daily rhythm</h2>
          <p className="step-description">
            Sleep, movement, and study balance form the quiet foundation of how you feel each day.
          </p>
        </div>

        {/* Sleep Slider with Restful Range Band */}
        <div className="calm-slider-container">
          <div className="slider-header">
            <div className="slider-label-with-badge">
              <label className="slider-label" htmlFor="sleep-hours-slider">
                Sleep per Night
              </label>
              <span className="restful-badge">Restful zone: 7–9 hrs</span>
            </div>
            <div className="slider-large-value">
              <strong>{formData.sleep_hours_per_night}</strong>
              <span>hrs / night</span>
            </div>
          </div>
          <div className="calm-slider-track-box with-band">
            <div
              className="restful-range-band"
              style={{
                left: `${restfulLeft}%`,
                width: `${restfulWidth}%`,
              }}
              title="Recommended restful sleep range (7-9 hours)"
            />
            <input
              id="sleep-hours-slider"
              type="range"
              min="2"
              max="14"
              step="0.5"
              className="calm-range-input"
              value={formData.sleep_hours_per_night}
              onChange={(e) => onChange('sleep_hours_per_night', parseFloat(e.target.value))}
              aria-label="Sleep hours per night"
            />
          </div>
          <div className="slider-ticks">
            <span>2h</span>
            <span>5h</span>
            <span className="tick-restful">7h – 9h (Restful)</span>
            <span>11h</span>
            <span>14h</span>
          </div>
          {errors.sleep_hours_per_night && (
            <p className="form-error">{errors.sleep_hours_per_night}</p>
          )}
        </div>

        {/* Physical Activity Slider */}
        <div className="calm-slider-container" style={{ marginTop: '1.75rem' }}>
          <div className="slider-header">
            <label className="slider-label" htmlFor="activity-hours-slider">
              Physical Activity & Exercise
            </label>
            <div className="slider-large-value">
              <strong>{formData.physical_activity_hours}</strong>
              <span>hrs / day</span>
            </div>
          </div>
          <div className="calm-slider-track-box">
            <input
              id="activity-hours-slider"
              type="range"
              min="0"
              max="6"
              step="0.5"
              className="calm-range-input"
              value={formData.physical_activity_hours}
              onChange={(e) => onChange('physical_activity_hours', parseFloat(e.target.value))}
              aria-label="Daily physical activity in hours"
            />
          </div>
          <div className="slider-ticks">
            <span>0h</span>
            <span>1.5h</span>
            <span>3h</span>
            <span>4.5h</span>
            <span>6h</span>
          </div>
          {errors.physical_activity_hours && (
            <p className="form-error">{errors.physical_activity_hours}</p>
          )}
        </div>

        {/* Study Hours Slider */}
        <div className="calm-slider-container" style={{ marginTop: '1.75rem' }}>
          <div className="slider-header">
            <label className="slider-label" htmlFor="study-hours-slider">
              Focused Study Time
            </label>
            <div className="slider-large-value">
              <strong>{formData.study_hours}</strong>
              <span>hrs / day</span>
            </div>
          </div>
          <div className="calm-slider-track-box">
            <input
              id="study-hours-slider"
              type="range"
              min="0"
              max="14"
              step="0.5"
              className="calm-range-input"
              value={formData.study_hours}
              onChange={(e) => onChange('study_hours', parseFloat(e.target.value))}
              aria-label="Daily dedicated study hours"
            />
          </div>
          <div className="slider-ticks">
            <span>0h</span>
            <span>3.5h</span>
            <span>7h</span>
            <span>10.5h</span>
            <span>14h</span>
          </div>
          {errors.study_hours && (
            <p className="form-error">{errors.study_hours}</p>
          )}
        </div>

        {/* Stress Level 4 Pill Buttons */}
        <div className="form-group" style={{ marginTop: '2rem' }}>
          <label className="form-label">
            <span>How has your stress felt recently?</span>
          </label>
          <div className="stress-pills-row" role="radiogroup" aria-label="Stress level selection">
            {stressLevels.map((lvl) => {
              const isSelected = formData.stress_level === lvl.value;
              return (
                <button
                  key={lvl.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`stress-pill-btn ${lvl.key} ${isSelected ? 'selected' : ''}`}
                  onClick={() => onChange('stress_level', lvl.value)}
                >
                  <div className="stress-pill-content">
                    <span className="stress-pill-title">{lvl.label}</span>
                    <span className="stress-pill-desc">{lvl.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.stress_level && (
            <p className="form-error">{errors.stress_level}</p>
          )}
        </div>
      </section>
    </div>
  );
}
