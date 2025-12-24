import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // { user, token }
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER ON APP START
  ========================= */
  useEffect(() => {
    const storedAuth = localStorage.getItem("user");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setLoading(false);
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = (data) => {
    // data = { user, token }
    localStorage.setItem("user", JSON.stringify(data));
    setAuth(data);
  };

  /* =========================
     UPDATE USER (PROFILE EDIT)
  ========================= */
  const updateUser = (updatedUser) => {
    setAuth((prev) => {
      const newAuth = {
        ...prev,
        user: updatedUser,
      };
      localStorage.setItem("user", JSON.stringify(newAuth));
      return newAuth;
    });
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    setAuth(null);
    localStorage.removeItem("user");
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
