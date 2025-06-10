import { useAuthStore } from "../store/auth";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (user) {
    // Already logged in → redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
