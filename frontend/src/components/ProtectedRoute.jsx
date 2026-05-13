import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400" data-testid="auth-loading">
        Loading…
      </div>
    );
  }
  if (user === false || !user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
