// Centralized API Service for Mental Health Score Predictor

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:2200';

function getAuthHeader() {
  const token = localStorage.getItem('mh_auth_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Human-readable error transformation
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (data && data.detail) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          // FastAPI validation errors
          errorMessage = data.detail
            .map((err) => {
              const field = err.loc ? err.loc.slice(-1)[0] : 'field';
              return `${field}: ${err.msg}`;
            })
            .join('; ');
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the prediction server. Please make sure the backend is running.');
    }
    throw err;
  }
}

// --- Auth Endpoints ---

export async function login({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    localStorage.setItem('mh_auth_token', data.token);
  }
  return data;
}

export async function register({ name, email, password }) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (data.token) {
    localStorage.setItem('mh_auth_token', data.token);
  }
  return data;
}

export async function getCurrentUser() {
  return request('/auth/me');
}

export async function updateProfile({ name }) {
  return request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
}

export function logout() {
  localStorage.removeItem('mh_auth_token');
}

// --- Assessment & Prediction Endpoints ---

export async function predictMentalHealth(studentData) {
  // studentData matches StudentData Pydantic model exactly
  return request('/predict', {
    method: 'POST',
    body: JSON.stringify(studentData),
  });
}

export async function getAssessmentHistory() {
  return request('/assessments/history');
}

export async function getAssessmentDetail(id) {
  return request(`/assessments/${id}`);
}

export async function deleteAssessment(id) {
  return request(`/assessments/${id}`, {
    method: 'DELETE',
  });
}

// --- Dashboard Endpoints ---

export async function getDashboardStats() {
  return request('/dashboard/stats');
}

export async function checkApiHealth() {
  return request('/');
}
