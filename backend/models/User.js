import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ['admin', 'manager', 'developer'],
      default: 'developer'
    },

    organization: {
      type: String,
      required: true,
      trim: true,
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

    workspaceTeams: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkspaceTeam",
  },
],

    notifications: [
      {
        text: String,
        read: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);