import Team from "../models/Team.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

export const getTeams = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const teams = await Team.find({
      organization: user.organization,
    })
      .populate("manager", "name email")
      .populate("members", "name email")
      .populate("projects", "name color");
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};

export const getUserTeams = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const teams = await Team.find({
      organization: user.organization,
      members: req.user.id,
    })
      .populate("manager", "name email")
      .populate("projects", "name color");
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user teams" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = await User.findById(req.user.id);

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({ message: "Only admins and managers can create teams" });
    }

    const team = await Team.create({
      name: name.trim(),
      description: description || "",
      organization: user.organization,
      manager: req.user.id,
      members: [req.user.id],
      projects: [],
    });

    const populated = await team.populate("manager members", "name email");
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create team" });
  }
};

export const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(req.user.id);
    
    const team = await Team.findOne({
      _id: req.params.id,
      organization: user.organization,
    });
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({ message: "Only admins and managers can add members" });
    }

    const userToAdd = await User.findById(userId);
    if (!userToAdd || userToAdd.organization !== team.organization) {
      return res.status(404).json({ message: "User not found in your organization" });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    team.members.push(userId);
    await team.save();

    const populated = await team.populate("members", "name email");
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add member" });
  }
};

export const removeTeamMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(req.user.id);
    
    const team = await Team.findOne({
      _id: req.params.id,
      organization: user.organization,
    });
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({ message: "Only admins and managers can remove members" });
    }

    if (team.manager.toString() === userId) {
      return res.status(400).json({ message: "Cannot remove the team manager" });
    }

    team.members = team.members.filter(m => m.toString() !== userId);
    await team.save();

    const populated = await team.populate("members", "name email");
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove member" });
  }
};

export const assignProjectToTeam = async (req, res) => {
  try {
    const { projectId } = req.body;
    const user = await User.findById(req.user.id);
    
    const team = await Team.findOne({
      _id: req.params.id,
      organization: user.organization,
    });
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const project = await Project.findOne({
      _id: projectId,
      organization: user.organization,
    });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!team.projects.includes(projectId)) {
      team.projects.push(projectId);
      await team.save();
    }

    const populated = await team.populate("projects", "name color");
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to assign project" });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can delete teams" });
    }

    const team = await Team.findOneAndDelete({
      _id: req.params.id,
      organization: user.organization,
    });
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete team" });
  }
};
