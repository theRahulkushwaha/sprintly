import Task from "../models/Task.js";

import { io } from "../server.js";

const createActivity = ({
  type,
  message,
  user,
}) => ({
  type,

  message,

  userId:
    user?.id || null,

  userName:
    user?.name || "User",

  createdAt: new Date(),
});

/* GET TASKS */
export const getTasks =
  async (req, res) => {
    try {
      const filter = {};

      if (
        req.query.projectId
      ) {
        filter.projectId =
          req.query.projectId;
      }

      const tasks =
        await Task.find(
          filter
        ).sort({
          createdAt: -1,
        });

      res.json(tasks);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to fetch tasks",
      });
    }
  };

/* CREATE TASK */
export const createTask =
  async (req, res) => {
    try {
      const task =
        await Task.create({
          ...req.body,

          activity: [
            createActivity({
              type:
                "created",

              message: `created task "${req.body.title}"`,

              user:
                req.user,
            }),
          ],
        });

      io.to(
        task.projectId.toString()
      ).emit(
        "task-created",
        task
      );

      res.status(201).json(
        task
      );
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to create task",
      });
    }
  };

/* UPDATE TASK */
export const updateTask =
  async (req, res) => {
    try {
      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      const updates =
        req.body;

      if (
        updates.title &&
        updates.title !==
          task.title
      ) {
        task.activity.push(
          createActivity({
            type:
              "updated",

            message: `renamed task to "${updates.title}"`,

            user:
              req.user,
          })
        );
      }

      if (
        updates.priority &&
        updates.priority !==
          task.priority
      ) {
        task.activity.push(
          createActivity({
            type:
              "updated",

            message: `changed priority to ${updates.priority}`,

            user:
              req.user,
          })
        );
      }

      if (
        updates.columnId &&
        updates.columnId !==
          task.columnId
      ) {
        task.activity.push(
          createActivity({
            type:
              "moved",

            message:
              "moved task to another column",

            user:
              req.user,
          })
        );
      }

      if (
        updates.description !==
        undefined &&
        updates.description !==
          task.description
      ) {
        task.activity.push(
          createActivity({
            type:
              "updated",

            message:
              "updated task description",

            user:
              req.user,
          })
        );
      }

      Object.assign(
        task,
        updates
      );

      await task.save();

      io.to(
        task.projectId.toString()
      ).emit(
        "task-updated",
        task
      );

      res.json(task);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to update task",
      });
    }
  };

/* DELETE TASK */
export const deleteTask =
  async (req, res) => {
    try {
      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      const projectId =
        task.projectId.toString();

      await Task.findByIdAndDelete(
        req.params.id
      );

      io.to(projectId).emit(
        "task-deleted",
        req.params.id
      );

      res.json({
        message:
          "Task deleted successfully",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to delete task",
      });
    }
  };

/* ADD COMMENT */
export const addComment =
  async (req, res) => {
    try {
      const { text } =
        req.body;

      const task =
        await Task.findById(
          req.params.taskId
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      const newComment = {
        text,

        author:
          req.user.id,

        authorName:
          req.user.name,
      };

      task.comments.push(
        newComment
      );

      task.activity.push(
        createActivity({
          type:
            "comment",

          message:
            "added a comment",

          user:
            req.user,
        })
      );

      await task.save();

      io.to(
        task.projectId.toString()
      ).emit(
        "task-updated",
        task
      );

      res.status(201).json(
        task
      );
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to add comment",
      });
    }
  };

/* ADD REPLY */
export const addReply =
  async (req, res) => {
    try {
      const { text } =
        req.body;

      const task =
        await Task.findById(
          req.params.taskId
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      const comment =
        task.comments.id(
          req.params.commentId
        );

      if (!comment) {
        return res
          .status(404)
          .json({
            message:
              "Comment not found",
          });
      }

      comment.replies.push({
        text,

        author:
          req.user.id,

        authorName:
          req.user.name,
      });

      task.activity.push(
        createActivity({
          type:
            "comment",

          message:
            "replied to a comment",

          user:
            req.user,
        })
      );

      await task.save();

      io.to(
        task.projectId.toString()
      ).emit(
        "task-updated",
        task
      );

      res.status(201).json(
        task
      );
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to add reply",
      });
    }
  };

/* DELETE COMMENT */
export const deleteComment =
  async (req, res) => {
    try {
      const task =
        await Task.findById(
          req.params.taskId
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      task.comments =
        task.comments.filter(
          (c) =>
            c._id.toString() !==
            req.params.commentId
        );

      task.activity.push(
        createActivity({
          type:
            "comment",

          message:
            "deleted a comment",

          user:
            req.user,
        })
      );

      await task.save();

      io.to(
        task.projectId.toString()
      ).emit(
        "task-updated",
        task
      );

      res.json(task);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to delete comment",
      });
    }
  };