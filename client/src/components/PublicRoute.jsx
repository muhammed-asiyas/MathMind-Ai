import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;