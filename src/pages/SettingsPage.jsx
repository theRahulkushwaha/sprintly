import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import { motion } from "framer-motion";
import { Trash2, Edit2, Check, X } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { projects, updateProject, deleteProject, activeProject } = useProjectStore();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const projectColors = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#06b6d4"];

  const handleEditStart = (project) => {
    setEditingId(project._id);
    setEditName(project.name);
  };

  const handleEditSave = async (id) => {
    if (editName.trim()) await updateProject(id, { name: editName.trim() });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this project and all its tasks?")) {
      await deleteProject(id);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Settings" />
        <div className="flex-1 overflow-y-auto p-6 max-w-2xl">

          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-5">
            <h2 className="text-white font-semibold mb-4">Profile</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold uppercase">
                {user?.name?.[0]}
              </div>
              <div>
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-white/30 text-sm">{user?.email}</p>
                <p className="text-indigo-400 text-xs mt-1 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full inline-block">Member</p>
              </div>
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Projects ({projects.length})</h2>
            <div className="space-y-2">
              {projects.map((project) => (
                <div key={project._id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                    {editingId === project._id ? (
                      <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(project._id); if (e.key === "Escape") setEditingId(null); }}
                        className="flex-1 bg-white/5 border border-indigo-500/40 text-white px-2 py-1 rounded-lg text-sm outline-none" />
                    ) : (
                      <span className="text-white/70 text-sm truncate">{project.name}</span>
                    )}
                  </div>

                  {/* Color picker */}
                  <div className="hidden group-hover:flex items-center gap-1">
                    {projectColors.map((c) => (
                      <button key={c} onClick={() => updateProject(project._id, { color: c })}
                        className="w-3.5 h-3.5 rounded-full transition-transform hover:scale-125"
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {editingId === project._id ? (
                      <>
                        <button onClick={() => handleEditSave(project._id)} className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-all">
                          <Check size={12} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg bg-white/5 text-white/30 flex items-center justify-center hover:bg-white/10 transition-all">
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditStart(project)} className="w-7 h-7 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 flex items-center justify-center transition-all">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDelete(project._id)} className="w-7 h-7 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all">
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-white/20 text-sm text-center py-6">No projects yet. Create one from the sidebar.</p>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}