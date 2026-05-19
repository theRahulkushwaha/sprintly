import { useAuthStore } from "../store/useAuthStore";

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DEVELOPER: 'developer'
};

export const PERMISSIONS = {
  // Task permissions
  CREATE_TASK: 'create_task',
  EDIT_TASK: 'edit_task',
  DELETE_TASK: 'delete_task',
  ASSIGN_TASK: 'assign_task',
  MOVE_TASK: 'move_task',
  UPDATE_TASK_STATUS: 'update_task_status',
  
  // Comment permissions
  ADD_COMMENT: 'add_comment',
  DELETE_COMMENT: 'delete_comment',
  
  // Project permissions
  CREATE_PROJECT: 'create_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  MANAGE_MEMBERS: 'manage_members',
  MANAGE_COLUMNS: 'manage_columns',
  
  // Workspace permissions
  CREATE_WORKSPACE: 'create_workspace',
  MANAGE_WORKSPACE: 'manage_workspace',
  
  // Settings
  VIEW_SETTINGS: 'view_settings',
  CHANGE_PASSWORD: 'change_password',
};

// Role-based permission mapping
const rolePermissions = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // All permissions
  
  [ROLES.MANAGER]: [
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.EDIT_TASK,
    PERMISSIONS.ASSIGN_TASK,
    PERMISSIONS.MOVE_TASK,
    PERMISSIONS.UPDATE_TASK_STATUS,
    PERMISSIONS.ADD_COMMENT,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.MANAGE_COLUMNS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.CHANGE_PASSWORD,
  ],
  
  [ROLES.DEVELOPER]: [
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.CHANGE_PASSWORD,
    PERMISSIONS.ADD_COMMENT,
    PERMISSIONS.UPDATE_TASK_STATUS,
  ],
};

export const useRBAC = () => {
  const { user } = useAuthStore();
  const userRole = user?.role || ROLES.DEVELOPER;
  
  const hasPermission = (permission) => {
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(permission);
  };
  
  const hasRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  };
  
  return {
    userRole,
    isAdmin: userRole === ROLES.ADMIN,
    isManager: userRole === ROLES.MANAGER,
    isDeveloper: userRole === ROLES.DEVELOPER,
    hasPermission,
    hasRole,
  };
};