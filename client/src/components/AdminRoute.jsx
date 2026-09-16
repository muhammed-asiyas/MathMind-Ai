import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
