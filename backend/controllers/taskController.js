import Task from "../models/Task.js";

export const getTasks = async (
  req,
  res
) => {
  try {
    const filter = {};

    if (req.query.projectId) {
      filter.projectId =
        req.query.projectId;
    }

    const tasks = await Task.find(
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

export const createTask = async (
  req,
  res
) => {
  try {
    const task = await Task.create(
      req.body
    );

    res.status(201).json(task);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Failed to create task",
    });
  }
};

export const updateTask = async (
  req,
  res
) => {
  try {
    const task =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Failed to update task",
    });
  }
};

export const deleteTask = async (
  req,
  res
) => {
  try {
    const task =
      await Task.findByIdAndDelete(
        req.params.id
      );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

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

export const addComment = async (
  req,
  res
) => {
  try {
    const task =
      await Task.findById(
        req.params.id
      );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.comments.push({
      text: req.body.text,
      author: req.user.id,
      authorName:
        req.user.name,
    });

    await task.save();

    res.json(task);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Failed to add comment",
    });
  }
};

export const deleteComment = async (
  req,
  res
) => {
  try {
    const task =
      await Task.findById(
        req.params.taskId
      );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.comments =
      task.comments.filter(
        (c) =>
          c._id.toString() !==
          req.params.commentId
      );

    await task.save();

    res.json(task);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Failed to delete comment",
    });
  }
};