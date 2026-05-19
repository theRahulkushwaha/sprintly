import { useAuthStore } from "../store/useAuthStore";

export const useOrganization = () => {
  const { user } = useAuthStore();
  
  const organization = user?.organization || null;
  const isSameOrganization = (userOrganization) => {
    return organization === userOrganization;
  };
  
  return {
    organization,
    isSameOrganization,
    hasOrganization: !!organization,
  };
};