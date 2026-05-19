import { create } from "zustand";
import API from "../services/api";
import { socket } from "../socket";

export const useTaskStore = create(
  (set) => ({
    tasks: [],

    /* FETCH TASKS */
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

    /* CREATE TASK */
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

    /* UPDATE TASK */
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

    /* DELETE TASK */
    deleteTask: async (id) => {
  // Optimistic update first
  set((state) => ({
    tasks: state.tasks.filter((task) => task._id !== id),
  }));
  try {
    await API.delete(`/tasks/${id}`);
  } catch (err) {
    console.error(err);
  }
},
    /* MOVE TASK */
    moveTask: async (taskId, newColumnId) => {
  // Optimistic update first
  set((state) => ({
    tasks: state.tasks.map((task) =>
      task._id === taskId
        ? { ...task, columnId: newColumnId }
        : task
    ),
  }));
  try {
    await API.put(`/tasks/${taskId}`, { columnId: newColumnId });
  } catch (err) {
    console.error(err);
    // On error, re-fetch to restore correct state
  }
},


    /* ADD COMMENT */
    addComment: async (
      taskId,
      text
    ) => {
      try {
        const res =
          await API.post(
            `/tasks/${taskId}/comments`,
            { text }
          );

        set((state) => ({
          tasks:
            state.tasks.map(
              (task) =>
                task._id ===
                taskId
                  ? {
                      ...task,
                      comments: [
                        ...task.comments,
                        res.data,
                      ],
                    }
                  : task
            ),
        }));
      } catch (err) {
        console.error(err);
      }
    },

    /* DELETE COMMENT */
    deleteComment:
      async (
        taskId,
        commentId
      ) => {
        try {
          await API.delete(
            `/tasks/${taskId}/comments/${commentId}`
          );

          set((state) => ({
            tasks:
              state.tasks.map(
                (task) =>
                  task._id ===
                  taskId
                    ? {
                        ...task,
                        comments:
                          task.comments.filter(
                            (
                              c
                            ) =>
                              c._id !==
                              commentId
                          ),
                      }
                    : task
              ),
          }));
        } catch (err) {
          console.error(err);
        }
      },

    /* ADD REPLY */
    addReply: async (
      taskId,
      commentId,
      text
    ) => {
      try {
        const res =
          await API.post(
            `/tasks/${taskId}/comments/${commentId}/replies`,
            { text }
          );

        set((state) => ({
          tasks:
            state.tasks.map(
              (task) =>
                task._id ===
                taskId
                  ? {
                      ...task,
                      comments:
                        task.comments.map(
                          (
                            comment
                          ) =>
                            comment._id ===
                            commentId
                              ? res.data
                              : comment
                        ),
                    }
                  : task
            ),
        }));
      } catch (err) {
        console.error(err);
      }
    },
  })
);

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
        tasks:
          state.tasks.map(
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