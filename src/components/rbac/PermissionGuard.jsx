import { useRBAC } from "../../hooks/useRBAC";

export const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useRBAC();
  
  if (!hasPermission(permission)) {
    return fallback;
  }
  
  return children;
};

export const RoleGuard = ({ roles, children, fallback = null }) => {
  const { hasRole } = useRBAC();
  
  if (!hasRole(roles)) {
    return fallback;
  }
  
  return children;
};