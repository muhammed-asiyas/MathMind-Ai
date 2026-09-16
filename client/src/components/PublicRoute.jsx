import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (user && location.pathname !== "/forgot-password") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;