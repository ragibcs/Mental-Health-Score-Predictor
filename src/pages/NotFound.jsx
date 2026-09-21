import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container text-center">
        <div className="not-found-icon-circle">
          <Activity size={48} color="var(--primary)" />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          The page or wellness resource you are looking for does not exist, has been moved, or is temporarily unavailable.
        </p>

        <div className="not-found-actions">
          <Button
            variant="primary"
            size="lg"
            icon={Home}
            onClick={() => navigate('/')}
          >
            Return to Homepage
          </Button>
          <Button
            variant="outline"
            size="lg"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
