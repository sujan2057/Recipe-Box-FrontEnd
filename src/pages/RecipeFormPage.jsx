import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRecipeDetail, createRecipe, updateRecipe } from "../api/recipes";

function RecipeFormPage() {
  const { id } = useParams(); // undefined when creating, a string when editing
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(0);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(0);
  const [servings, setServings] = useState(1);
  const [category, setCategory] = useState("");

  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState([{ instruction: "" }]);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Only runs when editing — fetch the existing recipe and pre-fill the form.
  useEffect(() => {
    if (!isEditMode) return;

    async function loadRecipeOnMount() {
      try {
        setLoading(true);
        const data = await getRecipeDetail(id);
        setTitle(data.title);
        setDescription(data.description || "");
        setPrepTimeMinutes(data.prepTimeMinutes);
        setCookTimeMinutes(data.cookTimeMinutes);
        setServings(data.servings);
        setCategory(data.category || "");
        setIngredients(
          data.ingredients.length > 0
            ? data.ingredients.map((i) => ({
                name: i.name,
                quantity: i.quantity,
              }))
            : [{ name: "", quantity: "" }],
        );
        setSteps(
          data.steps.length > 0
            ? data.steps.map((s) => ({ instruction: s.instruction }))
            : [{ instruction: "" }],
        );
      } catch (err) {
        console.error(err);
        setError("Could not load this recipe.");
      } finally {
        setLoading(false);
      }
    }

    loadRecipeOnMount();
  }, [id, isEditMode]);

  // --- Ingredient row helpers ---

  function addIngredientRow() {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  }

  function updateIngredient(index, field, value) {
    setIngredients(
      ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient,
      ),
    );
  }

  function removeIngredientRow(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  // --- Step row helpers (same shape, one field instead of two) ---

  function addStepRow() {
    setSteps([...steps, { instruction: "" }]);
  }

  function updateStep(index, value) {
    setSteps(
      steps.map((step, i) => (i === index ? { instruction: value } : step)),
    );
  }

  function removeStepRow(index) {
    setSteps(steps.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Drop any rows the user left completely empty, rather than sending
    // blank ingredients/steps to the backend.
    const payload = {
      title,
      description,
      prepTimeMinutes: Number(prepTimeMinutes),
      cookTimeMinutes: Number(cookTimeMinutes),
      servings: Number(servings),
      category,
      ingredients: ingredients.filter(
        (i) => i.name.trim() && i.quantity.trim(),
      ),
      steps: steps.filter((s) => s.instruction.trim()),
    };

    try {
      if (isEditMode) {
        await updateRecipe(id, payload);
        navigate(`/recipes/${id}`);
      } else {
        const created = await createRecipe(payload);
        navigate(`/recipes/${created.recipeId}`);
      }
    } catch (err) {
      console.error(err);
      setError("Could not save recipe. Check that all fields are valid.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading recipe...</p>;

  return (
    <div className="recipe-form-page">
      <Link to="/recipes">← Back to recipes</Link>
      <h1>{isEditMode ? "Edit recipe" : "New recipe"}</h1>

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <div className="recipe-form-row">
          <label>
            Prep time (min)
            <input
              type="number"
              min={0}
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(e.target.value)}
            />
          </label>

          <label>
            Cook time (min)
            <input
              type="number"
              min={0}
              value={cookTimeMinutes}
              onChange={(e) => setCookTimeMinutes(e.target.value)}
            />
          </label>

          <label>
            Servings
            <input
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </label>
        </div>

        <label>
          Category
          <input
            type="text"
            placeholder="e.g. Dessert"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>

        <fieldset className="recipe-form-section">
          <legend>Ingredients</legend>

          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder="Name (e.g. Flour)"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Quantity (e.g. 2 cups)"
                value={ingredient.quantity}
                onChange={(e) =>
                  updateIngredient(index, "quantity", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeIngredientRow(index)}
                disabled={ingredients.length === 1}
              >
                ×
              </button>
            </div>
          ))}

          <button type="button" onClick={addIngredientRow}>
            + Add ingredient
          </button>
        </fieldset>

        <fieldset className="recipe-form-section">
          <legend>Steps</legend>

          {steps.map((step, index) => (
            <div key={index} className="step-row">
              <span className="step-number">{index + 1}.</span>
              <textarea
                placeholder="Describe this step"
                value={step.instruction}
                onChange={(e) => updateStep(index, e.target.value)}
                rows={2}
              />
              <button
                type="button"
                onClick={() => removeStepRow(index)}
                disabled={steps.length === 1}
              >
                ×
              </button>
            </div>
          ))}

          <button type="button" onClick={addStepRow}>
            + Add step
          </button>
        </fieldset>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditMode ? "Save changes" : "Create recipe"}
        </button>
      </form>
    </div>
  );
}

export default RecipeFormPage;
