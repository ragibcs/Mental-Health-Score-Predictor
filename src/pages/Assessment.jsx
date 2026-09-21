import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as api from '../services/api';
import AssessmentForm from '../components/assessment/AssessmentForm';
import Button from '../components/ui/Button';

const INITIAL_FORM_DATA = {
  Age: 21,
  gender: 'Male',
  country: 'United States',
  academic_level: 'Undergraduate',
  most_used_platform: 'Instagram',
  purpose_of_use: 'Entertainment',
  avg_daily_usage_hours: 3.5,
  daily_unlocks: 65,
  study_hours: 4.0,
  physical_activity_hours: 1.0,
  sleep_hours_per_night: 7.0,
  stress_level: 'Medium',
};

export default function Assessment() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Section 1: Demographics & Education
    if (!formData.Age || formData.Age < 10 || formData.Age > 100) {
      newErrors.Age = 'Please enter a valid age between 10 and 100.';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender.';
    }
    if (!formData.country) {
      newErrors.country = 'Please select your country of residence.';
    }
    if (!formData.academic_level) {
      newErrors.academic_level = 'Please select your academic stage.';
    }

    // Section 2: Digital habits
    if (!formData.most_used_platform) {
      newErrors.most_used_platform = 'Please choose the platform you spend the most time on.';
    }
    if (!formData.purpose_of_use) {
      newErrors.purpose_of_use = 'Please select your primary reason for being online.';
    }
    if (formData.avg_daily_usage_hours === undefined || formData.avg_daily_usage_hours < 0 || formData.avg_daily_usage_hours > 24) {
      newErrors.avg_daily_usage_hours = 'Daily usage must be between 0 and 24 hours.';
    }
    if (formData.daily_unlocks === undefined || formData.daily_unlocks < 0) {
      newErrors.daily_unlocks = 'Please specify estimated daily unlocks.';
    }

    // Section 3: Daily rhythm & stress
    if (formData.sleep_hours_per_night === undefined || formData.sleep_hours_per_night < 0 || formData.sleep_hours_per_night > 24) {
      newErrors.sleep_hours_per_night = 'Sleep hours must be between 0 and 24.';
    }
    if (formData.physical_activity_hours === undefined || formData.physical_activity_hours < 0 || formData.physical_activity_hours > 24) {
      newErrors.physical_activity_hours = 'Activity hours must be between 0 and 24.';
    }
    if (formData.study_hours === undefined || formData.study_hours < 0 || formData.study_hours > 24) {
      newErrors.study_hours = 'Study hours must be between 0 and 24.';
    }
    if (!formData.stress_level) {
      newErrors.stress_level = 'Please select how your stress has felt recently.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) {
      addToast('Please complete the highlighted questions before continuing.', 'warning');
      const firstErrorKey = Object.keys(errors)[0];
      const errorEl = document.querySelector(`[name="${firstErrorKey}"]`) || document.querySelector('.form-error');
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.predictMentalHealth(formData);
      addToast('Your check-in is ready.', 'success');
      navigate('/result', {
        state: {
          prediction: result,
          studentData: formData,
        },
      });
    } catch (err) {
      addToast(err.message || 'We could not complete your check-in right now. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="assessment-page">
      <div className="assessment-container">
        {/* Page Header */}
        <div className="assessment-header text-center">
          <span className="eyebrow">Personal Wellbeing Check-in</span>
          <h1 className="assessment-title">A quiet space to check in with yourself</h1>
          <p className="assessment-subtitle">
            Reflect on your daily habits, study balance, and how you feel. All 12 questions on one calm page—there are no right or wrong answers.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="card assessment-card-main">
          <AssessmentForm
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />

          {/* Unified Submission Footer */}
          <div className="assessment-single-footer">
            <div className="assessment-trust-pills">
              <span className="assessment-trust-item">
                <Clock size={15} />
                <span>Takes ~2 minutes</span>
              </span>
              <span className="assessment-trust-item">
                <Heart size={15} />
                <span>Zero judgment</span>
              </span>
              <span className="assessment-trust-item">
                <ShieldCheck size={15} />
                <span>Confidential & private</span>
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              iconRight={Sparkles}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="assessment-submit-btn"
            >
              See my check-in
            </Button>
          </div>
        </div>

        {/* Subtle Privacy & Care Note */}
        <p className="assessment-privacy-note text-center">
          MindPulse uses evidence-based modeling to estimate wellbeing indicators for educational self-awareness. Your entries remain private to your account.
        </p>
      </div>
    </div>
  );
}
