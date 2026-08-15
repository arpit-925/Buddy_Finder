import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

/* Lightweight JWT exp check (no verification — we only know the secret server-side).
   A token past its exp is useless; drop it immediately so we never send it. */
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return !payload.exp || Date.now() >= payload.exp * 1000;
  } catch {
    return true; // malformed token → treat as invalid
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // { user, token }
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD AUTH ON APP START
  ========================= */
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (isTokenExpired(parsed.token)) {
          localStorage.removeItem("auth");
        } else {
          setAuth(parsed);
        }
      } catch {
        localStorage.removeItem("auth");
      }
    }
    setLoading(false);
  }, []);

  /* =========================
     REFRESH USER FROM BACKEND
     Keeps the stored profile in sync with the database
     (survives page refresh, re-login, edits from other tabs).
  ========================= */
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) return;
    let cancelled = false;

    (async () => {
      try {
        const { token } = JSON.parse(storedAuth);
        if (!token) return;
        const response = await api.get("/auth/me");
        if (cancelled || !response.data?._id) return;
        setAuth((current) => {
          const next = { ...(current || {}), token, user: response.data };
          localStorage.setItem("auth", JSON.stringify(next));
          return next;
        });
      } catch {
        // Network/backend unavailable — keep the stored user so the UI still works.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================
     LOGIN (used by Login + VerifyEmail)
  ========================= */
  const login = (data) => {
    // data = { user, token }
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  };

  /* =========================
     UPDATE USER
  ========================= */
  const updateUser = (updatedUser) => {
    setAuth((prev) => {
      if (!prev) return prev;

      const newAuth = {
        ...prev,
        user: updatedUser,
      };

      localStorage.setItem("auth", JSON.stringify(newAuth));
      return newAuth;
    });
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user || null,
        token: auth?.token || null,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
