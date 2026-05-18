import { create } from "zustand";

import API from "../services/api";

import { socket } from "../socket";

export const useTaskStore =
  create((set) => ({
    tasks: [],

    fetchTasks: async (
      projectId
    ) => {
      try {
        const url = projectId
          ? `/tasks?projectId=${projectId}`
          : "/tasks";

        const res =
          await API.get(url);

        set({
          tasks: res.data,
        });
      } catch (err) {
        console.error(err);
      }
    },

    addTask: async (
      task
    ) => {
      try {
        await API.post(
          "/tasks",
          task
        );
      } catch (err) {
        console.error(err);
      }
    },

    updateTask: async (
      id,
      data
    ) => {
      try {
        await API.put(
          `/tasks/${id}`,
          data
        );
      } catch (err) {
        console.error(err);
      }
    },

    deleteTask: async (
      id
    ) => {
      try {
        await API.delete(
          `/tasks/${id}`
        );
      } catch (err) {
        console.error(err);
      }
    },

    moveTask: async (
      taskId,
      newColumnId
    ) => {
      try {
        await API.put(
          `/tasks/${taskId}`,
          {
            columnId:
              newColumnId,
          }
        );
      } catch (err) {
        console.error(err);
      }
    },

    addComment: async (
      taskId,
      text
    ) => {
      try {
        await API.post(
          `/tasks/${taskId}/comments`,
          { text }
        );
      } catch (err) {
        console.error(err);
      }
    },

    deleteComment:
      async (
        taskId,
        commentId
      ) => {
        try {
          await API.delete(
            `/tasks/${taskId}/comments/${commentId}`
          );
        } catch (err) {
          console.error(err);
        }
      },
  }));

/* SOCKET EVENTS */

socket.on(
  "task-created",
  (task) => {
    useTaskStore.setState(
      (state) => ({
        tasks: [
          task,
          ...state.tasks.filter(
            (t) =>
              t._id !==
              task._id
          ),
        ],
      })
    );
  }
);

socket.on(
  "task-updated",
  (updatedTask) => {
    useTaskStore.setState(
      (state) => ({
        tasks: state.tasks.map(
          (task) =>
            task._id ===
            updatedTask._id
              ? updatedTask
              : task
        ),
      })
    );
  }
);

socket.on(
  "task-deleted",
  (taskId) => {
    useTaskStore.setState(
      (state) => ({
        tasks:
          state.tasks.filter(
            (task) =>
              task._id !==
              taskId
          ),
      })
    );
  }
);