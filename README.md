# MindPulse — Student Mental Health Predictor

A full-stack web application that uses machine learning to estimate student wellbeing based on social media habits, sleep, study patterns, and stress levels.

---

## Overview

MindPulse provides students with a private, judgment-free space to reflect on their daily rhythms. It uses a trained scikit-learn model to generate a wellbeing estimate across three categories: **Good / Balanced**, **Moderate**, and **Needs Attention**.

The frontend is built with the **Calm Ground** design system — warm, grounded, and emotionally safe.

---

## Features

- Single-step wellbeing assessment (12 input features)
- ML-powered prediction using a pre-trained scikit-learn model
- User authentication (register / login)
- Personal dashboard with score trend chart
- Assessment history with session details
- Crisis support modal with helpline links
- Fully responsive (desktop + mobile)
- Accessible (WCAG AA contrast, keyboard navigation, focus management)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, CSS Variables |
| Backend | FastAPI (Python) |
| ML Model | scikit-learn (`Mental_Health_Model.pkl`) |
| Database | SQLite |
| Auth | JWT (via FastAPI) |

---

## Getting Started

### Backend

```bash
pip install fastapi uvicorn scikit-learn pandas numpy python-jose passlib python-multipart
uvicorn main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:8000`.

---

## Input Features

| Feature | Description |
|---------|-------------|
| `Age` | Student age (10–100) |
| `gender` | `Male` or `Female` |
| `country` | Country of residence |
| `academic_level` | Undergraduate / Graduate / High School / PhD |
| `most_used_platform` | Instagram / TikTok / YouTube / etc. |
| `purpose_of_use` | Entertainment / Education / Communication / etc. |
| `avg_daily_usage_hours` | Average daily social media usage (hours) |
| `daily_unlocks` | Estimated phone unlocks per day |
| `sleep_hours_per_night` | Nightly sleep duration (hours) |
| `physical_activity_hours` | Daily physical activity (hours) |
| `study_hours` | Daily dedicated study time (hours) |
| `stress_level` | Low / Medium / High / Very High |

---

## Output Categories

| Category | Meaning |
|----------|---------|
| Good / Balanced | Habits are generally supportive of wellbeing |
| Moderate | Some areas may benefit from small adjustments |
| Needs Attention | Multiple factors suggest additional support may help |

> **Disclaimer:** MindPulse provides educational estimates only. It is not a clinical diagnostic tool.

---

## Project Structure

```
├── main.py                     # FastAPI backend
├── Mental_Health_Model.pkl     # Trained scikit-learn model
├── src/
│   ├── pages/                  # React page components
│   ├── components/             # Reusable UI components
│   ├── styles/                 # CSS (Calm Ground design tokens)
│   ├── context/                # Auth & Toast context providers
│   └── services/               # API service layer
└── test_suite.py               # Playwright E2E tests
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.
