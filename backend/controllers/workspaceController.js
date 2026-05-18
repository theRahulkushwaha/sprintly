import Workspace from "../models/Workspace.js";

import User from "../models/User.js";

/* GET WORKSPACES */
export const getWorkspaces =
  async (req, res) => {
    try {
      const workspaces =
        await Workspace.find({
          members: req.user.id,
        })
          .populate(
            "members",
            "name email"
          )
          .populate(
            "owner",
            "name email"
          );

      res.json(workspaces);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to fetch workspaces",
      });
    }
  };

/* CREATE */
export const createWorkspace =
  async (req, res) => {
    try {
      const workspace =
        await Workspace.create({
          name: req.body.name,

          description:
            req.body.description,

          owner: req.user.id,

          members: [
            req.user.id,
          ],
        });

      const populated =
        await workspace.populate(
          "members owner",
          "name email"
        );

      res.status(201).json(
        populated
      );
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to create workspace",
      });
    }
  };

/* INVITE MEMBER */
export const inviteMember =
  async (req, res) => {
    try {
      const workspace =
        await Workspace.findById(
          req.params.id
        );

      if (!workspace) {
        return res
          .status(404)
          .json({
            message:
              "Workspace not found",
          });
      }

      const user =
        await User.findOne({
          email:
            req.body.email.toLowerCase(),
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      const exists =
        workspace.members.some(
          (m) =>
            m.toString() ===
            user._id.toString()
        );

      if (exists) {
        return res
          .status(400)
          .json({
            message:
              "Already member",
          });
      }

      workspace.members.push(
        user._id
      );

      await workspace.save();

      const populated =
        await workspace.populate(
          "members owner",
          "name email"
        );

      res.json(populated);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to invite member",
      });
    }
  };