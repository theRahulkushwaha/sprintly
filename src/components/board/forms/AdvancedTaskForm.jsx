import { useState, useEffect } from "react";
import {
  Calendar,
  Link2,
  User,
  Flag,
  Users,
} from "lucide-react";
import { useTaskStore } from "../../../store/useTaskStore";
import API from "../../../services/api";
import { useAuthStore } from "../../../store/useAuthStore";

const priorities = ["low", "medium", "high"];

const priorityStyles = {
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdvancedTaskForm({
  column,
  projectId,
  onClose,
}) {
  const { addTask } = useTaskStore();
  const { user } = useAuthStore();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTeams, setFetchingTeams] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [assignedToName, setAssignedToName] = useState("");
  const [workspaceTeam, setWorkspaceTeam] = useState("");

  useEffect(() => {
    fetchUserTeams();
  }, []);

  const fetchUserTeams = async () => {
    try {
      setFetchingTeams(true);
      const res = await API.get("/teams/my-teams");
      console.log("Fetched teams:", res.data);
      setTeams(res.data);
      if (res.data.length > 0) {
        setWorkspaceTeam(res.data[0]._id);
      }
    } catch (err) {
      console.error("Fetch teams error:", err);
    } finally {
      setFetchingTeams(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }
    if (!workspaceTeam) {
      alert("Please select a team first");
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title,
        description,
        priority,
        dueDate: dueDate || null,
        resourceLink,
        assignedToName,
        assignedTo: null,
        projectId,
        columnId: column.id,
        workspaceTeam,
      };
      console.log("Creating task:", taskData);
      await addTask(taskData);
      onClose();
    } catch (err) {
      console.error("Create task error:", err);
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-4 space-y-4">
      {/* TITLE */}
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60"
      />

      {/* DESCRIPTION */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none focus:border-indigo-500/60"
      />

      {/* TEAM SELECTION */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users size={13} className="text-white/30" />
          <span className="text-xs text-white/40">Assign to Team *</span>
        </div>
        {fetchingTeams ? (
          <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 text-sm">
            Loading teams...
          </div>
        ) : teams.length === 0 ? (
          <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 text-sm">
            No teams available. Please ask your manager to add you to a team.
          </div>
        ) : (
          <select
            value={workspaceTeam}
            onChange={(e) => setWorkspaceTeam(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60"
          >
            {teams.map((team) => (
              <option key={team._id} value={team._id} className="bg-[#1a1a24]">
                {team.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* PRIORITY */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Flag size={13} className="text-white/30" />
          <span className="text-xs text-white/40">Priority</span>
        </div>
        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
                priority === p
                  ? priorityStyles[p]
                  : "bg-white/5 border-white/10 text-white/30"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* DUE DATE */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={13} className="text-white/30" />
          <span className="text-xs text-white/40">Deadline</span>
        </div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60"
        />
      </div>

      {/* ASSIGNEE */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User size={13} className="text-white/30" />
          <span className="text-xs text-white/40">Assign To</span>
        </div>
        <input
          value={assignedToName}
          onChange={(e) => setAssignedToName(e.target.value)}
          placeholder="Developer name"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60"
        />
      </div>

      {/* RESOURCE */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link2 size={13} className="text-white/30" />
          <span className="text-xs text-white/40">Resource Link</span>
        </div>
        <input
          value={resourceLink}
          onChange={(e) => setResourceLink(e.target.value)}
          placeholder="https://..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/60"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSubmit}
          disabled={loading || !workspaceTeam || fetchingTeams}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm transition-all"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
        <button
          onClick={onClose}
          className="px-4 bg-white/5 hover:bg-white/10 text-white/40 rounded-xl text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}