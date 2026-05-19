import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedToName: { type: String, default: "" },
    parentTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    organization: { type: String, required: true, index: true },
    dueDate: Date,
    completedAt: Date,
    attachments: [{ name: String, url: String, type: String }],
    comments: [
      {
        text: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        authorName: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("SubTask", subTaskSchema);