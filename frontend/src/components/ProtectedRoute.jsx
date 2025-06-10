import { useAuthStore } from "../store/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    // Not logged in → redirect to login page
    return <Navigate to="/login" replace />;
  }
  return children;
}
