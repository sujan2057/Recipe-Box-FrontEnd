import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRecipeDetail, deleteRecipe } from "../api/recipes";

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOnMount() {
      try {
        setLoading(true);
        const data = await getRecipeDetail(id);
        setRecipe(data);
      } catch (err) {
        console.error(err);
        setError("Could not load this recipe.");
      } finally {
        setLoading(false);
      }
    }
    loadOnMount();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Delete this recipe?")) return;
    try {
      await deleteRecipe(id);
      navigate("/recipes");
    } catch (err) {
      console.error(err);
      setError("Could not delete recipe");
    }
  }

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found....</p>;

  return (
    <div className="recipe-detail-page">
      <Link to="/recipes">Back to recipes</Link>

      {error && <p className="auth-error">{error}</p>}

      <header className="recipe-detail-header">
        <h1>{recipe.title}</h1>
        {recipe.category && (
          <span className="recipe-category">{recipe.category}</span>
        )}
      </header>

      {recipe.description && (
        <p className="recipe-description">{recipe.description}</p>
      )}

      <div className="recipe-stats">
        <span>Prep:{recipe.prepTimeMinutes} min</span>
        <span>Cook: {recipe.cookTimeMinutes} min</span>
        <span>Serves: {recipe.servings}</span>
      </div>
      <p className="recipe-author">By {recipe.CreatedByUserName}</p>

      <div className="recipe-detail-actions">
        <Link to={`/recipes/${id}/edit`}>
          <button type="button">Edit</button>
        </Link>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <section className="recipe-section">
        <h2>Ingridents</h2>
        <ul className="ingrident-list">
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.ingredientId}>
              <strong>{ingredient.quantity}</strong> {ingredient.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="recipe-section">
        <h2>Steps</h2>
        <ol className="step-list">
          {recipe.steps.map((step) => (
            <li key={step.stepId}>{step.instruction}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default RecipeDetailPage;
