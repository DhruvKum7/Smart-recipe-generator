import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>; 

  return (
    <div className="p-6">
      <h2 className="text-2xl">Welcome, {user.fullName}</h2>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
