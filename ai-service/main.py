from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import hashlib
from dotenv import load_dotenv

# Agno Imports
from agno.agent import Agent
from agno.agent import Agent
from agno.models.google import Gemini
from agno.db.sqlite import SqliteDb

load_dotenv()

# Ensure GOOGLE_API_KEY is set for Agno
if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.environ.get("GEMINI_API_KEY")

app = FastAPI()

# --- Configuration & Caching ---
# Simple in-memory cache
response_cache = {}

def get_cache_key(prompt: str) -> str:
    return hashlib.md5(prompt.encode()).hexdigest()

# Mock Mode Check
USE_MOCK_AI = os.environ.get("USE_MOCK_AI", "false").lower() == "true"

# --- Models ---
class UserProfile(BaseModel):
    age: int
    gender: Optional[str] = None
    weight: float
    height: float
    goal: str
    experience_level: str
    gym_comfort: Optional[str] = None
    gym_confidence: Optional[str] = None
    body_type: Optional[str] = None
    focus_areas: List[str] = []
    days_per_week: int
    average_workout_duration: Optional[int] = 60
    equipment: List[str] = []
    gym_crowd_level: Optional[str] = None
    injuries: List[str] = []

class Exercise(BaseModel):
    name: str = Field(..., description="Name of the exercise")
    primaryMuscle: str = Field(..., description="Primary muscle group targeted")
    secondaryMuscles: List[str] = Field(default=[], description="Secondary muscles targeted")
    sets: int = Field(..., description="Number of sets")
    reps: str = Field(..., description="Rep range, e.g. '10-12'")
    restSeconds: int = Field(..., description="Rest time in seconds")
    equipment: List[str] = Field(..., description="Equipment needed")
    instructions: List[str] = Field(..., description="Short instructions")
    youtubeUrl: str = Field(..., description="YouTube search URL for the exercise")
    alternatives: List[dict] = []

class DailyWorkout(BaseModel):
    dayNumber: int
    workoutFocus: str
    estimatedTimeMinutes: int
    exercises: List[Exercise]

class Routine(BaseModel):
    workoutFocus: str = Field(..., description="Main focus of the workout, e.g. 'Full Body', 'Push', 'Pull'")
    exercises: List[Exercise]

class RoutineResponse(BaseModel):
    routine: Routine

class WorkoutPlan(BaseModel):
    planDurationDays: int
    daysPerWeek: int
    experienceLevel: str
    goal: str
    days: List[DailyWorkout]

class ChatRequest(BaseModel):
    message: str
    message: str
    context: Optional[str] = None
    session_id: Optional[str] = None

# --- Helpers ---
def get_mock_plan_data():
    """Returns the fallback mock data."""
    return {
        "workoutFocus": "Full Body (AI Offline)",
        "exercises": [
            {
                "name": "Bodyweight Squat",
                "primaryMuscle": "Legs",
                "sets": 3,
                "reps": "15",
                "restSeconds": 45,
                "equipment": ["Bodyweight"],
                "instructions": ["Stand shoulder width", "Lower hips"],
                "youtubeUrl": "https://www.youtube.com/results?search_query=bodyweight+squat",
                "alternatives": [] 
            },
            {
                "name": "Push Up",
                "primaryMuscle": "Chest",
                "sets": 3,
                "reps": "10-12",
                "restSeconds": 45,
                "equipment": ["Bodyweight"],
                "instructions": ["Keep core tight", "Press up"],
                "youtubeUrl": "https://www.youtube.com/results?search_query=push+up",
                "alternatives": [] 
            },
            {
                "name": "Burpees",
                "primaryMuscle": "Full Body",
                "sets": 3,
                "reps": "8",
                "restSeconds": 60,
                "equipment": ["Bodyweight"],
                "instructions": ["Drop to floor", "Jump up"],
                "youtubeUrl": "https://www.youtube.com/results?search_query=burpees",
                "alternatives": [] 
            }
        ]
    }

# --- Agents (Lazy Initialization) ---

# Global Agent Instances
_chat_agent = None
_planner_agent = None

# --- Agents (Lazy Initialization & Session Management) ---
# --- Agents (Lazy Initialization & Session Management) ---
session_agents = {}
# Manual history removed - using SqliteDb

def get_chat_agent(session_id: str = "default"):
    global session_agents
    
    if session_id not in session_agents:
        # Create a new agent for this session
        print(f"Creating new Chat Agent for session: {session_id}")
        session_agents[session_id] = Agent(
            model=Gemini(id="gemini-2.5-flash-lite"),
            description="You are a helpful, encouraging, and knowledgeable AI Fitness & Health Coach.",
            instructions=[
                "Keep answers concise and easy to read on a mobile screen.",
                "Be encouraging and positive.",
                "If the user asks for medical advice, gently remind them to consult a doctor.",
                "Use emojis sparingly to make the conversation friendly."
            ],
            session_id=session_id,
            db=SqliteDb(session_table="agent_sessions", db_file="agent_storage.db"),
            read_chat_history=True,
            add_history_to_context=True, 
            num_history_messages=10,
            markdown=False,
            # debug_mode=True
        )
    return session_agents[session_id]

def get_planner_agent():
    global _planner_agent
    if _planner_agent is None:
        _planner_agent = Agent(
            model=Gemini(id="gemini-2.5-flash-lite"),
            description="You are an expert fitness planner.",
            instructions=[
                "Create a workout routine based on the user's profile.",
                "Ensure exercises match the user's available equipment and experience level.",
                "Provide youtube search URLs for each exercise.",
            ],
        )
    return _planner_agent

