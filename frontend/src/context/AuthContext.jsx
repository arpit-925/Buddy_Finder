import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

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
        setAuth(JSON.parse(storedAuth));
      } catch {
        localStorage.removeItem("auth");
      }
    }
    setLoading(false);
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
