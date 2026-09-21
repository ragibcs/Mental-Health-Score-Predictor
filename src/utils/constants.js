// Constants for Mental Health Score Predictor

export const COUNTRIES = [
  'USA',
  'Canada',
  'UK',
  'Australia',
  'Germany',
  'France',
  'India',
  'Mexico',
  'Turkey',
  'Bangladesh',
  'Brazil',
  'Japan',
  'South Korea',
  'Spain',
  'Italy',
  'Netherlands',
  'Switzerland',
  'Sweden',
  'Singapore',
  'Other'
];

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male', icon: 'User' },
  { value: 'Female', label: 'Female', icon: 'User' }
];

export const ACADEMIC_LEVELS = [
  { value: 'High School', label: 'High School', desc: 'Secondary education or prep' },
  { value: 'Undergraduate', label: 'Undergraduate', desc: 'Bachelor’s degree student' },
  { value: 'Graduate', label: 'Graduate', desc: 'Master’s or Doctoral program' }
];

export const PLATFORMS = [
  { value: 'Instagram', label: 'Instagram', color: '#E1306C' },
  { value: 'TikTok', label: 'TikTok', color: '#000000' },
  { value: 'Youtube', label: 'YouTube', color: '#FF0000' },
  { value: 'Twitter', label: 'Twitter / X', color: '#1DA1F2' },
  { value: 'LinkedIn', label: 'LinkedIn', color: '#0A66C2' },
  { value: 'Facebook', label: 'Facebook', color: '#1877F2' },
  { value: 'Snapchat', label: 'Snapchat', color: '#FFFC00' },
  { value: 'Whatsapp', label: 'WhatsApp', color: '#25D366' },
  { value: 'WeChat', label: 'WeChat', color: '#07C160' },
  { value: 'LINE', label: 'LINE', color: '#00C300' },
  { value: 'KakaoTalk', label: 'KakaoTalk', color: '#FEE500' }
];

export const PURPOSES_OF_USE = [
  { value: 'Entertainment', label: 'Entertainment & Leisure', desc: 'Reels, videos, casual scrolling' },
  { value: 'Education', label: 'Education & Learning', desc: 'Tutorials, study groups, research' },
  { value: 'Networking', label: 'Networking & Career', desc: 'Professional contacts, communities' },
  { value: 'News', label: 'News & Current Affairs', desc: 'Articles, updates, global events' }
];

export const STRESS_LEVELS = [
  { value: 'Low', label: 'Low Stress', desc: 'Calm, in control, relaxed baseline', color: '#059669' },
  { value: 'Medium', label: 'Moderate Stress', desc: 'Manageable daily academic/life pressure', color: '#D97706' },
  { value: 'High', label: 'High Stress', desc: 'Frequent overwhelm and academic tension', color: '#EA580C' },
  { value: 'Very High', label: 'Severe Stress', desc: 'Acute strain, persistent anxiety/exhaustion', color: '#E11D48' }
];

export const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or text 988 (USA & Canada)',
    availability: '24/7, Free & Confidential'
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    availability: '24/7 Support via SMS'
  },
  {
    name: 'International Mental Health Support',
    contact: 'findahelpline.com',
    availability: 'Worldwide directory of support lines'
  }
];
