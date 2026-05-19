import Project from "../models/Project.js";
import User from "../models/User.js";

export const getProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const projects = await Project.find({
      organization: user.organization,
      $or: [
        { owner: req.user.id },
        { members: req.user.id },
      ],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

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
    const { name, description, color, icon } = req.body;
    const user = await User.findById(req.user.id);

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
      organization: user.organization,
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

export const updateProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
        organization: user.organization,
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
        message: "Project not found or you don't have permission to update it",
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

export const deleteProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
      organization: user.organization,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you don't have permission to delete it",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete project",
    });
  }
};

export const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    
    const userToAdd = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!userToAdd) {
      return res.status(404).json({
        message: "No user found with that email",
      });
    }

    const currentUser = await User.findById(req.user.id);
    
    // Check if user is from same organization
    if (userToAdd.organization !== currentUser.organization) {
      return res.status(403).json({
        message: "User must be from the same organization",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
      organization: currentUser.organization,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you don't have permission to add members",
      });
    }

    const alreadyMember = project.members
      .map((m) => m.toString())
      .includes(userToAdd._id.toString());

    if (alreadyMember) {
      return res.status(400).json({
        message: "User is already a member of this project",
      });
    }

    project.members.push(userToAdd._id);
    await project.save();

    const populated = await project.populate(
      "owner members",
      "name email"
    );

    res.json(populated);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to add member to project",
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
      organization: currentUser.organization,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you don't have permission to remove members",
      });
    }

    // Don't allow removing the owner
    if (req.params.userId === project.owner.toString()) {
      return res.status(400).json({
        message: "Cannot remove the project owner",
      });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );

    await project.save();

    const populated = await project.populate(
      "owner members",
      "name email"
    );

    res.json(populated);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to remove member from project",
    });
  }
};

export const updateColumns = async (req, res) => {
  try {
    const { columns } = req.body;
    const user = await User.findById(req.user.id);
    
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
        organization: user.organization,
      },
      { columns },
      { new: true }
    )
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found or you don't have permission to update columns",
      });
    }

    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update project columns",
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const project = await Project.findOne({
      _id: req.params.id,
      organization: user.organization,
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check if user has access to this project
    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user.id
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You don't have access to this project",
      });
    }

    res.json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch project",
    });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const project = await Project.findOne({
      _id: req.params.id,
      organization: user.organization,
    })
      .populate("owner", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check if user has access
    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(
      (m) => m._id.toString() === req.user.id
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You don't have access to this project",
      });
    }

    const allMembers = [project.owner, ...project.members];
    res.json(allMembers);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch project members",
    });
  }
};

export const leaveProject = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const project = await Project.findOne({
      _id: req.params.id,
      organization: user.organization,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check if user is the owner
    if (project.owner.toString() === req.user.id) {
      return res.status(400).json({
        message: "Project owner cannot leave the project. Transfer ownership first or delete the project.",
      });
    }

    // Remove user from members
    project.members = project.members.filter(
      (m) => m.toString() !== req.user.id
    );

    await project.save();

    res.json({
      message: "Successfully left the project",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to leave project",
    });
  }
};