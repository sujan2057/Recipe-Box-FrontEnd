import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RecipesPage from "./pages/RecipesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipeFormPage from "./pages/RecipeFormPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/new"
          element={
            <ProtectedRoute>
              <RecipeFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/:id/edit"
          element={
            <ProtectedRoute>
              <RecipeFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <ProtectedRoute>
              <RecipeDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={"/recipes"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
