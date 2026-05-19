import { create } from "zustand";
import API from "../services/api";
import { socket } from "../socket";

export const useTaskStore = create((set, get) => ({
  tasks: [],

  /* FETCH TASKS */
  fetchTasks: async (projectId) => {
    try {
      const url = projectId ? `/tasks?projectId=${projectId}` : "/tasks";
      const res = await API.get(url);
      set({ tasks: res.data });
      return res.data;
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  },

  /* CREATE TASK */
  addTask: async (task) => {
    try {
      const res = await API.post("/tasks", task);
      const newTask = res.data;
      
      // Optimistically add to local state
      set((state) => ({
        tasks: [newTask, ...state.tasks]
      }));
      
      return newTask;
    } catch (err) {
      console.error("Add task error:", err);
      throw err;
    }
  },

  /* UPDATE TASK */
  updateTask: async (id, data) => {
    try {
      const res = await API.put(`/tasks/${id}`, data);
      const updatedTask = res.data;
      
      // Update local state
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? updatedTask : task
        )
      }));
      
      return updatedTask;
    } catch (err) {
      console.error("Update task error:", err);
      throw err;
    }
  },

  /* DELETE TASK */
  deleteTask: async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      
      // Remove from local state
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id)
      }));
    } catch (err) {
      console.error("Delete task error:", err);
      throw err;
    }
  },
  
  /* MOVE TASK */
  moveTask: async (taskId, newColumnId) => {
    try {
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? { ...task, columnId: newColumnId } : task
        )
      }));
      
      await API.put(`/tasks/${taskId}`, { columnId: newColumnId });
    } catch (err) {
      console.error("Move task error:", err);
      // Revert on error
      const { fetchTasks } = get();
      const activeProject = useProjectStore.getState().activeProject;
      if (activeProject?._id) {
        await fetchTasks(activeProject._id);
      }
    }
  },

  /* ADD COMMENT */
  addComment: async (taskId, text) => {
    try {
      const res = await API.post(`/tasks/${taskId}/comments`, { text });
      const updatedTask = res.data;
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      }));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  },

  /* DELETE COMMENT */
  deleteComment: async (taskId, commentId) => {
    try {
      const res = await API.delete(`/tasks/${taskId}/comments/${commentId}`);
      const updatedTask = res.data;
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      }));
    } catch (err) {
      console.error("Delete comment error:", err);
    }
  },

  /* ADD REPLY */
  addReply: async (taskId, commentId, text) => {
    try {
      const res = await API.post(`/tasks/${taskId}/comments/${commentId}/replies`, { text });
      const updatedTask = res.data;
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      }));
    } catch (err) {
      console.error("Add reply error:", err);
    }
  },
}));

// Socket event listeners for real-time updates
socket.on("task-created", (task) => {
  console.log("Task created via socket:", task);
  useTaskStore.setState((state) => ({
    tasks: [task, ...state.tasks.filter((t) => t._id !== task._id)]
  }));
});

socket.on("task-updated", (updatedTask) => {
  console.log("Task updated via socket:", updatedTask);
  useTaskStore.setState((state) => ({
    tasks: state.tasks.map((task) =>
      task._id === updatedTask._id ? updatedTask : task
    )
  }));
});

socket.on("task-deleted", (taskId) => {
  console.log("Task deleted via socket:", taskId);
  useTaskStore.setState((state) => ({
    tasks: state.tasks.filter((task) => task._id !== taskId)
  }));
});