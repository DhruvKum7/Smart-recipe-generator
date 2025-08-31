// PublicRoute.jsx
import { useAuthStore } from "../store/auth";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  // If the user is already authenticated, send them to the dashboard.
  // We also include the "from" state in case you ever want to track where they came from.
  if (user) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  // Otherwise, render the public route (e.g., login, signup, landing page).
  return children;
}
