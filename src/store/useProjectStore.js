import { create } from "zustand";
import API from "../services/api";

export const useProjectStore = create((set, get) => ({
  projects: [],
  activeProject: JSON.parse(localStorage.getItem("activeProject") || "null"),

  fetchProjects: async () => {
    try {
      const res = await API.get("/projects");
      set({ projects: res.data });
      // Auto-select first project if none selected
      if (!get().activeProject && res.data.length > 0) {
        get().setActiveProject(res.data[0]);
      }
    } catch (err) {
      console.error("fetchProjects error:", err);
    }
  },

  createProject: async (data) => {
    const res = await API.post("/projects", data);
    set((state) => ({ projects: [...state.projects, res.data] }));
    get().setActiveProject(res.data);
    return res.data;
  },

  updateProject: async (id, data) => {
    const res = await API.put(`/projects/${id}`, data);
    set((state) => ({
      projects: state.projects.map((p) => (p._id === id ? res.data : p)),
      activeProject: state.activeProject?._id === id ? res.data : state.activeProject,
    }));
  },

  deleteProject: async (id) => {
    await API.delete(`/projects/${id}`);
    set((state) => {
      const remaining = state.projects.filter((p) => p._id !== id);
      const newActive = state.activeProject?._id === id ? (remaining[0] || null) : state.activeProject;
      localStorage.setItem("activeProject", JSON.stringify(newActive));
      return { projects: remaining, activeProject: newActive };
    });
  },

  setActiveProject: (project) => {
    localStorage.setItem("activeProject", JSON.stringify(project));
    set({ activeProject: project });
  },
}));