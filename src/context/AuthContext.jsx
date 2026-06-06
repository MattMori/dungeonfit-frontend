import React, { createContext, useContext, useMemo, useState } from "react";
import {
  getStoredUser,
  getToken,
  login as authLogin,
  logout as authLogout,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getStoredUser());

  const isAuthenticated = Boolean(token);

  async function login(credentials) {
    const data = await authLogin(credentials);

    setToken(data.token);
    setUser(data.user || data);

    return data;
  }

  function logout() {
    authLogout();
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      setUser,
      isAuthenticated,
      login,
      logout,
    }),
    [token, user, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa estar dentro de AuthProvider.");
  }

  return context;
}
