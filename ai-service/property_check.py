from agno.agent import Agent
from agno.models.google import Gemini
from agno.db.sqlite import SqliteDb
import os

agent = Agent(
    model=Gemini(id="gemini-2.5-flash-lite"),
    db=SqliteDb(session_table="agent_sessions", db_file="agent_storage.db")
)

print(f"Agent has 'db': {hasattr(agent, 'db')}")
print(f"Agent has 'storage': {hasattr(agent, 'storage')}")
