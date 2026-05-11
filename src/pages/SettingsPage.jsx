import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { Trash2, Edit2, Check, User, Lock, FolderKanban, UserPlus, UserMinus, AlertTriangle, Users } from "lucide-react";
import API from "../services/api";

import { useTaskStore } from "../store/useTaskStore"
import { AnimatePresence } from "framer-motion";

const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];
const ICONS  = ["🚀","💡","🎯","🛠️","📦","🎨","📊","🔥","⚡","🌿"];
const TABS = [
  { id: "profile",  label: "Profile",  icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "projects", label: "Projects", icon: FolderKanban },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { projects, updateProject, deleteProject, addMember, removeMember } = useProjectStore();
  const { tasks } = useTaskStore();

  const [activeTab,  setActiveTab]  = useState("profile");
  const [editingId,  setEditingId]  = useState(null);
  const [editForm,   setEditForm]   = useState({});
  const [pwForm,     setPwForm]     = useState({ current: "", next: "", confirm: "" });
  const [pwMsg,      setPwMsg]      = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); 
  const [memberEmail,   setMemberEmail]   = useState("");
  const [memberError,   setMemberError]   = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [openMembersId, setOpenMembersId] = useState(null);

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({ name: p.name, description: p.description || "", color: p.color, icon: p.icon || "🚀" });
  };
  const saveEdit = async () => { await updateProject(editingId, editForm); setEditingId(null); };

  const confirmDelete = (id) => setDeleteConfirm(id);
  const handleDelete  = async () => { await deleteProject(deleteConfirm); setDeleteConfirm(null); };

  const handleAddMember = async (projectId) => {
    if (!memberEmail.trim()) return;
    setMemberLoading(true);
    setMemberError("");
    try {
      await addMember(projectId, memberEmail.trim());
      setMemberEmail("");
    } catch (err) {
      setMemberError(err.response?.data?.message || "User not found");
    } finally {
      setMemberLoading(false);
    }
  };

  const changePassword = async () => {
    setPwMsg("");
    if (pwForm.next !== pwForm.confirm) { setPwMsg("Passwords don't match"); return; }
    if (pwForm.next.length < 6) { setPwMsg("Min 6 characters"); return; }
    try {
      await API.put("/auth/password", { currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwMsg("✅ Password updated successfully");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwMsg(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Settings" />

        <div className="flex-1 flex overflow-hidden">

          {/* Left tab nav */}
          <div className="w-56 border-r border-white/5 p-4 shrink-0">
            <p className="text-white/20 text-xs uppercase tracking-wider font-semibold px-3 mb-3">Settings</p>
            <div className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                    activeTab === id
                      ? "bg-indigo-500/15 text-indigo-400 font-medium"
                      : "text-white/35 hover:text-white/70 hover:bg-white/5"
                  }`}>
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">

            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
                <h2 className="text-white text-xl font-semibold mb-1">Profile</h2>
                <p className="text-white/30 text-sm mb-8">Your personal information</p>

                <div className="flex items-center gap-5 mb-8 p-6 bg-white/3 border border-white/8 rounded-2xl">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold uppercase shrink-0">
                    {user?.name?.[0]}
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold">{user?.name}</p>
                    <p className="text-white/40 text-sm mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-2 text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full">Member</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Full Name",      value: user?.name },
                    { label: "Email Address",  value: user?.email },
                    { label: "Role",           value: "Member" },
                    { label: "Member Since",   value: new Date().getFullYear().toString() },
                    { label: "Projects",       value: projects.length },
                    { label: "Total Tasks",    value: tasks.length },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-4">
                      <p className="text-white/30 text-xs uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-white/70 text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Password Tab ── */}
            {activeTab === "password" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
                <h2 className="text-white text-xl font-semibold mb-1">Change Password</h2>
                <p className="text-white/30 text-sm mb-8">Update your account password</p>

                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
                  {[
                    { key: "current", label: "Current Password",      placeholder: "Enter current password" },
                    { key: "next",    label: "New Password",           placeholder: "Enter new password (min 6 chars)" },
                    { key: "confirm", label: "Confirm New Password",   placeholder: "Confirm new password" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">{label}</label>
                      <input type="password" placeholder={placeholder} value={pwForm[key]}
                        onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all" />
                    </div>
                  ))}

                  {pwMsg && (
                    <p className={`text-sm px-4 py-3 rounded-xl border ${
                      pwMsg.startsWith("✅")
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-red-400 bg-red-500/10 border-red-500/20"
                    }`}>{pwMsg}</p>
                  )}

                  <button onClick={changePassword}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-3 rounded-xl transition-all font-medium shadow-lg shadow-indigo-600/20 mt-2">
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Projects Tab ── */}
            {activeTab === "projects" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-white text-xl font-semibold mb-1">Manage Projects</h2>
                <p className="text-white/30 text-sm mb-8">Edit, manage members, or delete your projects</p>

                {projects.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                      <FolderKanban size={24} className="text-white/20" />
                    </div>
                    <p className="text-white/30 text-sm">No projects yet. Create one from the sidebar.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {projects.map((p) => {
                    const projectTasks = tasks.filter(t => t.projectId === p._id);
                    const doneTasks    = projectTasks.filter(t => t.columnId === "done");
                    const pct = projectTasks.length ? Math.round((doneTasks.length / projectTasks.length) * 100) : 0;

                    return (
                      <div key={p._id} className="bg-white/3 border border-white/8 rounded-2xl p-5">

                        {editingId === p._id ? (
                          /* ── Edit form ── */
                          <div className="space-y-3">
                            <input value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              placeholder="Project name"
                              className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-sm outline-none focus:border-indigo-500/60" />
                            <textarea value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              rows={2} placeholder="Description..."
                              className="w-full bg-white/5 border border-white/10 text-white/60 px-3 py-2 rounded-xl text-sm outline-none resize-none focus:border-indigo-500/60" />

                            {/* Icon row */}
                            <div>
                              <p className="text-white/25 text-xs mb-1.5">Icon</p>
                              <div className="flex gap-1.5 flex-wrap">
                                {ICONS.map(ic => (
                                  <button key={ic} onClick={() => setEditForm({ ...editForm, icon: ic })}
                                    className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                                      editForm.icon === ic ? "bg-white/15 ring-1 ring-white/30" : "bg-white/5 hover:bg-white/10"
                                    }`}>{ic}</button>
                                ))}
                              </div>
                            </div>

                            {/* Color row */}
                            <div className="flex gap-2 flex-wrap">
                              {COLORS.map((c) => (
                                <button key={c} onClick={() => setEditForm({ ...editForm, color: c })}
                                  className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${
                                    editForm.color === c ? "ring-2 ring-white/50 ring-offset-2 ring-offset-[#13131a] scale-110" : ""
                                  }`}
                                  style={{ background: c }} />
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <button onClick={saveEdit}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1">
                                <Check size={12} /> Save
                              </button>
                              <button onClick={() => setEditingId(null)}
                                className="flex-1 text-white/30 text-xs py-2 bg-white/5 rounded-xl hover:bg-white/8 transition-all">
                                Cancel
                              </button>
                            </div>
                          </div>

                        ) : (
                          /* ── View card ── */
                          <>
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                                  style={{ background: p.color + "25", border: `1px solid ${p.color}35` }}>
                                  {p.icon || "🚀"}
                                </div>
                                <div>
                                  <p className="text-white/85 font-semibold text-sm">{p.name}</p>
                                  <p className="text-white/25 text-xs mt-0.5">
                                    Created {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1.5">
                                <button onClick={() => setOpenMembersId(openMembersId === p._id ? null : p._id)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                    openMembersId === p._id
                                      ? "bg-indigo-500/20 text-indigo-400"
                                      : "bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60"
                                  }`}>
                                  <Users size={12} />
                                </button>
                                <button onClick={() => startEdit(p)}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all">
                                  <Edit2 size={12} />
                                </button>
                                <button onClick={() => confirmDelete(p._id)}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/15 flex items-center justify-center text-white/30 hover:text-red-400 transition-all">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {p.description && (
                              <p className="text-white/30 text-xs leading-relaxed mb-4">{p.description}</p>
                            )}

                            {/* Task stats */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {[
                                { label: "Total",    value: projectTasks.length,                      color: "text-white/60" },
                                { label: "Active",   value: projectTasks.filter(t => t.columnId !== "done").length, color: "text-amber-400" },
                                { label: "Done",     value: doneTasks.length,                          color: "text-emerald-400" },
                              ].map(s => (
                                <div key={s.label} className="bg-white/3 rounded-xl p-2.5 text-center">
                                  <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                                  <p className="text-white/25 text-xs">{s.label}</p>
                                </div>
                              ))}
                            </div>

                            {/* Progress bar */}
                            <div className="mb-1">
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-white/25">Completion</span>
                                <span className="text-white/40 font-medium">{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div className="h-full rounded-full"
                                  style={{ background: p.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.6 }} />
                              </div>
                            </div>

                            {/* Members panel */}
                            <AnimatePresence>
                              {openMembersId === p._id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden">
                                  <div className="mt-4 pt-4 border-t border-white/8 space-y-3">
                                    <p className="text-white/30 text-xs uppercase tracking-wider">Members ({p.members?.length || 0})</p>

                                    {/* Member list */}
                                    <div className="space-y-2">
                                      {(p.members || []).map((m) => (
                                        <div key={m._id || m} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                                              {m.name?.[0] || "?"}
                                            </div>
                                            <div>
                                              <p className="text-white/60 text-xs font-medium">{m.name || "Unknown"}</p>
                                              <p className="text-white/20 text-xs">{m.email || ""}</p>
                                            </div>
                                          </div>
                                          {m._id?.toString() !== p.owner?.toString() && (
                                            <button onClick={() => removeMember(p._id, m._id)}
                                              className="w-6 h-6 rounded-lg flex items-center justify-center text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                              <UserMinus size={11} />
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>

                                    {/* Add member */}
                                    <div className="flex gap-2">
                                      <input value={memberEmail}
                                        onChange={(e) => { setMemberEmail(e.target.value); setMemberError(""); }}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddMember(p._id)}
                                        placeholder="Email address..."
                                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2 rounded-xl outline-none focus:border-indigo-500/50 text-xs transition-all" />
                                      <button onClick={() => handleAddMember(p._id)} disabled={memberLoading}
                                        className="w-8 h-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl flex items-center justify-center text-white transition-all shrink-0">
                                        <UserPlus size={12} />
                                      </button>
                                    </div>
                                    {memberError && <p className="text-red-400 text-xs">{memberError}</p>}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-[#1a1a24] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={22} className="text-red-400" />
              </div>
              <h3 className="text-white font-semibold text-center mb-2">Delete Project?</h3>
              <p className="text-white/35 text-sm text-center mb-6 leading-relaxed">
                This will permanently delete the project and all its tasks. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white/40 hover:text-white/70 text-sm transition-all">
                  Cancel
                </button>
                <button onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-medium text-sm transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}