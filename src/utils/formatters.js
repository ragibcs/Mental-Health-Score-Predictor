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

export function getScoreCategory(score) {
  const s = parseFloat(score);
  if (isNaN(s)) return { label: 'Unknown', variant: 'neutral' };
  if (s >= 7.5) {
    return {
      label: 'Good / Balanced',
      variant: 'success',
      color: '#4E8F6C',
      bg: '#EFF7F2',
      border: '#C8E5D5',
      text: '#23583C',
      summary: 'Your daily habits, physical activity, and sleep rhythms reflect a supportive, healthy balance.'
    };
  } else if (s >= 5.8) {
    return {
      label: 'Moderate',
      variant: 'warning',
      color: '#C98638',
      bg: '#FDF7EE',
      border: '#F3DCB7',
      text: '#7A4B13',
      summary: 'Your routine shows mild pressure points, perhaps around sleep or screen time. A few gentle adjustments can help you feel more refreshed.'
    };
  } else {
    return {
      label: 'Needs Attention',
      variant: 'danger',
      color: '#C86A50',
      bg: '#FAF2EF',
      border: '#ECC7BC',
      text: '#853A26',
      summary: 'Your check-in indicates you may be carrying extra strain right now. Take extra care of yourself, prioritize gentle rest, and reach out if you need support.'
    };
  }
}
