// ProtectedRoute.jsx
import { useAuthStore } from "../store/auth";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  // If no user is logged in, redirect to login page
  // Save the current location so we can navigate back after login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated, render the requested route content
  return children;
}
