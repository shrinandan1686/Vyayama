from agno.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.models.google import Gemini
import os

# Set a dummy key if not present
if not os.environ.get("GOOGLE_API_KEY"):
    os.environ["GOOGLE_API_KEY"] = "dummy"

agent = Agent(
    model=Gemini(id="gemini-2.5-flash-lite"),
    db=SqliteDb(session_table="agent_sessions", db_file="agent_storage.db"),
    session_id="test_session_final"
)

print("Running agent...")
try:
    # We use a mock call or just pretend to save
    # In Agno, history is stored after a run.
    agent.run("Hello", mock=True) # If mock=True works, otherwise we might need a real run or manually insert
except Exception as e:
    print("Run error (expected if no key):", e)

print("\nForce saving session...")
try:
    agent.storage.upsert_session(agent.get_agent_data())
    print("Session upserted manually")
except Exception as e:
    print("Upsert error:", e)

print("\nTesting get_session_messages():")
try:
    messages = agent.get_session_messages()
    print("Messages type:", type(messages))
    print("Messages count:", len(messages))
    if len(messages) > 0:
        msg = messages[0]
        print("Message dir:", dir(msg))
        print("Message role:", getattr(msg, 'role', 'N/A'))
        print("Message content:", getattr(msg, 'content', 'N/A'))
except Exception as e:
    print("Error calling get_session_messages():", e)
