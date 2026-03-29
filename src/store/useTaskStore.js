import { create } from "zustand";
import API from "../services/api";

export const useTaskStore = create((set) => ({
  tasks: [],

  fetchTasks: async (projectId) => {
    try {
      const url = projectId ? `/tasks?projectId=${projectId}` : "/tasks";
      const res = await API.get(url);
      set({ tasks: res.data });
    } catch (err) {
      console.error("fetchTasks error:", err);
    }
  },

  addTask: async (task) => {
    try {
      const res = await API.post("/tasks", task);
      set((state) => ({ tasks: [res.data, ...state.tasks] }));
    } catch (err) {
      console.error("addTask error:", err);
    }
  },

  updateTask: async (id, data) => {
    try {
      const res = await API.put(`/tasks/${id}`, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? res.data : t)),
      }));
      return res.data;
    } catch (err) {
      console.error("updateTask error:", err);
    }
  },

  deleteTask: async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }));
    } catch (err) {
      console.error("deleteTask error:", err);
    }
  },

  moveTask: async (id, columnId) => {
    try {
      const res = await API.put(`/tasks/${id}`, { columnId });
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? res.data : t)),
      }));
    } catch (err) {
      console.error("moveTask error:", err);
    }
  },

  addComment: async (taskId, text) => {
    try {
      const res = await API.post(`/tasks/${taskId}/comments`, { text });
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? res.data : t)),
      }));
      return res.data;
    } catch (err) {
      console.error("addComment error:", err);
    }
  },

  deleteComment: async (taskId, commentId) => {
    try {
      const res = await API.delete(`/tasks/${taskId}/comments/${commentId}`);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? res.data : t)),
      }));
    } catch (err) {
      console.error("deleteComment error:", err);
    }
  },
}));