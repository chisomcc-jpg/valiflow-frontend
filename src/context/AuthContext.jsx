// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const initialized = useRef(false);
  const refreshTimer = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* ───────────────────────────────
     🔁 Load saved token (on startup)
  ─────────────────────────────── */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const savedToken = localStorage.getItem("valiflow_token");

    if (savedToken && savedToken.split(".").length === 3) {
      try {
        const decoded = jwtDecode(savedToken);
        setToken(savedToken);
        setUser(decoded);
        scheduleRefresh(decoded);

        // Fetch fresh profile data (e.g. updated name)
        axios.get(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        }).then(res => {
          if (res.data) {
            setUser(prev => ({
              ...prev,
              ...res.data,
              // Ensure 'name' property exists for UI compatibility
              name: res.data.name || (res.data.firstName && res.data.lastName ? `${res.data.firstName} ${res.data.lastName}` : prev.name)
            }));
          }
        }).catch(err => console.warn("Background profile fetch failed", err));

      } catch (err) {
        console.warn("⚠️ Ogiltig JWT vid init:", err.message);
        localStorage.removeItem("valiflow_token");
      }
    } else {
      localStorage.removeItem("valiflow_token");
    }

    setLoading(false);
  }, []);

  /* ───────────────────────────────
     🔐 Login helper
  ─────────────────────────────── */
  const login = useCallback(async (newToken) => {
    if (!newToken || newToken.split(".").length !== 3) {
      throw new Error("Invalid JWT format on login");
    }

    try {
      const decoded = jwtDecode(newToken);
      localStorage.setItem("valiflow_token", newToken);
      setToken(newToken);
      setUser(decoded);
      setLoading(false);
      scheduleRefresh(decoded);
      return decoded;
    } catch (err) {
      console.error("❌ JWT decode failed:", err);
      throw err;
    }
  }, []);

  /* ───────────────────────────────
     🔄 Update User (Manual Sync)
  ─────────────────────────────── */
  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      // Note: We cannot easily update the JWT token structure without a new token from backend.
      // But we can update the client-side state for immediate UI feedback.
      // Ideally, the backend should return a new token on profile update.
      return newUser;
    });
  }, []);

  /* ───────────────────────────────
     🔓 Logout helper
  ─────────────────────────────── */
  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`);
    } catch (err) {
      console.warn("Backend logout failed (non-critical)", err);
    }
    localStorage.removeItem("valiflow_token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("companyId");
    setToken(null);
    setUser(null);
    setShowWarning(false);
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
  }, [API_URL]);

  /* ───────────────────────────────
     ♻️ Token Refresh Scheduler
  ─────────────────────────────── */
  const scheduleRefresh = useCallback(
    (decoded) => {
      if (!decoded?.exp) return;
      if (refreshTimer.current) clearTimeout(refreshTimer.current);

      const expTime = decoded.exp * 1000;
      const refreshAt = expTime - 60 * 1000; // 1 min innan utgång
      const delay = refreshAt - Date.now();

      if (delay > 0) {
        refreshTimer.current = setTimeout(() => refreshToken(), delay);
        console.log("⏱️ Token refresh scheduled in", Math.round(delay / 1000), "s");
      } else {
        // om token redan nästan gått ut
        refreshToken();
      }
    },
    []
  );

  const refreshToken = useCallback(async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/refresh`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.token) {
        console.log("🔄 Token refreshed successfully");
        await login(res.data.token);
      } else {
        console.warn("⚠️ Ingen token returnerades vid refresh");
        logout();
      }
    } catch (err) {
      console.error("❌ Token refresh failed:", err.response?.data || err.message);
      logout();
    }
  }, [API_URL, token, login, logout]);

  /* ───────────────────────────────
     ⏱️ Auto-logout after inactivity
  ─────────────────────────────── */
  useEffect(() => {
    const INACTIVITY_LIMIT = 15 * 60 * 1000;
    const WARNING_BEFORE = 60 * 1000;
    let logoutTimer, warningTimer, countdownTimer;

    const resetTimers = () => {
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownTimer);
      setShowWarning(false);

      warningTimer = setTimeout(() => {
        setShowWarning(true);
        setCountdown(60);
        countdownTimer = setInterval(() => {
          setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
      }, INACTIVITY_LIMIT - WARNING_BEFORE);

      logoutTimer = setTimeout(() => {
        clearInterval(countdownTimer);
        setShowWarning(false);
        logout();
      }, INACTIVITY_LIMIT);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimers));
    resetTimers();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimers));
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownTimer);
    };
  }, [logout]);

  /* ───────────────────────────────
     📦 Context Value
  ─────────────────────────────── */
  const value = useMemo(
    () => ({ token, user, login, logout, updateUser, loading }),
    [token, user, login, logout, updateUser, loading]
  );

  /* ───────────────────────────────
     💬 Render
  ─────────────────────────────── */
  return (
    <AuthContext.Provider value={value}>
      {children}

      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 max-w-sm text-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Session Timeout
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              Du loggas ut om{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {countdown}s
              </span>{" "}
              om du inte fortsätter använda systemet.
            </p>
            <button
              onClick={() => {
                setShowWarning(false);
                window.dispatchEvent(new Event("mousemove"));
              }}
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Fortsätt vara inloggad
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
