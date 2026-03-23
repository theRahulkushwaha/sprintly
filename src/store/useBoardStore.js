import { create } from "zustand";
import API from "../services/api";

export const useBoardStore = create((set) => ({
  board: null,

  fetchBoard: async (projectId) => {
    const res = await API.get(`/projects/${projectId}`);
    set({ board: res.data });
  },

  moveTask: async (taskId, data) => {
    await API.patch(`/tasks/${taskId}/move`, data);
  },
}));