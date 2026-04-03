import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { storage } from '@/lib/react-native-mmkv';
import { sessionService } from '@/features/session/services';
import type { SessionPayload } from '@/features/session/contracts/session-service.contract';
import { setIncrementQuotesViewed } from '@/features/session/session-tracker';

const PENDING_SESSIONS_KEY = 'pending-sessions';
const CURRENT_SESSION_KEY = 'current-session';
const INACTIVITY_TIMEOUT_MS = 300_000; // 5 minutes

interface CurrentSession {
  startedAt: string;
  quotesViewed: number;
}

function getPendingSessions(): SessionPayload[] {
  const raw = storage.getString(PENDING_SESSIONS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SessionPayload[];
  } catch {
    return [];
  }
}

function setPendingSessions(sessions: SessionPayload[]): void {
  storage.set(PENDING_SESSIONS_KEY, JSON.stringify(sessions));
}

function getCurrentSession(): CurrentSession | null {
  const raw = storage.getString(CURRENT_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CurrentSession;
  } catch {
    return null;
  }
}

function setCurrentSession(session: CurrentSession | null): void {
  if (session === null) {
    storage.remove(CURRENT_SESSION_KEY);
  } else {
    storage.set(CURRENT_SESSION_KEY, JSON.stringify(session));
  }
}

function addPendingSession(session: SessionPayload): void {
  const pending = getPendingSessions();
  pending.push(session);
  // Cap at 500 to prevent unbounded growth
  if (pending.length > 500) pending.splice(0, pending.length - 500);
  setPendingSessions(pending);
}

function addToPending(session: CurrentSession): void {
  const endedAt = new Date().toISOString();

  addPendingSession({
    startedAt: session.startedAt,
    endedAt,
    quotesViewed: session.quotesViewed,
  });
}

async function syncPendingSessions(): Promise<void> {
  const pending = getPendingSessions();
  if (pending.length === 0) return;

  try {
    await sessionService.syncBatch({ sessions: pending });
    setPendingSessions([]);
  } catch {
    // Silently fail — will retry next time
  }
}

export function useSessionTracker() {
  const sessionRef = useRef<CurrentSession | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSession = useCallback(() => {
    const session: CurrentSession = {
      startedAt: new Date().toISOString(),
      quotesViewed: 0,
    };

    sessionRef.current = session;
    setCurrentSession(session);
  }, []);

  const finishSession = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;

    addToPending(session);
    sessionRef.current = null;
    setCurrentSession(null);
  }, []);

  const clearInactivityTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetInactivityTimeout = useCallback(() => {
    clearInactivityTimeout();

    timeoutRef.current = setTimeout(() => {
      finishSession();
      syncPendingSessions();
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearInactivityTimeout, finishSession]);

  const incrementQuotesViewed = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;

    session.quotesViewed += 1;
    sessionRef.current = session;
    setCurrentSession(session);
    resetInactivityTimeout();
  }, [resetInactivityTimeout]);

  // Handle AppState changes
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        clearInactivityTimeout();
        startSession();
        syncPendingSessions();
      } else {
        clearInactivityTimeout();
        finishSession();
        syncPendingSessions();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      clearInactivityTimeout();
    };
  }, [startSession, finishSession, clearInactivityTimeout]);

  // On mount: recover crashed session, sync pending, start new session
  useEffect(() => {
    const crashed = getCurrentSession();

    if (crashed) {
      addToPending(crashed);
      setCurrentSession(null);
    }

    syncPendingSessions();
    startSession();
    resetInactivityTimeout();

    return () => {
      clearInactivityTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIncrementQuotesViewed(incrementQuotesViewed);
  }, [incrementQuotesViewed]);
}
