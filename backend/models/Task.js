import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    text: String,

    authorName: String,
  },
  {
    timestamps: true,
  }
);

const commentSchema =
  new mongoose.Schema(
    {
      text: String,

      author: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      authorName: String,

      replies: [replySchema],
    },
    {
      timestamps: true,
    }
  );

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
      ],
      default: "medium",
    },

    status: {
      type: String,
      default: "active",
    },

    attachments: [
      {
        name: String,

        url: String,

        type: String,
      },
    ],

    activity: [
  {
    type: {
      type: String,
      default: "update",
    },

    message: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userName: {
      type: String,
      default: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    dueDate: Date,

    resourceLink: String,

    assignedTo: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",
    },

    assignedToName: String,

    projectId: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Project",

      required: true,
    },

    columnId: {
      type: String,
      required: true,
    },

    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Task",
  taskSchema
);