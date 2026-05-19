import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/" />;
  }
  
  // Check if role is required and user has the required role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to dashboard if they don't have the required role
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}