import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyRecipes, deleteRecipe } from "../api/recipes";
import { useAuth } from "../context/AuthContextObject";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();

  useEffect(() => {
    async function loadOnMount() {
      try {
        setLoading(true);
        const data = await getMyRecipes();
        setRecipes(data);
      } catch (err) {
        console.error(err);
        setError("Could not load recipes");
      } finally {
        setLoading(false);
      }
    }
    loadOnMount();
  }, []);

  async function loadRecipes() {
    try {
      setLoading(true);
      const data = await getMyRecipes();
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError("Could not load recipes");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(recipeId) {
    if (!confirm("Delete this recipe")) return;
    try {
      await deleteRecipe(recipeId);
      loadRecipes();
    } catch (err) {
      console.error(err);
      setError("Could not load recipe");
    }
  }

  if (loading) return <p>Loading Recipes....</p>;

  return (
    <div className="recipes-page">
      <header className="recipes-header">
        <h1>Welcome, {user.fullName}</h1>
        <div>
          <Link to="/recipes/new" className="new-recipe-link">
            +New Recipe
          </Link>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p className="auth-error">{error}</p>}

      {recipes.length === 0 && <p>No recipes yet -- add your first one.</p>}

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.recipeId} className="recipe-card">
            <Link to={`/recipes/${recipe.recipeId}`}>
              <h3>{recipe.title}</h3>
              {recipe.category && (
                <p className="recipe-category">{recipe.category}</p>
              )}
              <p className="recipe-meta">
                {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min · Serves{" "}
                {recipe.servings}
              </p>
            </Link>
            <button onClick={() => handleDelete(recipe.recipeId)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipesPage;
