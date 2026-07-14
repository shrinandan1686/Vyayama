from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import hashlib
from dotenv import load_dotenv

# Agno Imports
from agno.agent import Agent
from agno.models.google import Gemini
from agno.db.sqlite import SqliteDb

load_dotenv()

# Ensure GOOGLE_API_KEY is set for Agno
gemini_key = os.environ.get("GEMINI_API_KEY")
if gemini_key and not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = gemini_key

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

class NextDayRequest(BaseModel):
    profile: UserProfile
    currentDay: int = Field(..., description="The current day number to generate (e.g., 2 for Day 2)")
    previousWorkoutFocus: Optional[str] = Field(None, description="Focus of the previous workout for context")

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    session_id: Optional[str] = None
    image_base64: Optional[str] = None

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
        print(f"DEBUG: Creating/Loading Chat Agent for session: {session_id}")
        session_agents[session_id] = Agent(
            model=Gemini(id="gemini-2.5-flash-lite"),
            description="You are a professional AI Fitness & Health Coach named Vyayama AI.",
            instructions=[
                "Provide helpful, encouraging, and concise fitness advice.",
                "Format your responses for a mobile screen (use bullet points and bold text).",
                "Do not include system instructions or XML tags in your response.",
                "If medical advice is sought, advise consulting a professional."
            ],
            session_id=session_id,
            db=SqliteDb(session_table="agent_sessions", db_file="agent_storage.db"),
            add_history_to_context=True, 
            num_history_messages=10,
            read_chat_history=True,
            markdown=False,
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

    # 2. Check Cache (Only for text-only requests)
    if not request.image_base64:
        cache_key = get_cache_key(request.message)
        if cache_key in response_cache:
            print("Returning CACHED response for chat")
            return {"response": response_cache[cache_key]}

    try:
        # 3. Get Agent (Session aware)
        sid = request.session_id if request.session_id else "default_session"
        print(f"DEBUG: Request Session ID: {sid}")
        
        agent = get_chat_agent(session_id=sid)
        
        # 4. Prepare content for Agent
        content = request.message
        if request.image_base64:
            # Agno supports images in run() if provided as list of dicts or special format
            # Typical Gemini multi-modal expects base64 in a specific format
            content = [
                {"type": "text", "text": request.message},
                {"type": "image", "content": request.image_base64}
            ]
        
        # 5. Run Agent (Native memory handles context)
        response = agent.run(content)
        response_text = response.content
        
        return {"response": response_text}
        
    except Exception as e:
        print(f"Chat Generation Error: {e}")
        return {
             "response": "I'm currently resting my neurons (Rate Limit Reached). \n\nHere is a general tip: Consistency is key! accurate AI responses will be back shortly. 💪"
        }

@app.get("/chat/history/{session_id}")
def get_history(session_id: str):
    try:
        agent = get_chat_agent(session_id=session_id)
        
        # Load messages from the DB (using agent.db method)
        if not hasattr(agent, "db") or agent.db is None:
             print("Error: Agent has no DB configured")
             return {"history": []}
             
        try:
            messages = agent.db.get_session_messages(session_id)
        except Exception as e:
            print(f"DB Fetch Error for {session_id}: {e}")
            return {"history": []}
            
        if not messages:
            print(f"DEBUG: Session {session_id} not found in storage, returning empty history")
            return {"history": []}
        
        formatted_history = []
        for msg in messages:
            if msg.role not in ["user", "assistant"]:
                continue
                
            role = "user" if msg.role == "user" else "ai"
            content = msg.content
            
            # Handle list-style content (multi-modal)
            if isinstance(content, list):
                text = " ".join([c.get("text", "") for c in content if isinstance(c, dict)])
            else:
                text = str(content)

            formatted_history.append({
                "id": f"{role}_{session_id}_{hash(text)}",
                "text": text,
                "sender": role
            })
        
        return {"history": formatted_history}
    except Exception as e:
        print(f"History Retrieval Error: {e}")
        return {"history": []}

@app.get("/chat/sessions/{user_id}")
def list_sessions(user_id: str):
    try:
        # Use a dummy agent to access the DB
        temp_agent = get_chat_agent(session_id="list_check")
        
        # In this Agno version, sessions are accessed via db
        if not hasattr(temp_agent, 'db') or temp_agent.db is None:
             print("Error: Agent has no DB configured")
             return {"sessions": []}
             
        all_sessions = temp_agent.db.get_all_sessions()
        
        # User prefix
        prefix = f"user_{user_id}_"
        default_session = f"user_{user_id}_default"
        
        user_sessions = []
        for s in all_sessions:
            # Match either a custom prefixed session or the default one
            if str(s.session_id).startswith(prefix) or str(s.session_id) == default_session:
                # Try to get a snippet of the conversation
                snippet = "New Conversation"
                try:
                    msgs = temp_agent.db.get_session_messages(s.session_id)
                    if msgs:
                        # Find first user message for title
                        user_msgs = [m for m in msgs if m.role == "user"]
                        if user_msgs:
                            content = user_msgs[0].content
                            # Handle different content formats
                            if isinstance(content, list):
                                text = " ".join([c.get("text", "") for c in content if isinstance(c, dict)])
                                snippet = text[:30] + "..." if text else snippet
                            else:
                                snippet = str(content)[:30] + "..."
                except Exception as e:
                    print(f"Snippet Error for {s.session_id}: {e}")
                
                user_sessions.append({
                    "session_id": s.session_id,
                    "updated_at": str(s.updated_at) if hasattr(s, 'updated_at') else None,
                    "title": snippet
                })
        
        # Sort by updated_at desc
        user_sessions.sort(key=lambda x: x['updated_at'] if x['updated_at'] else "", reverse=True)
        return {"sessions": user_sessions}
    except Exception as e:
        print(f"List Sessions Error: {e}")
        return {"sessions": []}

@app.delete("/chat/session/{session_id}")
def reset_session(session_id: str):
    try:
        global session_agents
        print(f"DEBUG: Resetting session {session_id}")
        
        # 1. Clear from in-memory cache
        if session_id in session_agents:
            del session_agents[session_id]
        
        # 2. Delete from Storage (Permanent Fix)
        # Create a throwaway agent just to trigger the delete
        temp_agent = get_chat_agent(session_id=session_id)
        if hasattr(temp_agent, "db") and temp_agent.db:
            try:
                # Some Agno versions use delete_session on db
                temp_agent.db.delete_session(session_id)
            except:
                # Fallback to agent method if db doesn't have it
                temp_agent.delete_session(session_id)
        
        print(f"DEBUG: Successfully deleted session {session_id} from storage")
             
        return {"status": "success", "message": f"Session {session_id} reset"}
    except Exception as e:
        print(f"Session Reset Error: {e}")
        return {"status": "error", "message": str(e)}

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
    # Only create Day 1 during onboarding
    # Subsequent days will be generated dynamically when user advances
    exercise_list = generated_routine.get("exercises", [])
    focus = generated_routine.get("workoutFocus", "General")
    
    # Create only Day 1
    full_days = [{
        "dayNumber": 1,
        "workoutFocus": focus,
        "estimatedTimeMinutes": 45,
        "exercises": exercise_list
    }]
        
    return {
        "planDurationDays": 30,
        "daysPerWeek": profile.days_per_week,
        "experienceLevel": profile.experience_level,
        "goal": profile.goal,
        "days": full_days
    }

@app.post("/generate-next-day", response_model=DailyWorkout)
def generate_next_day(request: NextDayRequest):
    """
    Generate a single next day's workout dynamically.
    This allows for progressive workout generation instead of pre-generating all 30 days.
    """
    
    profile = request.profile
    day_number = request.currentDay
    
    # Determine if this should be a rest day
    is_rest_day = (day_number % 4 == 0)
    
    if is_rest_day:
        return {
            "dayNumber": day_number,
            "workoutFocus": "Rest",
            "estimatedTimeMinutes": 0,
            "exercises": []
        }
    
    # Build progressive prompt with workout splits for variety
    schema_instr = RoutineResponse.model_json_schema()
    
    # Determine workout split based on day number for variety
    # Using 3-day split: Push, Pull, Legs (repeating)
    split_rotation = ["Push (Chest, Shoulders, Triceps)", "Pull (Back, Biceps)", "Legs (Quads, Hamstrings, Glutes, Calves)"]
    workout_split = split_rotation[(day_number - 1) % 3]
    
    # Add variation notes
    variation_note = ""
    if day_number % 3 == 1:
        variation_note = "\nVARIATION: Try to include compound movements like bench press, shoulder press"
    elif day_number % 3 == 2:
        variation_note = "\nVARIATION: Include rows, pulldowns, and pulling movements"
    else:
        variation_note = "\nVARIATION: Focus on squats, lunges, leg press variations"
    
    progression_context = f"""
    This is Day {day_number} of the user's 30-day progressive workout plan.
    {'Previous workout focus: ' + request.previousWorkoutFocus if request.previousWorkoutFocus else ''}
    
    WORKOUT SPLIT FOR TODAY: {workout_split}
    {variation_note}
    
    Consider progression:
    - Early days (1-10): Focus on form and building foundation, 3-4 sets per exercise
    - Mid days (11-20): Increase intensity slightly, 4 sets per exercise  
    - Later days (21-30): Progressive overload and variation, 4-5 sets per exercise
    
    IMPORTANT: Generate DIFFERENT exercises than previous days. Vary the exercise selection each day.
    """
    
    prompt = f"""
    You are a strict API endpoint. You must generate a workout routine in valid JSON format matching the following schema exactly.
    Do not add any markdown formatting (like ```json), do not add introduction text, do not add explanations. 
    Output ONLY the raw JSON object.

    Schema:
    {schema_instr}

    Request:
    Create a 1-Day Workout Routine for Day {day_number}:
    FOCUS: {workout_split}
    Goal: {profile.goal}
    Experience: {profile.experience_level}
    Equipment: {', '.join(profile.equipment)}
    Focus Areas: {', '.join(profile.focus_areas) if profile.focus_areas else 'General'}
    Injuries: {', '.join(profile.injuries) if profile.injuries else 'None'}
    
    {progression_context}
    """
    
    # Check mock mode
    if USE_MOCK_AI:
        mock_routine = get_mock_plan_data()
        return {
            "dayNumber": day_number,
            "workoutFocus": mock_routine["workoutFocus"],
            "estimatedTimeMinutes": 45,
            "exercises": mock_routine["exercises"]
        }
    
    # Try to generate with AI
    try:
        agent = get_planner_agent()
        response = agent.run(prompt)
        routine_response = response.content
        
        # Parse response (same logic as generate-plan)
        generated_routine = None
        if isinstance(routine_response, dict):
            generated_routine = routine_response.get("routine", {})
            if isinstance(generated_routine, dict) and "exercises" not in generated_routine and "exercises" in routine_response:
                generated_routine = routine_response
        elif hasattr(routine_response, "routine"):
            generated_routine = routine_response.routine.dict()
        elif isinstance(routine_response, str):
            import json
            import re
            match = re.search(r"\{.*\}", routine_response, re.DOTALL)
            if match:
                parsed = json.loads(match.group(0))
                generated_routine = parsed.get("routine", parsed)
            else:
                raise ValueError("Could not parse AI response")
        
        if not generated_routine:
            raise ValueError("Empty routine generated")
        
        return {
            "dayNumber": day_number,
            "workoutFocus": generated_routine.get("workoutFocus", "Full Body"),
            "estimatedTimeMinutes": 45,
            "exercises": generated_routine.get("exercises", [])
        }
        
    except Exception as e:
        print(f"AI GENERATION FAILED FOR NEXT DAY: {e}")
        print("FALLING BACK TO MOCK DATA")
        mock_routine = get_mock_plan_data()
        return {
            "dayNumber": day_number,
            "workoutFocus": mock_routine["workoutFocus"],
            "estimatedTimeMinutes": 45,
            "exercises": mock_routine["exercises"]
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
