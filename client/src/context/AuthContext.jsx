import { useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./authContext";

const getCachedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCachedUser);
  const [isLoading, setIsLoading] = useState(
    () => Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    api.get("/users/profile")
      .then((response) => {
        const profile = response.data.user;
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      })
      .catch((error) => {
        // Keep a cached session available during a temporary API outage, but never
        // retain it if the server says the token is no longer valid.
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = (token, authenticatedUser) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoading(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
