// Date, score, and text formatting utilities

export function formatDate(isoString) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatShortDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return '';
  }
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Colours are returned as design tokens (not literals) so every badge, pill and
// gauge that consumes them re-themes automatically in dark mode.
export function getScoreCategory(score) {
  const s = parseFloat(score);
  if (isNaN(s)) return { label: 'Unknown', variant: 'neutral' };
  if (s >= 7.5) {
    return {
      label: 'Good / Balanced',
      variant: 'success',
      color: 'var(--good)',
      bg: 'var(--good-bg)',
      border: 'var(--good-border)',
      text: 'var(--good-text)',
      summary: 'Your daily habits, physical activity, and sleep rhythms reflect a supportive, healthy balance.'
    };
  } else if (s >= 5.8) {
    return {
      label: 'Moderate',
      variant: 'warning',
      color: 'var(--moderate)',
      bg: 'var(--moderate-bg)',
      border: 'var(--moderate-border)',
      text: 'var(--moderate-text)',
      summary: 'Your routine shows mild pressure points, perhaps around sleep or screen time. A few gentle adjustments can help you feel more refreshed.'
    };
  } else {
    return {
      label: 'Needs Attention',
      variant: 'danger',
      color: 'var(--needs-attention)',
      bg: 'var(--needs-attention-bg)',
      border: 'var(--needs-attention-border)',
      text: 'var(--needs-attention-text)',
      summary: 'Your check-in indicates you may be carrying extra strain right now. Take extra care of yourself, prioritize gentle rest, and reach out if you need support.'
    };
  }
}
