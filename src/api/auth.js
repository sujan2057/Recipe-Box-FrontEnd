import apiClient from "./Client";

export async function registerUser(fullName, email, password) {
  const response = await apiClient.post("/api/register", {
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
