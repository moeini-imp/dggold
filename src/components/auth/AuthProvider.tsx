"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { refreshSession } from "@/lib/auth/api";
import { isTokenExpired, phoneFromToken } from "@/lib/auth/jwt";

/**
 * Auth session. Only the token pair is stored; the phone (username) is read
 * from the JWT. On mount an expired access token is refreshed via the IDP;
 * if that fails the session is cleared.
 */
const STORAGE_KEY = "dg-auth-v1";

interface Session {
  accessToken: string;
  refreshToken: string | null;
}

interface AuthContextValue {
  phone: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setSession: (s: Session) => void;
  logout: () => void;
  refresh: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function load(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const refreshing = useRef(false);

  const persist = useCallback((s: Session | null) => {
    setSessionState(s);
    try {
      if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setSession = useCallback(
    (s: Session) => persist(s),
    [persist],
  );
  const logout = useCallback(() => persist(null), [persist]);

  const refresh = useCallback(async (): Promise<boolean> => {
    const current = load();
    if (!current?.accessToken || !current.refreshToken) return false;
    const username = phoneFromToken(current.accessToken);
    if (!username) return false;
    if (refreshing.current) return false;
    refreshing.current = true;
    try {
      const res = await refreshSession(
        username,
        current.refreshToken,
        current.accessToken,
      );
      const token = res?.data?.accessToken;
      if (res?.success && token) {
        persist({
          accessToken: token,
          refreshToken: res.data?.refreshToken ?? current.refreshToken,
        });
        return true;
      }
      persist(null);
      return false;
    } catch {
      return false;
    } finally {
      refreshing.current = false;
    }
  }, [persist]);

  // hydrate + refresh-if-expired on mount
  useEffect(() => {
    const s = load();
    queueMicrotask(() => {
      setSessionState(s);
      if (s?.accessToken && isTokenExpired(s.accessToken)) {
        refresh().finally(() => setHydrated(true));
      } else {
        setHydrated(true);
      }
    });
  }, [refresh]);

  const value = useMemo<AuthContextValue>(() => {
    const token = session?.accessToken ?? null;
    const valid = !!token && !isTokenExpired(token);
    return {
      phone: token ? phoneFromToken(token) : null,
      accessToken: token,
      isAuthenticated: valid,
      hydrated,
      setSession,
      logout,
      refresh,
    };
  }, [session, hydrated, setSession, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
