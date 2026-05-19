import { Search, Bell, Plus, User, Settings, LogOut, Shield, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRBAC } from "../../hooks/useRBAC";

export default function Topbar({ title, onAdd, addLabel = "Add Task" }) {
  const { user, logout } = useAuthStore();
  const { activeProject } = useProjectStore();
  const { isAdmin, userRole } = useRBAC();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-16 bg-[#0f0f13] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-white font-semibold">{title}</h1>
        {activeProject && (
          <>
            <span className="text-white/15">/</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProject.color || "#6366f1" }} />
              <span className="text-white/40 text-sm">{activeProject.name}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
          <Search size={13} className="text-white/25" />
          <input 
            placeholder="Search..." 
            className="bg-transparent text-white/60 placeholder-white/20 text-sm outline-none w-36" 
          />
        </div>

        {onAdd && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={14} />
            {addLabel}
          </button>
        )}

        <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/35 hover:text-white/60 transition-all relative">
          <Bell size={15} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-3 border-l border-white/8 hover:bg-white/5 rounded-xl transition-all pr-2 py-1"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                {user?.name?.[0] || "U"}
              </div>
              <div className="text-left">
                <p className="text-white/70 text-xs font-medium leading-none">{user?.name}</p>
                <p className="text-white/25 text-xs mt-0.5 capitalize">{userRole || "Developer"}</p>
              </div>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-white/10">
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-white/30 text-xs mt-0.5">{user?.email}</p>
                <p className="text-white/20 text-xs mt-2">
                  Organization: <span className="text-indigo-400">{user?.organization || "N/A"}</span>
                </p>
              </div>
              
              <div className="py-2">
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all"
                >
                  <Settings size={15} />
                  Profile Settings
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-purple-400 hover:bg-white/5 transition-all"
                  >
                    <Shield size={15} />
                    Admin Panel
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}