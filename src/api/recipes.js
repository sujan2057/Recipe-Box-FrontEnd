import apiClient from "./Client";

export async function getMyRecipes() {
  const response = await apiClient.get("/recipes");
  return response.data;
}

export async function getRecipeDetail() {
  const response = await apiClient.get(`/recipes/{recipeId}`);
  return response.data;
}

export async function createRecipe() {
  const response = await apiClient.post("/recipes" /*recipeData*/);
  return response.data;
}

export async function updateRecipe() {
  const response = await apiClient.put(`/recipes/{recipeId}` /*recipeData*/);
  return response.data;
}

export async function deleteRecipe() {
  await apiClient.delete(`/recipes/{recipeId}`);
}
