# Vyayama (AI Gym App)

**Vyayama** is a next-generation fitness application powered by AI. It provides personalized 30-day workout plans, tracks your progress, and features an intelligent **AI Coach** that remembers your conversation context to guide you on your fitness journey.

![App Screenshot](./app/assets/icon.png)

## 🚀 Features

- **AI-Generated Workout Plans**: Custom 30-day routines based on your goals and fitness level.
- **AI Health Coach**: Chat with a smart assistant that remembers your history (powered by Google Gemini & Agno).
- **Interactive Workouts**: Track exercises, sets, and reps with a beautiful UI.
- **Progress Tracking**: Visualize your calorie burn and workout frequency.
- **Secure Authentication**: User registration and login.

## 🏗️ Tech Stack

The project is built as a **Monorepo** containing three distinct services:

1.  **Frontend (`app`)**:
    *   **Framework**: React Native (Expo)
    *   **Styling**: Custom Design System (Glassmorphism), Linear Gradients
    *   **Navigation**: React Navigation (Stack & Tabs)

2.  **Backend (`backend`)**:
    *   **Runtime**: Node.js
    *   **Framework**: Express.js
    *   **Database**: MongoDB (In-Memory for demo / MongoDB Atlas ready)
    *   **Auth**: JWT (JSON Web Tokens)

3.  **AI Service (`ai-service`)**:
    *   **Runtime**: Python 3.13+
    *   **Framework**: FastAPI
    *   **Agent Library**: Agno (formerly Phidata)
    *   **Model**: Google Gemini 1.5 Flash
    *   **Memory**: Native SQLite Storage (Persistent Context)

---

## 🛠️ Getting Started

Follow these steps to set up and run the full **Vyayama** ecosystem on your local machine.

### 📋 Prerequisites
Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**
- **Expo Go** app (on your iOS/Android mobile device)

---

### 1️⃣ AI Service (Python/FastAPI)
The core AI engine that generates workout plans and handles the smart coach logic.

```bash
cd ai-service

# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment variables
# Create a .env file and add your Google Gemini API Key
echo "GEMINI_API_KEY=your_google_api_key_here" > .env

# 4. Start the AI server
python main.py
```
*   **Default Port**: `8000`
*   **Endpoint**: `http://localhost:8000`

---

### 2️⃣ Backend API (Node.js/Express)
The central API that handles user authentication, data persistence, and exercise metadata.

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Configure environment variables
# Create a .env file with the following:
# PORT=5001
# JWT_SECRET=your_secret_key_here
# MONGODB_URI=mongodb://localhost:27017/gym-app (Optional, uses In-Memory by default)

# 3. Start the server
npm run dev
```
*   **Default Port**: `5001`
*   **Database**: Uses `mongodb-memory-server` by default (no local MongoDB installation required for dev).

---

### 3️⃣ Mobile Application (React Native/Expo)
The front-end user interface designed for a premium mobile experience.

```bash
cd app

# 1. Install dependencies
npm install

# 2. Start Expo
npx expo start -c
```
*   **Running on Device**: Scan the QR code with **Expo Go** (Android) or the **Camera App** (iOS).
*   **Note**: Ensure your mobile device and computer are on the **same Wi-Fi network**.
*   **Connecting to Backend**: The app defaults to `localhost` for simulators. To use a physical device, update the `API_URL` in `app/config.js` to your computer's local IP address.

---

---

## 🧠 AI Memory Architecture

The AI Chat uses **Agno** agents with a persistent **SQLite database**. 
- When a user chats, their `user_id` is passed as the session key.
- The conversation history is stored in `ai-service/agent_storage.db`.
- This ensures the AI remembers user preferences and context across app restarts.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*Verified & Rebranded as Vyayama on Dec 17, 2025.*
