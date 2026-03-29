import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.projectId) filter.projectId = req.query.projectId;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, columnId, description, priority, dueDate, projectId, assigneeName } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const task = await Task.create({
      title,
      columnId: columnId || "todo",
      description: description || "",
      priority: priority || "medium",
      dueDate: dueDate || null,
      projectId: projectId || null,
      assigneeName: assigneeName || "",
      userId: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body, { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $push: { comments: { text, author: req.user.id, authorName: req.user.name } } },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $pull: { comments: { _id: req.params.commentId } } },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};