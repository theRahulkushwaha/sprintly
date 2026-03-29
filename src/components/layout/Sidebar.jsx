import { Home, Layers, Settings, LogOut, Zap, Plus, FolderKanban } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const { logout, user } = useAuthStore();
  const { projects, activeProject, fetchProjects, setActiveProject, createProject } = useProjectStore();
  const navigate = useNavigate();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => { fetchProjects(); }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    await createProject({ name: newProjectName.trim() });
    setNewProjectName("");
    setShowNewProject(false);
  };

  const projectColors = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444"];

  return (
    <div className="w-64 bg-[#0a0a0f] border-r border-white/5 flex flex-col py-5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 mb-8">
        <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
          <Zap size={14} className="text-white" fill="white" />
        </div>
        <span className="text-white font-bold tracking-tight">Sprintly</span>
      </div>

      {/* Nav */}
      <div className="px-3 space-y-1 mb-6">
        {[
          { to: "/dashboard", icon: Home, label: "Dashboard" },
          { to: "/board", icon: Layers, label: "Board" },
          { to: "/settings", icon: Settings, label: "Settings" },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive ? "bg-indigo-500/15 text-indigo-400 font-medium" : "text-white/35 hover:text-white/70 hover:bg-white/5"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </div>

      {/* Projects */}
      <div className="px-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-white/25 text-xs uppercase tracking-wider font-medium">Projects</span>
          <button onClick={() => setShowNewProject(true)}
            className="w-5 h-5 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all">
            <Plus size={11} />
          </button>
        </div>

        <AnimatePresence>
          {showNewProject && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-2 overflow-hidden">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <input autoFocus value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateProject(); if (e.key === "Escape") setShowNewProject(false); }}
                  placeholder="Project name..."
                  className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none mb-2" />
                <div className="flex gap-2">
                  <button onClick={handleCreateProject} className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg">Create</button>
                  <button onClick={() => setShowNewProject(false)} className="text-white/30 text-xs px-2 py-1.5">Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-0.5">
          {projects.map((project) => (
            <button key={project._id}
              onClick={() => { setActiveProject(project); navigate("/board"); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                activeProject?._id === project._id ? "bg-white/8 text-white/80" : "text-white/30 hover:text-white/60 hover:bg-white/4"
              }`}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: project.color || "#6366f1" }} />
              <span className="truncate">{project.name}</span>
            </button>
          ))}
          {projects.length === 0 && (
            <p className="text-white/15 text-xs px-3 py-2">No projects yet</p>
          )}
        </div>
      </div>

      {/* User + Logout */}
      <div className="px-3 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-medium truncate">{user?.name}</p>
            <p className="text-white/25 text-xs truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="text-white/20 hover:text-red-400 transition-all shrink-0">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}