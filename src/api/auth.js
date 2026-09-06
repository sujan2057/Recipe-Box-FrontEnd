import apiClient from "./client";

export async function registerUser(fullName, email, password) {
  const response = await apiClient.post("/auth/register", {
    fullName,
    email,
    password,
  });
  return response.data;
}

export async function loginUser(email, password) {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });
  return response.data;
}
