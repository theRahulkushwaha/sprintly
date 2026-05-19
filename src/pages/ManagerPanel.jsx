import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRBAC } from "../hooks/useRBAC";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import API from "../services/api";
import {
  Users,
  Plus,
  Trash2,
  UserPlus,
  UserMinus,
  FolderKanban,
  X,
  Edit2,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ManagerPanel() {
  const { user } = useAuthStore();
  const { isAdmin, isManager } = useRBAC();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMemberTeam, setSelectedMemberTeam] = useState({});
  const [selectedProjectTeam, setSelectedProjectTeam] = useState({});
  const [editingTeam, setEditingTeam] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (isAdmin || isManager) {
      fetchData();
    }
  }, [isAdmin, isManager]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, usersRes, projectsRes] = await Promise.all([
        API.get("/teams"),
        API.get("/auth/users"),
        API.get("/projects"),
      ]);
      setTeams(teamsRes.data || []);
      setUsers(usersRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) return;
    
    try {
      const res = await API.post("/teams", {
        name: newTeamName,
        description: newTeamDesc,
      });
      setTeams([res.data, ...teams]);
      setShowCreateTeam(false);
      setNewTeamName("");
      setNewTeamDesc("");
    } catch (err) {
      console.error("Create team error:", err);
    }
  };

  const updateTeam = async (teamId) => {
    if (!editForm.name.trim()) return;
    
    try {
      const res = await API.put(`/teams/${teamId}`, {
        name: editForm.name,
        description: editForm.description,
      });
      setTeams(teams.map(t => t._id === teamId ? res.data : t));
      setEditingTeam(null);
    } catch (err) {
      console.error("Update team error:", err);
    }
  };

  const addMemberToTeam = async (teamId) => {
    const userId = selectedMemberTeam[teamId];
    if (!userId) return;
    
    try {
      await API.post(`/teams/${teamId}/members`, { userId });
      await fetchData();
      setSelectedMemberTeam({ ...selectedMemberTeam, [teamId]: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const removeMemberFromTeam = async (teamId, userId) => {
    if (!window.confirm("Remove this member from the team?")) return;
    
    try {
      await API.delete(`/teams/${teamId}/members/${userId}`);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const assignProjectToTeam = async (teamId) => {
    const projectId = selectedProjectTeam[teamId];
    if (!projectId) return;
    
    try {
      await API.post(`/teams/${teamId}/projects`, { projectId });
      await fetchData();
      setSelectedProjectTeam({ ...selectedProjectTeam, [teamId]: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTeam = async (teamId) => {
    if (!window.confirm("Delete this team? This action cannot be undone.")) return;
    
    try {
      await API.delete(`/teams/${teamId}`);
      setTeams(teams.filter(t => t._id !== teamId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin && !isManager) {
    return (
      <div className="flex h-screen bg-[#0f0f13] items-center justify-center">
        <div className="text-center">
          <Users size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold">Access Denied</h2>
          <p className="text-white/40 mt-2">Manager or Admin privileges required</p>
        </div>
      </div>
    );
  }

  const organizationUsers = users.filter(u => u.organization === user?.organization && u._id !== user?._id);
  
  const getAvailableMembers = (team) => {
    const memberIds = team.members?.map(m => m._id) || [];
    return organizationUsers.filter(u => !memberIds.includes(u._id));
  };

  const getAvailableProjects = (team) => {
    const assignedProjectIds = team.projects?.map(p => p._id) || [];
    return projects.filter(p => !assignedProjectIds.includes(p._id));
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Manager Panel" />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Teams</h1>
                <p className="text-white/40 mt-1">Create and manage teams, assign members and projects</p>
              </div>
              <button
                onClick={() => setShowCreateTeam(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all"
              >
                <Plus size={18} />
                Create Team
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/30">Loading teams...</p>
              </div>
            )}

            {/* Teams Grid */}
            {!loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map((team) => (
                  <div key={team._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    {/* Team Header */}
                    <div className="p-6 border-b border-white/10">
                      {editingTeam === team._id ? (
                        <div className="space-y-3">
                          <input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                            placeholder="Team name"
                          />
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                            rows={2}
                            placeholder="Description"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => updateTeam(team._id)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                              <Check size={14} /> Save
                            </button>
                            <button onClick={() => setEditingTeam(null)} className="flex-1 bg-white/5 text-white/60 py-2 rounded-lg text-sm">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h2 className="text-white text-xl font-semibold">{team.name}</h2>
                              <button onClick={() => {
                                setEditingTeam(team._id);
                                setEditForm({ name: team.name, description: team.description || "" });
                              }} className="text-white/30 hover:text-white/60">
                                <Edit2 size={14} />
                              </button>
                            </div>
                            {team.description && (
                              <p className="text-white/40 text-sm mt-1">{team.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteTeam(team._id)}
                            className="text-white/30 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                      <div className="mt-3">
                        <p className="text-white/30 text-xs">
                          Manager: {team.manager?.name} • {team.members?.length || 1} members
                        </p>
                      </div>
                    </div>

                    {/* Members Section */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white/70 text-sm font-semibold">Team Members</h3>
                        <div className="flex gap-2">
                          <select
                            value={selectedMemberTeam[team._id] || ""}
                            onChange={(e) => setSelectedMemberTeam({ ...selectedMemberTeam, [team._id]: e.target.value })}
                            className="bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                          >
                            <option value="" className="bg-[#1a1a24] text-white/70">Select member...</option>
                            {getAvailableMembers(team).map((u) => (
                              <option key={u._id} value={u._id} className="bg-[#1a1a24] text-white">
                                {u.name} ({u.role})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => addMemberToTeam(team._id)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm flex items-center gap-1"
                          >
                            <UserPlus size={14} /> Add
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {team.members?.map((member) => (
                          <div key={member._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                                {member.name?.[0] || "U"}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{member.name}</p>
                                <p className="text-white/30 text-xs capitalize">{member.role}</p>
                              </div>
                            </div>
                            {member._id !== team.manager?._id && (
                              <button
                                onClick={() => removeMemberFromTeam(team._id, member._id)}
                                className="text-white/30 hover:text-red-400 transition-all"
                              >
                                <UserMinus size={14} />
                              </button>
                            )}
                            {member._id === team.manager?._id && (
                              <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">Team Lead</span>
                            )}
                          </div>
                        ))}
                        {(!team.members || team.members.length === 0) && (
                          <p className="text-white/30 text-sm text-center py-4">No members yet</p>
                        )}
                      </div>
                    </div>

                    {/* Projects Section */}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white/70 text-sm font-semibold">Assigned Projects</h3>
                        <div className="flex gap-2">
                          <select
                            value={selectedProjectTeam[team._id] || ""}
                            onChange={(e) => setSelectedProjectTeam({ ...selectedProjectTeam, [team._id]: e.target.value })}
                            className="bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500"
                          >
                            <option value="" className="bg-[#1a1a24] text-white/70">Select project...</option>
                            {getAvailableProjects(team).map((p) => (
                              <option key={p._id} value={p._id} className="bg-[#1a1a24] text-white">
                                {p.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => assignProjectToTeam(team._id)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm flex items-center gap-1"
                          >
                            <FolderKanban size={14} /> Assign
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {team.projects?.map((project) => (
                          <span
                            key={project._id}
                            className="px-3 py-1.5 rounded-lg text-xs"
                            style={{ background: `${project.color}20`, color: project.color }}
                          >
                            {project.name}
                          </span>
                        ))}
                        {(!team.projects || team.projects.length === 0) && (
                          <p className="text-white/30 text-sm">No projects assigned</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && teams.length === 0 && (
              <div className="text-center py-20">
                <Users size={48} className="text-white/20 mx-auto mb-4" />
                <p className="text-white/30">No teams yet. Create your first team!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateTeam(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a24] border border-white/10 w-full max-w-md rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">Create Team</h2>
                <button onClick={() => setShowCreateTeam(false)} className="text-white/40 hover:text-white/70">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Team name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500"
                  autoFocus
                />
                <textarea
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="Description (optional)"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={createTeam}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition-all"
                >
                  Create Team
                </button>
                <button
                  onClick={() => setShowCreateTeam(false)}
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