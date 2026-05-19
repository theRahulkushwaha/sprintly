import User from "../models/User.js";

export const getOrganization = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      name: user.organization,
      // You can add more fields to an Organization model if needed
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organization" });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { name, description, website, industry, size } = req.body;
    
    // Update all users in the organization
    const users = await User.find({ organization: req.user.organization });
    
    for (const user of users) {
      user.organization = name;
      await user.save();
    }
    
    res.json({ 
      message: "Organization updated successfully",
      organization: { name, description, website, industry, size }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update organization" });
  }
};