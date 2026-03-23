import { create } from "zustand";
import API from "../services/api";

export const useTaskStore = create((set) => ({
  tasks: [],
  fetchTasks: async () => {
    const res = await API.get("/tasks");
    set({ tasks: res.data });
  },
  addTask: async (task) => {
    const res = await API.post("/tasks", task);
    set(state => ({ tasks: [...state.tasks, res.data] }));
  },
  updateTask: async (id, data) => {
    const res = await API.put(`/tasks/${id}`, data);
    set(state => ({ tasks: state.tasks.map(t => t._id === id ? res.data : t) }));
  },
  deleteTask: async (id) => {
    await API.delete(`/tasks/${id}`);
    set(state => ({ tasks: state.tasks.filter(t => t._id !== id) }));
  },
  moveTask: async (id, columnId) => {
    const res = await API.put(`/tasks/${id}`, { columnId });
    set(state => ({ tasks: state.tasks.map(t => t._id === id ? res.data : t) }));
  }
}));