import SubTask from "../models/SubTask.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

// Get sub-tasks for a task
export const getSubTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const subTasks = await SubTask.find({
      parentTask: req.params.taskId,
      organization: user.organization,
    }).populate("assignedTo", "name email");

    res.json(subTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sub-tasks" });
  }
};

// Create sub-task
export const createSubTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo, dueDate } = req.body;
    const user = await User.findById(req.user.id);
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || assignedUser.organization !== user.organization) {
      return res.status(404).json({ message: "Assigned user not found" });
    }

    const subTask = await SubTask.create({
      title,
      description,
      priority: priority || "medium",
      assignedTo,
      assignedToName: assignedUser.name,
      parentTask: req.params.taskId,
      organization: user.organization,
      dueDate,
    });

    // Add sub-task to parent task
    task.subTasks.push(subTask._id);
    await task.save();

    const populated = await subTask.populate("assignedTo", "name email");
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create sub-task" });
  }
};

// Update sub-task
export const updateSubTask = async (req, res) => {
  try {
    const { status, title, description, priority, dueDate } = req.body;
    const subTask = await SubTask.findById(req.params.id);

    if (!subTask) {
      return res.status(404).json({ message: "Sub-task not found" });
    }

    const user = await User.findById(req.user.id);
    
    // Check if user has permission (admin, manager, or assigned user)
    const isAssigned = subTask.assignedTo.toString() === req.user.id;
    const hasPermission = user.role === 'admin' || user.role === 'manager' || isAssigned;

    if (!hasPermission) {
      return res.status(403).json({ message: "No permission to update this sub-task" });
    }

    if (status === "completed" && subTask.status !== "completed") {
      subTask.completedAt = new Date();
    }

    Object.assign(subTask, { status, title, description, priority, dueDate });
    await subTask.save();

    res.json(subTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update sub-task" });
  }
};

// Delete sub-task
export const deleteSubTask = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({ message: "Only admins and managers can delete sub-tasks" });
    }

    const subTask = await SubTask.findByIdAndDelete(req.params.id);
    if (!subTask) {
      return res.status(404).json({ message: "Sub-task not found" });
    }

    // Remove from parent task
    await Task.findByIdAndUpdate(subTask.parentTask, {
      $pull: { subTasks: subTask._id }
    });

    res.json({ message: "Sub-task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete sub-task" });
  }
};