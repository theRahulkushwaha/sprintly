import Meeting from "../models/Meeting.js";
import User from "../models/User.js";

// Create Jitsi Meet link (works without moderator, first person becomes host)
const createMeetingLink = () => {
  // Create a unique room name
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const roomName = `sprintly-${timestamp}-${randomId}`;
  
  // Jitsi Meet URL - first person to join becomes the moderator
  return `https://meet.jit.si/${roomName}`;
};

// Get all meetings
export const getMeetings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const meetings = await Meeting.find({
      organization: user.organization,
      $or: [
        { organizer: req.user.id },
        { "participants.user": req.user.id },
      ],
    })
      .populate("organizer", "name email")
      .populate("participants.user", "name email")
      .populate("projectId", "name color")
      .populate("taskId", "title")
      .sort({ scheduledTime: 1 });

    res.json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
};

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const { title, description, scheduledTime, duration, participants, projectId, taskId } = req.body;
    const user = await User.findById(req.user.id);

    if (!title || !scheduledTime) {
      return res.status(400).json({ message: "Title and scheduled time are required" });
    }

    const startTime = new Date(scheduledTime);
    
    // Generate meeting link
    const meetLink = createMeetingLink();

    // Prepare participants array
    const participantList = [];
    if (participants && participants.length > 0) {
      for (const p of participants) {
        const participantUser = await User.findOne({ email: p.email });
        if (participantUser) {
          participantList.push({
            user: participantUser._id,
            email: participantUser.email,
            name: participantUser.name,
            status: "pending",
          });
        } else {
          participantList.push({
            email: p.email,
            name: p.name || p.email,
            status: "pending",
          });
        }
      }
    }

    const meeting = await Meeting.create({
      title,
      description: description || "",
      meetLink,
      scheduledTime: startTime,
      duration: duration || 60,
      organizer: req.user.id,
      organizerName: user.name,
      participants: participantList,
      projectId: projectId || null,
      taskId: taskId || null,
      organization: user.organization,
      status: "scheduled",
    });

    const populated = await meeting.populate([
      "organizer",
      "participants.user",
      "projectId",
      "taskId",
    ]);

    res.status(201).json(populated);
  } catch (err) {
    console.error("Create meeting error:", err);
    res.status(500).json({ message: "Failed to create meeting" });
  }
};

// Delete meeting
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const user = await User.findById(req.user.id);
    if (meeting.organizer.toString() !== req.user.id && user.role !== "admin") {
      return res.status(403).json({ message: "Only organizer can delete meeting" });
    }

    await meeting.deleteOne();
    res.json({ message: "Meeting deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete meeting" });
  }
};