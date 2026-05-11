import Project from "../models/Project.js";
import User from "../models/User.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id },
      ],
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    res.json(projects);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      color,
      icon,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,

      description,

      color: color || "#6366f1",

      icon: icon || "🚀",

      owner: req.user.id,

      members: [req.user.id],

      columns: [
        {
          id: "todo",
          title: "To Do",
          color: "bg-slate-500",
        },
        {
          id: "progress",
          title: "In Progress",
          color: "bg-amber-500",
        },
        {
          id: "done",
          title: "Done",
          color: "bg-emerald-500",
        },
      ],
    });

    const populated = await project.populate(
      "owner members",
      "name email"
    );

    res.status(201).json(populated);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to create project",
      error: err.message,
    });
  }
};

export const updateProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.user.id,
        },
        req.body,
        {
          new: true,
        }
      )
        .populate("owner", "name email")
        .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to update project",
    });
  }
};

export const deleteProject = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findOneAndDelete({
        _id: req.params.id,
        owner: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to delete project",
    });
  }
};

export const addMember = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    const userToAdd =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (!userToAdd) {
      return res.status(404).json({
        message:
          "No user found with that email",
      });
    }

    const project =
      await Project.findOne({
        _id: req.params.id,
        owner: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const alreadyMember =
      project.members
        .map((m) => m.toString())
        .includes(
          userToAdd._id.toString()
        );

    if (alreadyMember) {
      return res.status(400).json({
        message:
          "User is already a member",
      });
    }

    project.members.push(userToAdd._id);

    await project.save();

    const populated =
      await project.populate(
        "owner members",
        "name email"
      );

    res.json(populated);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to add member",
    });
  }
};

export const removeMember = async (
  req,
  res
) => {
  try {
    const project =
      await Project.findOne({
        _id: req.params.id,
        owner: req.user.id,
      });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.members =
      project.members.filter(
        (m) =>
          m.toString() !==
          req.params.userId
      );

    await project.save();

    const populated =
      await project.populate(
        "owner members",
        "name email"
      );

    res.json(populated);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to remove member",
    });
  }
};

export const updateColumns = async (
  req,
  res
) => {
  try {
    const { columns } = req.body;

    const project =
      await Project.findOneAndUpdate(
        {
          _id: req.params.id,
          owner: req.user.id,
        },
        { columns },
        { new: true }
      )
        .populate("owner", "name email")
        .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Failed to update columns",
    });
  }
};