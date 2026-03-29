import { Search, Bell, Plus } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useProjectStore } from "../../store/useProjectStore";

export default function Topbar({ title, onAdd, addLabel = "Add Task" }) {
  const { user } = useAuthStore();
  const { activeProject } = useProjectStore();

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
          <input placeholder="Search..." className="bg-transparent text-white/60 placeholder-white/20 text-sm outline-none w-36" />
        </div>

        {onAdd && (
          <button onClick={onAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20">
            <Plus size={14} />
            {addLabel}
          </button>
        )}

        <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/35 hover:text-white/60 transition-all relative">
          <Bell size={15} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-white/8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <p className="text-white/70 text-xs font-medium leading-none">{user?.name}</p>
            <p className="text-white/25 text-xs mt-0.5">Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}