import os
import sqlite3
import datetime
import uuid
import joblib
import pandas as pd
from typing import Literal, Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Depends, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "mental-health-predictor-secret-key-2026-secure-jwt")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 30
DB_FILE = os.getenv("SQLITE_DB", "mental_health.db")

# Password Hasher
ph = PasswordHasher()

# Load Machine Learning Model
model = joblib.load('Mental_Health_Model.pkl')

app = FastAPI(
    title="Mental Health Score Predictor API",
    description="ML-powered mental health assessment and wellness tracking API",
    version="1.0.0"
)

# CORS configuration
#
# Origins are env-driven so production does not have to ship a wildcard. The
# default covers local dev; in production set ALLOWED_ORIGINS to a comma
# separated list, e.g. ALLOWED_ORIGINS=https://mindpulse.vercel.app
#
# Note: "*" is intentionally NOT used here. allow_credentials=True combined
# with a wildcard origin is rejected by browsers, and Starlette's fallback
# (echoing whatever Origin the caller sent) would let any site call the API.
DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

_configured_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]
# Fall back to the local-dev defaults when the variable is unset *or* blank,
# so an empty value cannot silently block every browser request.
ALLOWED_ORIGINS = _configured_origins or [
    origin.strip() for origin in DEFAULT_ALLOWED_ORIGINS.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Initialization (SQLite)
def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS assessments (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            country TEXT NOT NULL,
            academic_level TEXT NOT NULL,
            most_used_platform TEXT NOT NULL,
            purpose_of_use TEXT NOT NULL,
            avg_daily_usage_hours REAL NOT NULL,
            daily_unlocks INTEGER NOT NULL,
            study_hours REAL NOT NULL,
            physical_activity_hours REAL NOT NULL,
            sleep_hours_per_night REAL NOT NULL,
            stress_level TEXT NOT NULL,
            predicted_score REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)
    conn.commit()
    conn.close()

init_db()

# --- Pydantic Schemas ---

class StudentData(BaseModel):
    Age: int = Field(..., ge=10, le=100)
    gender: Literal['Male', 'Female']
    country: str
    academic_level: Literal['Undergraduate', 'Graduate', 'High School']
    most_used_platform: Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter', 'Youtube', 'TikTok', 'LINE', 'KakaoTalk', 'Whatsapp', 'WeChat']
    purpose_of_use: Literal['Networking', 'Education', 'Entertainment', 'News']
    avg_daily_usage_hours: float = Field(..., ge=0, le=24)
    daily_unlocks: int = Field(..., ge=0)
    study_hours: float = Field(..., ge=0, le=24)
    physical_activity_hours: float = Field(..., ge=0, le=24)
    sleep_hours_per_night: float = Field(..., ge=0, le=24)
    stress_level: Literal['Medium', 'Low', 'Very High', 'High']

class PredictionResponse(BaseModel):
    predicted_mental_health_score: float
    assessment_id: Optional[str] = None
    category: Optional[str] = None
    created_at: Optional[str] = None

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    created_at: str
    total_assessments: Optional[int] = 0

class AuthResponse(BaseModel):
    token: str
    user: UserProfile

class UpdateProfileRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)

class AssessmentRecord(BaseModel):
    id: str
    user_id: Optional[str] = None
    age: int
    gender: str
    country: str
    academic_level: str
    most_used_platform: str
    purpose_of_use: str
    avg_daily_usage_hours: float
    daily_unlocks: int
    study_hours: float
    physical_activity_hours: float
    sleep_hours_per_night: float
    stress_level: str
    predicted_score: float
    created_at: str
    category: str

class DashboardStats(BaseModel):
    total_assessments: int
    latest_score: Optional[float] = None
    average_score: Optional[float] = None
    last_assessment_date: Optional[str] = None
    score_trend: List[Dict[str, Any]] = []
    recent_assessments: List[AssessmentRecord] = []

# --- Helper Functions ---

top_countries = ['Other', 'India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Mexico', 'Turkey', 'France']

