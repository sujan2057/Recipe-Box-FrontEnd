import apiClient from "./client";

export async function getMyRecipes() {
  const response = await apiClient.get("/recipes");
  return response.data;
}

export async function getRecipeDetail(recipeId) {
  const response = await apiClient.get(`/recipes/${recipeId}`);
  return response.data;
}

export async function createRecipe(recipeData) {
  const response = await apiClient.post("/recipes", recipeData);
  return response.data;
}

export async function updateRecipe(recipeId, recipeData) {
  const response = await apiClient.put(`/recipes/${recipeId}`, recipeData);
  return response.data;
}

export async function deleteRecipe(recipeId) {
  await apiClient.delete(`/recipes/${recipeId}`);
}
