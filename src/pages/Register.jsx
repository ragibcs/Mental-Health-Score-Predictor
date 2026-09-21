import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please share your name with us.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide an email address.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email format (e.g. name@school.edu).';
    }

    if (!formData.password) {
      newErrors.password = 'Please choose a password to keep your space secure.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A password with at least 6 characters helps keep your records safe.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(formData);
      addToast('Welcome to your calm reflection sanctuary.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const friendlyMsg = err.message || 'We could not create your account just yet. Please double-check your details.';
      addToast(friendlyMsg, 'error');
      setErrors({ general: friendlyMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Ambient decorative gradient blobs (cream, sage, pale blue) */}
      <div className="calm-blob blob-top-left" aria-hidden="true" />
      <div className="calm-blob blob-bottom-right" aria-hidden="true" />

      <div className="auth-container">
        <div className="card auth-card">
          <div className="auth-header">
            <span className="eyebrow">Your Safe Sanctuary</span>
            <h1 className="auth-title">Create your space</h1>
            <p className="auth-subtitle">
              Join MindPulse for gentle, non-judgmental reflections on your study rhythms and digital wellbeing.
            </p>
          </div>

          {errors.general && (
            <div className="auth-friendly-error">
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <Input
              label="Your name"
              type="text"
              placeholder="e.g. Alex"
              icon={User}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name || errors.general) {
                  setErrors({ ...errors, name: null, general: null });
                }
              }}
              error={errors.name}
              autoComplete="name"
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="alex@school.edu"
              icon={Mail}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email || errors.general) {
                  setErrors({ ...errors, email: null, general: null });
                }
              }}
              error={errors.email}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Choose a password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password || errors.general) {
                  setErrors({ ...errors, password: null, general: null });
                }
              }}
              error={errors.password}
              hint="6 or more characters to keep your reflections private."
              autoComplete="new-password"
              required
            />

            <div className="auth-action-row">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                iconRight={ArrowRight}
              >
                Begin your journey
              </Button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="auth-benefits">
            <div className="benefit-row">
              <Check size={14} className="benefit-icon" />
              <span>Private, respectful check-ins on your own schedule</span>
            </div>
            <div className="benefit-row">
              <Check size={14} className="benefit-icon" />
              <span>Quiet longitudinal reflections with no clinical pressure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
