import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRBAC, ROLES } from "../hooks/useRBAC";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import API from "../services/api";
import { Shield, UserCog, Users, Trash2, Edit2, Check, X } from "lucide-react";

export default function AdminPanel() {
  const { isAdmin } = useRBAC();
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [workspaceTeams, setWorkspaceTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchWorkspaceTeams();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkspaceTeams = async () => {
    try {
      const res = await API.get("/workspace-teams");
      setWorkspaceTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await API.put(`/auth/users/${userId}/role`, { role });
      fetchUsers();
      setEditingRole(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await API.delete(`/auth/users/${userId}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addToWorkspaceTeam = async (userId, teamId) => {
    try {
      await API.post(`/workspace-teams/${teamId}/members`, { userId });
      alert("User added to team successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add user to team");
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-screen bg-[#0f0f13] items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-semibold">Access Denied</h2>
          <p className="text-white/40 mt-2">Admin privileges required</p>
        </div>
      </div>
    );
  }

  const roleColors = {
    admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    manager: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    developer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Admin Panel" />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <UserCog size={24} className="text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">User Management</h1>
                  <p className="text-white/40 text-sm mt-1">Manage team members, roles, and workspace assignments</p>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-white/8 bg-white/[0.02]">
                  <tr>
                    <th className="text-left px-6 py-4 text-white/40 text-xs font-semibold uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-white/40 text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-white/40 text-xs font-semibold uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-white/40 text-xs font-semibold uppercase tracking-wider">Workspace Teams</th>
                    <th className="text-left px-6 py-4 text-white/40 text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                            {u.name?.[0] || "U"}
                          </div>
                          <span className="text-white font-medium">{u.name}</span>
                          {u._id === user?._id && (
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">You</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">{u.email}</td>
                      <td className="px-6 py-4">
                        {editingRole === u._id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white outline-none"
                            >
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="developer">Developer</option>
                            </select>
                            <button onClick={() => updateRole(u._id, selectedRole)} className="text-emerald-400">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setEditingRole(null)} className="text-red-400">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[u.role] || roleColors.developer}`}>
                              {u.role || "developer"}
                            </span>
                            <button onClick={() => {
                              setEditingRole(u._id);
                              setSelectedRole(u.role || "developer");
                            }} className="text-white/30 hover:text-white/60">
                              <Edit2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          onChange={(e) => addToWorkspaceTeam(u._id, e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>Add to team...</option>
                          {workspaceTeams.map(team => (
                            <option key={team._id} value={team._id}>{team.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {u._id !== user?._id && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="text-red-400 hover:text-red-300 transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Role Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                <Shield size={20} className="text-purple-400 mb-2" />
                <h3 className="text-white font-semibold">Admin</h3>
                <p className="text-white/40 text-xs mt-1">Full access, can delete users and manage everything</p>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <Users size={20} className="text-blue-400 mb-2" />
                <h3 className="text-white font-semibold">Manager</h3>
                <p className="text-white/40 text-xs mt-1">Can create workspace teams and assign members</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <UserCog size={20} className="text-emerald-400 mb-2" />
                <h3 className="text-white font-semibold">Developer</h3>
                <p className="text-white/40 text-xs mt-1">Can be assigned to workspace teams and sub-tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}