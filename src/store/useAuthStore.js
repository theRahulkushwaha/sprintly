import { create } from "zustand";
import API from "../services/api";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,

  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
    return user;
  },

  register: async (name, email, password, role, organization) => {
    await API.post("/auth/register", { name, email, password, role, organization });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
  
  updateUserRole: async (userId, role) => {
    const res = await API.put(`/auth/users/${userId}/role`, { role });
    const updatedUser = res.data;
    const currentUser = useAuthStore.getState().user;
    if (updatedUser._id === currentUser?._id) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
    return updatedUser;
  },
}));