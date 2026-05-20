import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Video,
  Users,
  Plus,
  X,
  Trash2,
  ExternalLink,
  Info,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import API from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

export default function MeetingsPage() {
  const { user } = useAuthStore();
  const [meetings, setMeetings] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledTime: "",
    duration: 60,
    participants: [],
  });

  const [participantEmail, setParticipantEmail] = useState("");

  useEffect(() => {
    fetchMeetings();
    fetchUsers();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await API.get("/meetings");
      setMeetings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createMeeting = async () => {
    if (!formData.title.trim() || !formData.scheduledTime) {
      alert("Please fill in title and scheduled time");
      return;
    }

    try {
      const res = await API.post("/meetings", formData);
      setMeetings([res.data, ...meetings]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        scheduledTime: "",
        duration: 60,
        participants: [],
      });
      setParticipantEmail("");
      alert("Meeting scheduled successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create meeting");
    }
  };

  const deleteMeeting = async (meetingId) => {
    if (window.confirm("Delete this meeting?")) {
      try {
        await API.delete(`/meetings/${meetingId}`);
        setMeetings(meetings.filter(m => m._id !== meetingId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addParticipant = () => {
    if (!participantEmail.trim()) return;
    if (formData.participants.some(p => p.email === participantEmail)) {
      alert("Participant already added");
      return;
    }
    setFormData({
      ...formData,
      participants: [...formData.participants, { email: participantEmail, name: participantEmail.split("@")[0] }],
    });
    setParticipantEmail("");
  };

  const removeParticipant = (email) => {
    setFormData({
      ...formData,
      participants: formData.participants.filter(p => p.email !== email),
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (meeting) => {
    const now = new Date();
    const meetingTime = new Date(meeting.scheduledTime);
    const meetingEnd = new Date(meetingTime.getTime() + meeting.duration * 60000);

    if (meeting.status === "cancelled") {
      return <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">Cancelled</span>;
    }
    if (now > meetingEnd) {
      return <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">Completed</span>;
    }
    if (now >= meetingTime && now <= meetingEnd) {
      return <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Ongoing</span>;
    }
    return <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">Upcoming</span>;
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Meetings" />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Team Meetings</h1>
                <p className="text-white/40 mt-1">Schedule and join video meetings</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all"
              >
                <Plus size={18} />
                Schedule Meeting
              </button>
            </div>

            {/* Info Box */}
            <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-blue-400 mt-0.5" />
                <div>
                  <p className="text-blue-400 text-sm font-medium">How to join meetings:</p>
                  <p className="text-white/40 text-sm mt-1">
                    1. Click "Join Meet" button when it's time for the meeting<br/>
                    2. The first person to join will be the meeting host<br/>
                    3. Allow camera and microphone access when prompted<br/>
                    4. Share the meeting link with participants to join
                  </p>
                </div>
              </div>
            </div>

            {/* Meetings List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/30">Loading meetings...</p>
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                <Video size={48} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/30">No meetings scheduled. Create your first meeting!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <motion.div
                    key={meeting._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-white font-semibold text-lg">{meeting.title}</h3>
                          {getStatusBadge(meeting)}
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">Jitsi Meet</span>
                        </div>
                        
                        {meeting.description && (
                          <p className="text-white/40 text-sm mb-3">{meeting.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm mb-3">
                          <div className="flex items-center gap-2 text-white/40">
                            <Calendar size={14} />
                            {formatDate(meeting.scheduledTime)}
                          </div>
                          <div className="flex items-center gap-2 text-white/40">
                            <Clock size={14} />
                            {meeting.duration} minutes
                          </div>
                          <div className="flex items-center gap-2 text-white/40">
                            <Users size={14} />
                            {meeting.participants?.length || 0} participants
                          </div>
                        </div>
                        
                        {/* Participants */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-white/30 text-xs">Organizer: {meeting.organizer?.name}</span>
                          {meeting.participants?.map((p, idx) => (
                            <span key={idx} className="text-white/30 text-xs">
                              {p.name || p.email}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <a
                          href={meeting.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm flex items-center gap-2 transition-all"
                        >
                          <Video size={14} />
                          Join Meet
                          <ExternalLink size={12} />
                        </a>
                        <button
                          onClick={() => deleteMeeting(meeting._id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Meeting Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a24] border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">Schedule Meeting</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white/70">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Meeting title"
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                />
                
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description (optional)"
                  rows={2}
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 resize-none"
                />
                
                <input
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                />
                
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
                
                {/* Meeting Info */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-xs font-medium mb-1">Meeting Platform: Jitsi Meet</p>
                  <p className="text-white/30 text-xs">✓ No account required</p>
                  <p className="text-white/30 text-xs">✓ Works in any browser</p>
                  <p className="text-white/30 text-xs">✓ First person to join becomes host</p>
                </div>
                
                {/* Add Participants */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Invite Participants (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      value={participantEmail}
                      onChange={(e) => setParticipantEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addParticipant()}
                      placeholder="Enter email address"
                      className="flex-1 bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={addParticipant}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 space-y-1">
                    {formData.participants.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-1.5">
                        <span className="text-white/60 text-sm">{p.email}</span>
                        <button onClick={() => removeParticipant(p.email)} className="text-white/30 hover:text-red-400">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createMeeting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition-all"
                >
                  Schedule Meeting
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}