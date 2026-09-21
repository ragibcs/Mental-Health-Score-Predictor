import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Please share your email address so we know who you are.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "That doesn't look quite like a valid email. Could you double-check?";
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password to continue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(formData);
      addToast('Welcome back. Take a deep breath and settle in.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      const friendlyMsg = "Those details didn't quite match our records. Would you like to try again?";
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
            <span className="eyebrow">Welcome Back</span>
            <h1 className="auth-title">How are you today?</h1>
            <p className="auth-subtitle">
              Let's take a quiet look together. Sign in to your peaceful wellbeing space.
            </p>
          </div>

          {errors.general && (
            <div className="auth-friendly-error">
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@school.edu"
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
              placeholder="Your password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password || errors.general) {
                  setErrors({ ...errors, password: null, general: null });
                }
              }}
              error={errors.password}
              autoComplete="current-password"
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
                Sign in to your space
              </Button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              New to MindPulse?{' '}
              <Link to="/register" className="auth-link">
                Create a quiet account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
