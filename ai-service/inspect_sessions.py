from agno.agent import Agent
from agno.db.sqlite import SqliteDb
import os
import inspect

db = SqliteDb(session_table="agent_sessions", db_file="agent_storage.db")
agent = Agent(db=db)

print("DB methods:", dir(agent.db))
try:
    # Most Agno DBs have get_all_session_ids or similar
    # Let's try to find a session listing method
    methods = [m for m in dir(agent.db) if 'session' in m.lower()]
    print("Session related methods in DB:", methods)
    
    # Try calling get_all_sessions if it exists
    if hasattr(agent.db, 'get_all_sessions'):
        sessions = agent.db.get_all_sessions()
        print("Sessions from db.get_all_sessions():", sessions)
except Exception as e:
    print("Error inspecting DB:", e)

print("\nAgent delete_session signature:")
try:
    print(inspect.signature(agent.delete_session))
except Exception as e:
    print("Error inspect signature:", e)
