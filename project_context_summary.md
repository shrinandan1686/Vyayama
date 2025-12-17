# Project Context: AI-Personalized Gym Workout App

## Overview
This is a cross-platform mobile application developed using React Native (Expo) that generates personalized workout plans for users based on their profile and goals. It features a premium "Dark Mode" UI with glassmorphism effects.

## Tech Stack
- **Frontend**: React Native, Expo, `@react-navigation/native` (Bottom Tabs & Stack), `expo-linear-gradient`, `expo-blur`.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **AI Service**: Python (FastAPI/Flask placeholder) - *Note: Integration is via backend proxy*.
- **State Management**: React Context (`AuthContext`).

## Architecture
The app follows a client-server architecture:
1.  **Mobile App (Client)**: Handles UI, user input, and navigation. Uses `AuthContext` for global auth state.
2.  **Backend API**: Manages users, workout plans, and exercises. Talks to the Database and the AI Service.
3.  **Database**: MongoDB storing `Users`, `WorkoutPlans`, and `Exercises`.

## Folder Structure
```text
Gym App/
├── app/                      # React Native Frontend
│   ├── components/           # Reusable UI (AppButton, AppInput, GlassCard, ScreenWrapper)
│   ├── constants/            # Theme (COLORS, FONTS), Config
│   ├── context/              # AuthContext (Login/Logout/Token)
│   ├── navigation/           # AppNavigator (Stack), TabsNavigator (Bottom Tabs)
│   ├── screens/              # Login, Register, Home, Onboarding, ExerciseDetail, Profile
│   ├── App.js                # Entry point
│   └── app.json              # Expo Config
│
├── backend/                  # Node.js API
│   ├── config/               # DB Connection
│   ├── middleware/           # Auth Middleware (JWT)
│   ├── models/               # Mongoose Models (User, Exercise, WorkoutPlan)
│   ├── routes/               # API Routes (auth, users, workoutPlans, exercises)
│   └── server.js             # Entry point
│
└── ai-service/               # Python AI Engine
    └── main.py               # Script to generate plans (currently mocked/simple logic)
```

## Key Features & Current State

### 1. Authentication (`/app/screens/LoginScreen.js`, `/RegisterScreen.js`)
- JWT-based authentication.
- Secure storage of tokens.
- Modern dark-themed Login/Register forms with validation.

### 2. Core Navigation (`/app/navigation/`)
- **AppNavigator**: Switches between Auth Stack and Main Tabs based on login state.
- **TabsNavigator**: Custom floating bottom tab bar with blurring effect (Glassmorphism).

### 3. Dashboard (`/app/screens/HomeScreen.js`)
- **Premium UI**: Uses `GlassCard` components with gradients.
- **Visuals**: Displays "Today's Workout" summary, visual tags, and a "Weekly Activity" chart.
- **Logic**: Fetches active workout plan from backend. If none exists, prompts for Onboarding.

### 4. Workout Execution (`/app/screens/ExerciseDetailScreen.js`)
- Displays exercise details (Sets, Reps, Instructions).
- Video placeholder with "Watch Tutorial" UI.
- "Mark as Complete" functionality which updates the backend.

### 5. Onboarding (`/app/screens/OnboardingScreen.js`)
- Collects user stats (Age, Weight, Goal, Experience).
- Updates user profile to ready them for plan generation.

### 6. Design System (`/app/constants/theme.js`)
- **Colors**: Deep dark backgrounds (`#121212`), varied surfaces (`#1E1E1E`), Neon Blue (`#2E6AFF`) primary, Neon Lime secondary.
- **Components**: centralized `GlassCard`, `AppButton` (Gradient), `ScreenWrapper`.

## API Endpoints (Backend)
- `POST /api/auth/register`: Create user.
- `POST /api/auth/login`: Authenticate user.
- `GET /api/users/profile`: Get user stats.
- `PUT /api/users/profile`: Update stats (Onboarding).
- `GET /api/workout-plans`: Fetch current active plan.
- `POST /api/workout-plans/generate`: Trigger AI generation.
- `PUT /api/workout-plans/:id/day/:day/exercise/:exId`: Mark exercise complete.
