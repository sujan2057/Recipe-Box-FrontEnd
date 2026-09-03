import { useState } from "react";
import { loginUser, registerUser } from "../api/auth";
import { AuthContext } from "./AuthContextObject";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("User");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function saveSession(authResponse) {
    localStorage.setItem("token", authResponse.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: authResponse.userId,
        fullName: authResponse.fullName,
        email: authResponse.email,
      }),
    );
    setUser({
      userId: authResponse.useId,
      fullName: authResponse.fullName,
      email: authResponse.email,
    });
  }

  async function register(fullName, email, password) {
    const result = await registerUser(fullName, email, password);
    saveSession(result);
  }

  async function login(email, password) {
    const result = await loginUser(email, password);
    saveSession(result);
  }

  async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
