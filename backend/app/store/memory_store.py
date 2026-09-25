"""
Minimal in-memory session store for the hackathon build.
Swap this module's internals for SQLite/Redis later without touching routers,
as long as get/set signatures stay the same.
"""

_sessions: dict[str, dict] = {}


def get_session(session_id: str) -> dict:
    return _sessions.setdefault(session_id, {})


def set_session(session_id: str, data: dict) -> None:
    _sessions[session_id] = data


def update_session(session_id: str, **kwargs) -> dict:
    session = get_session(session_id)
    session.update(kwargs)
    _sessions[session_id] = session
    return session