# --- Routes ---

@app.get("/")
def read_root():
    return {"message": f"Advanced Gym AI Service (Agno Powered) is running. Mock Mode: {USE_MOCK_AI}"}

@app.post("/chat")
def chat_with_ai(request: ChatRequest):
    # 1. HARD KILL SWITCH: Check Mock Mode FIRST
    if USE_MOCK_AI:
         return {"response": "I'm currently in MOCK MODE (Zero Cost)."}

    # 2. Check Cache
    cache_key = get_cache_key(request.message)
    if cache_key in response_cache:
        print("Returning CACHED response for chat")
        return {"response": response_cache[cache_key]}

    try:
        # 3. Get Agent (Session aware)
        sid = request.session_id if request.session_id else "default_session"
        print(f"DEBUG: Request Session ID: {sid}")
        
        agent = get_chat_agent(session_id=sid)
        
        # 4. Run Agent (Native memory handles context)
        response = agent.run(request.message)
        response_text = response.content
        
        return {"response": response_text}
        
    except Exception as e:
        print(f"Chat Generation Error: {e}")
        return {
             "response": "I'm currently resting my neurons (Rate Limit Reached). \n\nHere is a general tip: Consistency is key! accurate AI responses will be back shortly. 💪"
        }

@app.post("/generate-plan", response_model=WorkoutPlan)
def generate_plan(profile: UserProfile):
    
    # Construct a strict JSON prompt
    schema_instr = RoutineResponse.model_json_schema()
    
    prompt = f"""
    You are a strict API endpoint. You must generate a workout routine in valid JSON format matching the following schema exactly.
    Do not add any markdown formatting (like ```json), do not add introduction text, do not add explanations. 
    Output ONLY the raw JSON object.

    Schema:
    {schema_instr}

    Request:
    Create a 1-Day Workout Routine for:
    Goal: {profile.goal}
    Experience: {profile.experience_level}
    Equipment: {', '.join(profile.equipment)}
    Focus Areas: {', '.join(profile.focus_areas) if profile.focus_areas else 'General'}
    Injuries: {', '.join(profile.injuries) if profile.injuries else 'None'}
    """

    # 1. HARD KILL SWITCH for Plan Generation
    if USE_MOCK_AI:
        return hydrate_plan(get_mock_plan_data(), profile)

    cache_key = get_cache_key(prompt)

    generated_routine = None

    if cache_key in response_cache:
        print("Returning CACHED plan")
        generated_routine = response_cache[cache_key]
    else:
        try:
            # Run agent WITHOUT response_model in the call to avoid conflict, 
            # since we are prompting for JSON manually now.
            agent = get_planner_agent()
            response = agent.run(prompt)
            
            # Agno validates and returns the Pydantic object
            routine_response = response.content
            
            print(f"DEBUG: RESPONSE TYPE: {type(routine_response)}")
            print(f"DEBUG: RESPONSE CONTENT: {routine_response}")

            # Robust check: It might be a dict or a Pydantic object OR a raw string
            if isinstance(routine_response, dict):
                 generated_routine = routine_response.get("routine", {})
                 # If routine is just the inner dict (partial nesting)
                 if isinstance(generated_routine, dict) and "exercises" not in generated_routine and "exercises" in routine_response:
                     generated_routine = routine_response
            elif hasattr(routine_response, "routine"):
                 generated_routine = routine_response.routine.dict()
            elif isinstance(routine_response, str):
                 # Fallback: Parse string manually
                 try:
                     import json
                     import re
                     
                     # 1. Try to find JSON block with regex
                     match = re.search(r"\{.*\}", routine_response, re.DOTALL)
                     if match:
                         clean_text = match.group(0)
                         parsed = json.loads(clean_text)
                         generated_routine = parsed.get("routine", parsed)
                     else:
                         # 2. Try cleaning markdown manually if regex failed
                         clean_text = routine_response.strip()
                         if clean_text.startswith("```json"):
                             clean_text = clean_text[7:]
                         if clean_text.endswith("```"):
                             clean_text = clean_text[:-3]
                         parsed = json.loads(clean_text)
                         generated_routine = parsed.get("routine", parsed)

                 except (json.JSONDecodeError, AttributeError, ValueError) as e:
                     print(f"FAILED TO PARSE JSON STRING: {routine_response[:100]}...\nError: {e}")
                     raise ValueError("Could not parse AI response as JSON")
            else:
                 # Fallback if structure is unexpected
                 raise ValueError(f"Unexpected response structure: {type(routine_response)}")
            
            response_cache[cache_key] = generated_routine
            print("SUCCESS: Generated Real AI Plan via response_model")
                
        except Exception as e:
            print(f"AI GENERATION FAILED: {e}")
            print("FALLING BACK TO MOCK DATA")
            generated_routine = get_mock_plan_data()

    return hydrate_plan(generated_routine, profile)

def hydrate_plan(generated_routine, profile):
    # Hydrate 30-Day Plan
    full_days = []
    exercise_list = generated_routine.get("exercises", [])
    focus = generated_routine.get("workoutFocus", "General")
    
    for i in range(1, 31):
        is_rest = (i % 4 == 0)
        full_days.append({
            "dayNumber": i,
            "workoutFocus": "Rest" if is_rest else focus,
            "estimatedTimeMinutes": 0 if is_rest else 45,
            "exercises": [] if is_rest else exercise_list
        })
        
    return {
        "planDurationDays": 30,
        "daysPerWeek": profile.days_per_week,
        "experienceLevel": profile.experience_level,
        "goal": profile.goal,
        "days": full_days
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
