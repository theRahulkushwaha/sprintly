import { Home, Layers, Settings, LogOut, Zap, Plus, FolderKanban } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useEffect, useState } from "react";
import NewProjectModal from "../projects/NewProjectModal";

export default function Sidebar() {
  const { logout, user } = useAuthStore();
  const { projects, fetchProjects, activeProject, setActiveProject } = useProjectStore();
  const navigate = useNavigate();
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <>
      <div className="w-64 bg-[#0a0a0f] border-r border-white/5 flex flex-col shrink-0 overflow-hidden">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="text-white font-bold tracking-tight">Sprintly</span>
        </div>

        {/* Nav */}
        <div className="px-3 py-4 space-y-1">
          {[
            { to: "/dashboard", icon: Home, label: "Dashboard" },
            { to: "/board", icon: Layers, label: "Board" },
            { to: "/settings", icon: Settings, label: "Settings" },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-400 font-medium"
                    : "text-white/35 hover:text-white/70 hover:bg-white/5"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Projects */}
        <div className="px-3 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-white/25 text-xs font-semibold uppercase tracking-wider">Projects</span>
            <button onClick={() => setShowNewProject(true)}
              className="w-5 h-5 rounded flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all">
              <Plus size={12} />
            </button>
          </div>

          <div className="space-y-0.5 overflow-y-auto flex-1">
            {projects.length === 0 && (
              <button onClick={() => setShowNewProject(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-white/20 hover:text-white/40 text-xs rounded-lg hover:bg-white/3 transition-all">
                <Plus size={12} /> Create your first project
              </button>
            )}
            {projects.map((p) => (
              <button key={p._id}
                onClick={() => { setActiveProject(p); navigate("/board"); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                  activeProject?._id === p._id
                    ? "bg-white/8 text-white/80"
                    : "text-white/35 hover:text-white/60 hover:bg-white/4"
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.color }} />
                <span className="truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User */}
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-sm font-medium truncate">{user?.name}</p>
              <p className="text-white/25 text-xs truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} title="Logout"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
    </>
  );
}