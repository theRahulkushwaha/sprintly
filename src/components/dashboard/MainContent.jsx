import { useTaskStore } from "../../store/useTaskStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle, TrendingUp, Zap } from "lucide-react";

export default function MainContent() {
  const { tasks, fetchTasks } = useTaskStore();
  const { user } = useAuthStore();

  useEffect(() => { fetchTasks(); }, []);

  const todo = tasks.filter((t) => t.columnId === "todo");
  const progress = tasks.filter((t) => t.columnId === "progress");
  const done = tasks.filter((t) => t.columnId === "done");
  const total = tasks.length || 1;
  const percent = Math.round((done.length / total) * 100);

  const stats = [
    { label: "To Do", value: todo.length, icon: Circle, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
    { label: "In Progress", value: progress.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Done", value: done.length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Tasks", value: tasks.length, icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
        <h2 className="text-white text-2xl font-bold">Good day, {user?.name?.split(" ")[0]} 👋</h2>
        <p className="text-white/30 text-sm mt-1">Here's what's happening with your projects today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, border }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`bg-white/3 border ${border} rounded-2xl p-5`}>
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-white text-2xl font-bold">{value}</p>
            <p className="text-white/30 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold">Overall Progress</h3>
              <p className="text-white/30 text-xs mt-0.5">{done.length} of {tasks.length} tasks completed</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">{percent}%</span>
            </div>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
            <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.8, delay: 0.5 }} />
          </div>
          <div className="flex justify-between text-white/20 text-xs">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>

          {/* Mini column bars */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "To Do", count: todo.length, color: "bg-slate-500" },
              { label: "In Progress", count: progress.length, color: "bg-amber-500" },
              { label: "Done", count: done.length, color: "bg-emerald-500" },
            ].map(({ label, count, color }) => (
              <div key={label} className="bg-white/3 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-white/40 text-xs">{label}</span>
                </div>
                <p className="text-white text-lg font-bold">{count}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Tasks */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white/3 border border-white/8 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-2">
            {tasks.length === 0 && (
              <p className="text-white/20 text-sm text-center py-8">No tasks yet.<br/>Go to Board to add some.</p>
            )}
            {tasks.slice(0, 6).map((t) => {
              const colors = { todo: "bg-slate-500", progress: "bg-amber-500", done: "bg-emerald-500" };
              return (
                <div key={t._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors[t.columnId] || "bg-slate-500"}`} />
                  <p className="text-white/60 text-sm truncate">{t.title}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}