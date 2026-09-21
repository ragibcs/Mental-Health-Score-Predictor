import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as api from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/formatters';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter your name.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.updateProfile({ name: name.trim() });
      updateUser({ name: res.user?.name || name.trim() });
      addToast('Your name has been updated.', 'success');
    } catch (err) {
      addToast(err.message || 'Unable to update profile right now.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    addToast('You have signed out quietly.', 'info');
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <span className="eyebrow">Your Space</span>
          <h1 className="profile-title">Account & Details</h1>
          <p className="profile-subtitle">
            Update your name and view your account information whenever you need.
          </p>
        </div>

        <div className="profile-grid">
          {/* Left card: Name Edit Form */}
          <div className="card profile-form-card">
            <div className="profile-avatar-row">
              <div className="profile-large-avatar" aria-hidden="true">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="profile-user-info">
                <h3 className="profile-user-name">{user?.name || 'Friend'}</h3>
                <p className="profile-user-email">{user?.email || 'N/A'}</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form">
              <Input
                label="Your Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                placeholder="Enter your name"
                required
              />

              <div className="form-group">
                <label className="form-label" htmlFor="profile-email-field">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <div className="input-icon-left">
                    <Mail size={18} />
                  </div>
                  <input
                    id="profile-email-field"
                    type="email"
                    className="form-input has-icon-left"
                    value={user?.email || ''}
                    disabled
                    aria-readonly="true"
                  />
                </div>
                <p className="form-hint">Your email is used to keep your check-in history private to you.</p>
              </div>

              <div className="profile-save-row">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  iconRight={Check}
                >
                  Save changes
                </Button>
              </div>
            </form>
          </div>

          {/* Right sidebar: Account details & quiet sign-out */}
          <div className="profile-sidebar-cards">
            <div className="card account-info-card">
              <h4 className="sidebar-card-title">Account Summary</h4>
              <div className="account-details-list">
                <div className="account-detail-item">
                  <div className="detail-icon-box">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="detail-label">Member since</span>
                    <p className="detail-val">
                      {user?.created_at ? formatDate(user.created_at) : 'Active member'}
                    </p>
                  </div>
                </div>

                <div className="account-detail-item">
                  <div className="detail-icon-box">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="detail-label">Sign-in email</span>
                    <p className="detail-val">{user?.email || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card quiet-signout-card">
              <h4 className="sidebar-card-title">Sign Out</h4>
              <p className="signout-desc">
                When you sign out, your check-ins and personal rhythm history remain securely saved for your next visit.
              </p>
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon={LogOut}
                onClick={handleLogout}
              >
                Sign out of account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
