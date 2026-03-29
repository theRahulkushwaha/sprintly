import { Search, Bell, Plus } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export default function Topbar({ title = "Dashboard", onAdd }) {
  const { user } = useAuthStore();

  return (
    <div className="h-16 bg-[#0f0f13] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-white font-semibold text-lg">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
          <Search size={14} className="text-white/30" />
          <input placeholder="Search..." className="bg-transparent text-white/60 placeholder-white/20 text-sm outline-none w-44" />
        </div>

        {onAdd && (
          <button onClick={onAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20">
            <Plus size={14} />
            Add Task
          </button>
        )}

        <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white/70 transition-all relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-white/8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase">
            {user?.name?.[0] || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-xs font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-white/30 text-xs mt-0.5">Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}