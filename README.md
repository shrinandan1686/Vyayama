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

To run the full application, you need to start all three services in separate terminals.

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Expo Go App (on mobile) or Android/iOS Emulator

### 1. Start the AI Service (Python)
This service handles workout generation and the chat bot.

```bash
cd ai-service
# Create virtual environment (first time only)
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API Key
echo "GEMINI_API_KEY=your_google_api_key" > .env

# Run the server
python main.py
```
*Runs on: `http://localhost:8000`*

### 2. Start the Backend (Node.js)
This serves the API and manages users validation.

```bash
cd backend
# Install dependencies
npm install

# Run the server
npm start
```
*Runs on: `http://localhost:5001`*

### 3. Start the Frontend (Expo)
The mobile application interface.

```bash
cd app
# Install dependencies
npm install

# Start Expo
npx expo start -c
```
*Runs on: `http://localhost:8081`*
*Scan the QR code with your Expo Go app.*

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
