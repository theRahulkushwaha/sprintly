import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { Trash2, Edit2, Check, User, Lock, FolderKanban } from "lucide-react";
import API from "../services/api";

const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];
const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "projects", label: "Projects", icon: FolderKanban },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { projects, updateProject, deleteProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");

  const startEdit = (p) => { setEditingId(p._id); setEditForm({ name: p.name, description: p.description, color: p.color }); };
  const saveEdit = async () => { await updateProject(editingId, editForm); setEditingId(null); };

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

            {/* Profile Tab */}
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
                    { label: "Full Name", value: user?.name },
                    { label: "Email Address", value: user?.email },
                    { label: "Role", value: "Member" },
                    { label: "Member Since", value: new Date().getFullYear().toString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-4">
                      <p className="text-white/30 text-xs uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-white/70 text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
                <h2 className="text-white text-xl font-semibold mb-1">Change Password</h2>
                <p className="text-white/30 text-sm mb-8">Update your account password</p>

                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
                  {[
                    { key: "current", label: "Current Password", placeholder: "Enter current password" },
                    { key: "next", label: "New Password", placeholder: "Enter new password (min 6 chars)" },
                    { key: "confirm", label: "Confirm New Password", placeholder: "Confirm new password" },
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

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-white text-xl font-semibold mb-1">Manage Projects</h2>
                <p className="text-white/30 text-sm mb-8">Edit or delete your projects</p>

                {projects.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                      <FolderKanban size={24} className="text-white/20" />
                    </div>
                    <p className="text-white/30 text-sm">No projects yet. Create one from the sidebar.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {projects.map((p) => (
                    <div key={p._id} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                      {editingId === p._id ? (
                        <div className="space-y-3">
                          <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-xl text-sm outline-none focus:border-indigo-500/60" />
                          <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={2} placeholder="Description..."
                            className="w-full bg-white/5 border border-white/10 text-white/60 px-3 py-2 rounded-xl text-sm outline-none resize-none focus:border-indigo-500/60" />
                          <div className="flex gap-2 flex-wrap">
                            {COLORS.map((c) => (
                              <button key={c} onClick={() => setEditForm({ ...editForm, color: c })}
                                className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${editForm.color === c ? "ring-2 ring-white/50 ring-offset-2 ring-offset-[#13131a] scale-110" : ""}`}
                                style={{ background: c }} />
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1">
                              <Check size={12} /> Save
                            </button>
                            <button onClick={() => setEditingId(null)} className="flex-1 text-white/30 text-xs py-2 bg-white/5 rounded-xl hover:bg-white/8 transition-all">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: p.color + "25", border: `1px solid ${p.color}40` }}>
                                <div className="w-3.5 h-3.5 rounded-full" style={{ background: p.color }} />
                              </div>
                              <div>
                                <p className="text-white/80 font-medium text-sm">{p.name}</p>
                                <p className="text-white/25 text-xs mt-0.5">
                                  {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all">
                                <Edit2 size={12} />
                              </button>
                              <button onClick={() => deleteProject(p._id)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/15 flex items-center justify-center text-white/30 hover:text-red-400 transition-all">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          {p.description && <p className="text-white/30 text-xs leading-relaxed">{p.description}</p>}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}