import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "bg-slate-500",
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    icon: {
      type: String,
      default: "🚀",
    },
    organization: {
      type: String,
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    columns: {
      type: [columnSchema],
      default: () => [
        { id: "todo", title: "To Do", color: "bg-slate-500" },
        { id: "progress", title: "In Progress", color: "bg-amber-500" },
        { id: "done", title: "Done", color: "bg-emerald-500" },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);