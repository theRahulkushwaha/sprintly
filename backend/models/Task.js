import mongoose from "mongoose";

/* REPLY SCHEMA */
const replySchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, default: "User" },
  },
  { timestamps: true }
);

/* COMMENT SCHEMA */
const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, default: "User" },
    replies: [replySchema],
  },
  { timestamps: true }
);

/* ACTIVITY SCHEMA */
const activitySchema = new mongoose.Schema({
  type: { type: String, default: "update" },
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, default: "User" },
  createdAt: { type: Date, default: Date.now },
});

/* TASK SCHEMA */
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, default: "active" },
    attachments: [{ name: String, url: String, type: String }],
    activity: [activitySchema],
    dueDate: Date,
    resourceLink: { type: String, default: "" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedToName: { type: String, default: "" },
    organization: { type: String, required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    columnId: { type: String, required: true },
    comments: [commentSchema],
    
    // FIXED: Changed from "WorkspaceTeam" to "Team"
    workspaceTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    subTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubTask",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);