def classify_score(score: float) -> str:
    # Based on the dataset score distribution (mean ~6.23, range ~3.6 to 9.4)
    if score >= 7.5:
        return "Good / Balanced"
    elif score >= 5.8:
        return "Moderate"
    else:
        return "Needs Attention"

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=JWT_EXPIRATION_DAYS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user_optional(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {"id": row["id"], "name": row["name"], "email": row["email"], "created_at": row["created_at"]}
        return None
    except Exception:
        return None

def get_current_user_required(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    user = get_current_user_optional(authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing or invalid"
        )
    return user

# --- Routes ---

@app.get('/')
def greet():
    return {
        "status": "online",
        "message": "Welcome to Mental Health Score Predictor API",
        "version": "1.0.0"
    }

# Main prediction endpoint (supports unauthenticated & authenticated with history logging)
@app.post('/predict', response_model=PredictionResponse)
def predict(data: StudentData, authorization: Optional[str] = Header(None)):
    country_group = data.country if data.country in top_countries else 'Other'
    input_row = pd.DataFrame([{
        'Age': data.Age,
        'Gender': data.gender,
        'Country': data.country,
        'Academic_Level': data.academic_level,
        'Most_Used_Platform': data.most_used_platform,
        'Purpose_Of_Use': data.purpose_of_use,
        'Avg_Daily_Usage_Hours': data.avg_daily_usage_hours,
        'Daily_Unlocks': data.daily_unlocks,
        'Study_Hours': data.study_hours,
        'Physical_Activity_Hours': data.physical_activity_hours,
        'Sleep_Hours_Per_Night': data.sleep_hours_per_night,
        'Stress_Level': data.stress_level,
        'Grouped_country': country_group
    }])

    prediction = model.predict(input_row)[0]
    score = round(float(prediction), 2)
    category = classify_score(score)

    assessment_id = str(uuid.uuid4())
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

    # Save to history if user is logged in
    user = get_current_user_optional(authorization)
    if user:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO assessments (
                id, user_id, age, gender, country, academic_level, most_used_platform,
                purpose_of_use, avg_daily_usage_hours, daily_unlocks, study_hours,
                physical_activity_hours, sleep_hours_per_night, stress_level,
                predicted_score, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            assessment_id, user["id"], data.Age, data.gender, data.country,
            data.academic_level, data.most_used_platform, data.purpose_of_use,
            data.avg_daily_usage_hours, data.daily_unlocks, data.study_hours,
            data.physical_activity_hours, data.sleep_hours_per_night, data.stress_level,
            score, now_str
        ))
        conn.commit()
        conn.close()

    return PredictionResponse(
        predicted_mental_health_score=score,
        assessment_id=assessment_id,
        category=category,
        created_at=now_str
    )

# --- Authentication Endpoints ---

@app.post('/auth/register', response_model=AuthResponse)
@app.post('/api/auth/register', response_model=AuthResponse)
def register(req: RegisterRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (req.email.lower(),))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    password_hash = ph.hash(req.password)
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()

    cursor.execute(
        "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
        (user_id, req.name.strip(), req.email.lower(), password_hash, now_str)
    )
    conn.commit()
    conn.close()

    token = create_access_token(user_id, req.email.lower())
    return AuthResponse(
        token=token,
        user=UserProfile(
            id=user_id,
            name=req.name.strip(),
            email=req.email.lower(),
            created_at=now_str,
            total_assessments=0
        )
    )

@app.post('/auth/login', response_model=AuthResponse)
@app.post('/api/auth/login', response_model=AuthResponse)
def login(req: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?", (req.email.lower(),))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    try:
        ph.verify(row["password_hash"], req.password)
    except VerifyMismatchError:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    # Count assessments
    cursor.execute("SELECT COUNT(*) as count FROM assessments WHERE user_id = ?", (row["id"],))
    count_row = cursor.fetchone()
    total_assessments = count_row["count"] if count_row else 0
    conn.close()

    token = create_access_token(row["id"], row["email"])
    return AuthResponse(
        token=token,
        user=UserProfile(
            id=row["id"],
            name=row["name"],
            email=row["email"],
            created_at=row["created_at"],
            total_assessments=total_assessments
        )
    )

@app.get('/auth/me', response_model=UserProfile)
@app.get('/api/auth/me', response_model=UserProfile)
def get_me(user: Dict[str, Any] = Depends(get_current_user_required)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as count FROM assessments WHERE user_id = ?", (user["id"],))
    count_row = cursor.fetchone()
    total = count_row["count"] if count_row else 0
    conn.close()
    return UserProfile(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        created_at=user["created_at"],
        total_assessments=total
    )

@app.put('/auth/profile', response_model=UserProfile)
@app.put('/api/auth/profile', response_model=UserProfile)
def update_profile(req: UpdateProfileRequest, user: Dict[str, Any] = Depends(get_current_user_required)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET name = ? WHERE id = ?", (req.name.strip(), user["id"]))
    conn.commit()
    cursor.execute("SELECT COUNT(*) as count FROM assessments WHERE user_id = ?", (user["id"],))
    count_row = cursor.fetchone()
    total = count_row["count"] if count_row else 0
    conn.close()
    return UserProfile(
        id=user["id"],
        name=req.name.strip(),
        email=user["email"],
        created_at=user["created_at"],
        total_assessments=total
    )

# --- Assessment History Endpoints ---

@app.get('/assessments/history', response_model=List[AssessmentRecord])
@app.get('/api/assessments/history', response_model=List[AssessmentRecord])
def get_history(user: Dict[str, Any] = Depends(get_current_user_required)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC
    """, (user["id"],))
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append(AssessmentRecord(
            id=r["id"],
            user_id=r["user_id"],
            age=r["age"],
            gender=r["gender"],
            country=r["country"],
            academic_level=r["academic_level"],
            most_used_platform=r["most_used_platform"],
            purpose_of_use=r["purpose_of_use"],
            avg_daily_usage_hours=r["avg_daily_usage_hours"],
            daily_unlocks=r["daily_unlocks"],
            study_hours=r["study_hours"],
            physical_activity_hours=r["physical_activity_hours"],
            sleep_hours_per_night=r["sleep_hours_per_night"],
            stress_level=r["stress_level"],
            predicted_score=r["predicted_score"],
            created_at=r["created_at"],
            category=classify_score(r["predicted_score"])
        ))
    return results

@app.get('/assessments/{assessment_id}', response_model=AssessmentRecord)
@app.get('/api/assessments/{assessment_id}', response_model=AssessmentRecord)
def get_assessment(assessment_id: str, user: Dict[str, Any] = Depends(get_current_user_required)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assessments WHERE id = ? AND user_id = ?", (assessment_id, user["id"]))
    r = cursor.fetchone()
    conn.close()
    if not r:
        raise HTTPException(status_code=404, detail="Assessment record not found")

    return AssessmentRecord(
        id=r["id"],
        user_id=r["user_id"],
        age=r["age"],
        gender=r["gender"],
        country=r["country"],
        academic_level=r["academic_level"],
        most_used_platform=r["most_used_platform"],
        purpose_of_use=r["purpose_of_use"],
        avg_daily_usage_hours=r["avg_daily_usage_hours"],
        daily_unlocks=r["daily_unlocks"],
        study_hours=r["study_hours"],
        physical_activity_hours=r["physical_activity_hours"],
        sleep_hours_per_night=r["sleep_hours_per_night"],
        stress_level=r["stress_level"],
        predicted_score=r["predicted_score"],
        created_at=r["created_at"],
        category=classify_score(r["predicted_score"])
    )

@app.delete('/assessments/{assessment_id}')
@app.delete('/api/assessments/{assessment_id}')
def delete_assessment(assessment_id: str, user: Dict[str, Any] = Depends(get_current_user_required)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM assessments WHERE id = ? AND user_id = ?", (assessment_id, user["id"]))
    conn.commit()
    conn.close()
    return {"message": "Assessment deleted successfully"}

# --- Dashboard Stats Endpoint ---

@app.get('/dashboard/stats', response_model=DashboardStats)
@app.get('/api/dashboard/stats', response_model=DashboardStats)
def get_dashboard_stats(user: Dict[str, Any] = Depends(get_current_user_required)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at ASC
    """, (user["id"],))
    rows = cursor.fetchall()
    conn.close()

    total = len(rows)
    if total == 0:
        return DashboardStats(
            total_assessments=0,
            latest_score=None,
            average_score=None,
            last_assessment_date=None,
            score_trend=[],
            recent_assessments=[]
        )

    scores = [r["predicted_score"] for r in rows]
    latest_score = scores[-1]
    average_score = round(sum(scores) / total, 2)
    last_assessment_date = rows[-1]["created_at"]

    score_trend = [
        {
            "id": r["id"],
            "date": r["created_at"],
            "score": r["predicted_score"],
            "category": classify_score(r["predicted_score"])
        }
        for r in rows
    ]

    # Recent assessments in reverse chronological order (max 5)
    recent = []
    for r in reversed(rows[-5:]):
        recent.append(AssessmentRecord(
            id=r["id"],
            user_id=r["user_id"],
            age=r["age"],
            gender=r["gender"],
            country=r["country"],
            academic_level=r["academic_level"],
            most_used_platform=r["most_used_platform"],
            purpose_of_use=r["purpose_of_use"],
            avg_daily_usage_hours=r["avg_daily_usage_hours"],
            daily_unlocks=r["daily_unlocks"],
            study_hours=r["study_hours"],
            physical_activity_hours=r["physical_activity_hours"],
            sleep_hours_per_night=r["sleep_hours_per_night"],
            stress_level=r["stress_level"],
            predicted_score=r["predicted_score"],
            created_at=r["created_at"],
            category=classify_score(r["predicted_score"])
        ))

    return DashboardStats(
        total_assessments=total,
        latest_score=latest_score,
        average_score=average_score,
        last_assessment_date=last_assessment_date,
        score_trend=score_trend,
        recent_assessments=recent
    )
