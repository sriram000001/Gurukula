import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'pathway_session';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { sessionId: null, path: null, completedNodes: [] };
  } catch {
    return { sessionId: null, path: null, completedNodes: [] };
  }
}

let state = loadInitial();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (e.g. private mode) — session just won't persist
  }
}

function setState(patch) {
  state = { ...state, ...patch };
  persist();
  listeners.forEach((listener) => listener());
}

export const sessionStore = {
  getState: () => state,
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setSessionId(sessionId) {
    setState({ sessionId });
  },
  setPath(path) {
    setState({ path });
  },
  markNodeComplete(nodeId, completed = true) {
    const completedNodes = completed
      ? [...new Set([...state.completedNodes, nodeId])]
      : state.completedNodes.filter((id) => id !== nodeId);
    setState({ completedNodes });
  },
  reset() {
    setState({ sessionId: null, path: null, completedNodes: [] });
  },
};

export function useSessionStore() {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.getState);
}
