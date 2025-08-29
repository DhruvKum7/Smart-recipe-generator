import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { fetchUser } from "./api/auth";
import { useAuthStore } from "./store/auth";
import CreateRecipe from "./pages/CreateRecipe";
import Recipe from "./pages/Recipe";
import SavedRecipe from "./pages/SavedRecipe";
import Error from "./pages/Error";
import Footer from "./components/Footer";

const App = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser()
      .then((res) => setUser(res.data.user))
      .catch(() => clearUser())
      .finally(() => setLoading(false));
  }, [setUser, clearUser]);

  if (loading) return <p>Loading...</p>; // Show while fetching user

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-recipe"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipe/:id"
          element={
            <ProtectedRoute>
              <Recipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedRecipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Error />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
