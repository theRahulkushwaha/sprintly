import Task from "../models/Task.js";
import User from "../models/User.js"; 
import { io } from "../server.js";

const createActivity = ({
  type,
  message,
  user,
}) => ({
  type,
  message,
  userId: user?.id || null,
  userName: user?.name || "User",
  createdAt: new Date(),
});

/* GET TASKS */
export const getTasks = async (req, res) => {
  try {
    const filter = {};
    const user = await User.findById(req.user.id);
    
    if (!user || !user.organization) {
      return res.status(400).json({ message: "User organization not found" });
    }
    
    filter.organization = user.organization;
    
    if (req.query.projectId) {
      filter.projectId = req.query.projectId;
    }

    // Remove the populate for now to avoid the error
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
      
    res.json(tasks);
  } catch (err) {
    console.log("Get tasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

/* CREATE TASK */
export const createTask = async (req, res) => {
  try {
    const { workspaceTeam, ...taskData } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!workspaceTeam) {
      return res.status(400).json({ message: "workspaceTeam is required" });
    }
    
    const task = await Task.create({
      ...taskData,
      workspaceTeam,
      organization: user.organization,
      activity: [
        createActivity({
          type: "created",
          message: `created task "${req.body.title}"`,
          user: req.user,
        }),
      ],
    });

    io.to(task.projectId.toString()).emit("task-created", task);
    res.status(201).json(task);
  } catch (err) {
    console.log("Create task error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Helper function
const canModifyTask = async (user, task) => {
  const fullUser = await User.findById(user.id);
  if (fullUser.role === 'admin') return true;
  if (fullUser.role === 'manager') return true;
  if (fullUser.role === 'developer' && task.assignedTo?.toString() === user.id) return true;
  return false;
};

/* UPDATE TASK */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    const user = await User.findById(req.user.id);
    const isAssignedDeveloper = task.assignedTo?.toString() === user.id;
    
    if (user.role === 'developer' && !isAssignedDeveloper) {
      return res.status(403).json({ 
        message: "Developers can only update tasks assigned to them" 
      });
    }
    
    if (user.role === 'developer') {
      const allowedUpdates = ['status', 'columnId', 'description'];
      const requestedUpdates = Object.keys(req.body);
      const isAllowed = requestedUpdates.every(update => allowedUpdates.includes(update));
      
      if (!isAllowed) {
        return res.status(403).json({ 
          message: "Developers can only update status, column, and description" 
        });
      }
    }
    
    const updates = req.body;

    if (updates.title && updates.title !== task.title) {
      task.activity.push(createActivity({
        type: "updated",
        message: `renamed task to "${updates.title}"`,
        user: req.user,
      }));
    }

    if (updates.priority && updates.priority !== task.priority) {
      task.activity.push(createActivity({
        type: "updated",
        message: `changed priority to ${updates.priority}`,
        user: req.user,
      }));
    }

    if (updates.columnId && updates.columnId !== task.columnId) {
      task.activity.push(createActivity({
        type: "moved",
        message: "moved task to another column",
        user: req.user,
      }));
    }

    if (updates.description !== undefined && updates.description !== task.description) {
      task.activity.push(createActivity({
        type: "updated",
        message: "updated task description",
        user: req.user,
      }));
    }

    Object.assign(task, updates);
    await task.save();

    io.to(task.projectId.toString()).emit("task-updated", task);
    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

/* DELETE TASK */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has permission to delete
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({ message: "Only admins and managers can delete tasks" });
    }

    const projectId = task.projectId.toString();
    await Task.findByIdAndDelete(req.params.id);
    io.to(projectId).emit("task-deleted", req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newComment = {
      text,
      author: req.user.id,
      authorName: req.user.name,
    };

    task.comments.push(newComment);
    task.activity.push(createActivity({
      type: "comment",
      message: "added a comment",
      user: req.user,
    }));

    await task.save();
    io.to(task.projectId.toString()).emit("task-updated", task);
    res.status(201).json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* ADD REPLY */
export const addReply = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.replies.push({
      text,
      author: req.user.id,
      authorName: req.user.name,
    });

    task.activity.push(createActivity({
      type: "comment",
      message: "replied to a comment",
      user: req.user,
    }));

    await task.save();
    io.to(task.projectId.toString()).emit("task-updated", task);
    res.status(201).json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add reply" });
  }
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.comments = task.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    task.activity.push(createActivity({
      type: "comment",
      message: "deleted a comment",
      user: req.user,
    }));

    await task.save();
    io.to(task.projectId.toString()).emit("task-updated", task);
    res.json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};