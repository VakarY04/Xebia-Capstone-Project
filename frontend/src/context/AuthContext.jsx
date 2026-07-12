import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, if we have a token, fetch the current user
  useEffect(() => {
    const token = localStorage.getItem("aifit_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("aifit_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (userData) => {
    localStorage.setItem("aifit_token", userData.token);
    setUser(userData); // set immediately so the UI isn't blank
    try {
      // The signup/login response only has a few fields (id, name, email, token).
      // Fetch the full profile right away so pages like Dashboard/Settings that
      // need age, height, availableDays, etc. have real data without a refresh.
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch {
      // If this fails, the minimal userData set above still keeps the app usable.
    }
  };

  const logout = () => {
    localStorage.removeItem("aifit_token");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
