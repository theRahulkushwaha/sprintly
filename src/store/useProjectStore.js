import { create } from "zustand";
import API from "../services/api";

export const useProjectStore = create((set, get) => ({
  projects: [],
  activeProject: null,

  fetchProjects: async () => {
    try {
      const res = await API.get("/projects");
      set({ projects: res.data });
      if (!get().activeProject && res.data.length > 0) {
        set({ activeProject: res.data[0] });
      }
    } catch (err) { console.error(err); }
  },

  createProject: async (data) => {
    const res = await API.post("/projects", data);
    set((state) => ({ projects: [...state.projects, res.data], activeProject: res.data }));
    return res.data;
  },

  updateProject: async (id, data) => {
    const res = await API.put(`/projects/${id}`, data);
    set((state) => ({
      projects: state.projects.map((p) => p._id === id ? res.data : p),
      activeProject: state.activeProject?._id === id ? res.data : state.activeProject,
    }));
  },

  deleteProject: async (id) => {
    await API.delete(`/projects/${id}`);
    set((state) => {
      const projects = state.projects.filter((p) => p._id !== id);
      return { projects, activeProject: projects[0] || null };
    });
  },

  setActiveProject: (project) => set({ activeProject: project }),
}));