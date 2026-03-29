import { Home, Layers, Settings, LogOut, Zap } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { motion } from "framer-motion";

export default function Sidebar() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/board", icon: Layers, label: "Board" },
  ];

  return (
    <div className="w-[72px] bg-[#0f0f13] border-r border-white/5 flex flex-col items-center py-5 gap-2 shrink-0">
      <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center mb-4 shrink-0">
        <Zap size={16} className="text-white" fill="white" />
      </div>

      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} title={label}
          className={({ isActive }) =>
            `w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-white/25 hover:text-white/60 hover:bg-white/5"
            }`
          }
        >
          <Icon size={18} />
        </NavLink>
      ))}

      <div className="mt-auto flex flex-col items-center gap-3">
        <button title="Settings" className="w-10 h-10 rounded-xl flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all">
          <Settings size={18} />
        </button>

        <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-bold uppercase" title={user?.name}>
          {user?.name?.[0] || "U"}
        </div>

        <button onClick={handleLogout} title="Logout"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}