import { useTaskStore } from "../../store/useTaskStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, Circle, TrendingUp, Zap,
  AlertCircle, Calendar, BarChart2
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ── custom tooltip ──────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a24] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-white/40 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function MainContent() {
  const { tasks, fetchTasks } = useTaskStore();
  const { user } = useAuthStore();
  const { projects, activeProject } = useProjectStore();

  useEffect(() => { fetchTasks(); }, []);

  // ── core counts ─────────────────────────────────────────
  const todo     = tasks.filter(t => t.columnId === "todo");
  const progress = tasks.filter(t => t.columnId === "progress");
  const done     = tasks.filter(t => t.columnId === "done");
  const total    = tasks.length || 1;
  const percent  = Math.round((done.length / total) * 100);

  // ── overdue ─────────────────────────────────────────────
  const now = new Date();
  const overdue = tasks.filter(
    t => t.dueDate && new Date(t.dueDate) < now && t.columnId !== "done"
  );

  // ── priority breakdown (pie) ─────────────────────────────
  const priorityData = [
    { name: "High",   value: tasks.filter(t => t.priority === "high").length,   color: "#f87171" },
    { name: "Medium", value: tasks.filter(t => t.priority === "medium").length, color: "#fbbf24" },
    { name: "Low",    value: tasks.filter(t => t.priority === "low").length,    color: "#34d399" },
  ].filter(d => d.value > 0);

  // ── tasks created in the last 7 days (area chart) ────────
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayStr = d.toISOString().split("T")[0];
    return {
      day: label,
      created: tasks.filter(t => t.createdAt?.startsWith(dayStr)).length,
      done:    tasks.filter(t => t.updatedAt?.startsWith(dayStr) && t.columnId === "done").length,
    };
  });

  // ── per-project task counts (bar chart) ──────────────────
  const projectBarData = projects.slice(0, 6).map(p => ({
    name: p.name.length > 10 ? p.name.slice(0, 10) + "…" : p.name,
    tasks: tasks.filter(t => t.projectId === p._id).length,
    done:  tasks.filter(t => t.projectId === p._id && t.columnId === "done").length,
    color: p.color || "#6366f1",
  }));

  // ── upcoming due (next 3 days) ───────────────────────────
  const upcoming = tasks
    .filter(t => {
      if (!t.dueDate || t.columnId === "done") return false;
      const diff = (new Date(t.dueDate) - now) / 86400000;
      return diff >= 0 && diff <= 3;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const stats = [
    { label: "To Do",      value: todo.length,     icon: Circle,       color: "text-slate-400",   bg: "bg-slate-500/10",   border: "border-slate-500/20" },
    { label: "In Progress",value: progress.length,  icon: Clock,        color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
    { label: "Done",       value: done.length,      icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Tasks",value: tasks.length,     icon: Zap,          color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-white text-2xl font-bold">Good day, {user?.name?.split(" ")[0]} 👋</h2>
        <p className="text-white/30 text-sm mt-1">Here's what's happening with your projects today.</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Row 1 — Progress + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Overall progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
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
          <div className="flex justify-between text-white/20 text-xs mb-6">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>

          {/* 7-day area chart */}
          <div className="h-36">
            <p className="text-white/25 text-xs uppercase tracking-wider mb-3">7-Day Activity</p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="created" name="Created" stroke="#6366f1" strokeWidth={2} fill="url(#gradCreated)" dot={false} />
                <Area type="monotone" dataKey="done"    name="Done"    stroke="#10b981" strokeWidth={2} fill="url(#gradDone)"    dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Priority pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white/3 border border-white/8 rounded-2xl p-6 flex flex-col">
          <h3 className="text-white font-semibold mb-1">Priority Breakdown</h3>
          <p className="text-white/30 text-xs mb-4">Distribution across all tasks</p>

          {priorityData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-white/20 text-sm">No tasks yet</p>
            </div>
          ) : (
            <>
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={38} outerRadius={58}
                      paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {priorityData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {priorityData.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-white/40 text-xs">{d.name}</span>
                    </div>
                    <span className="text-white/60 text-xs font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Row 2 — Project bar chart + Upcoming + Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Per-project bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={14} className="text-white/30" />
            <h3 className="text-white font-semibold">Tasks by Project</h3>
          </div>
          <p className="text-white/30 text-xs mb-5">Total vs completed per project</p>

          {projectBarData.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-white/20 text-sm">No projects yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={projectBarData} barGap={4} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tasks" name="Total" radius={[4, 4, 0, 0]} fill="#6366f1" opacity={0.5} />
                <Bar dataKey="done"  name="Done"  radius={[4, 4, 0, 0]} fill="#10b981" opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className="flex items-center gap-4 mt-3">
            {[{ color: "#6366f1", label: "Total", opacity: "opacity-50" }, { color: "#10b981", label: "Done" }].map(l => (
              <div key={l.label} className={`flex items-center gap-1.5 ${l.opacity || ""}`}>
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                <span className="text-white/30 text-xs">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right column — upcoming + overdue */}
        <div className="space-y-4">

          {/* Upcoming due */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }}
            className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={13} className="text-white/30" />
              <h3 className="text-white/70 text-sm font-semibold">Due Soon</h3>
              <span className="text-white/20 text-xs bg-white/5 px-1.5 py-0.5 rounded-full">{upcoming.length}</span>
            </div>
            {upcoming.length === 0
              ? <p className="text-white/20 text-xs py-2">No tasks due in next 3 days</p>
              : upcoming.map(t => (
                <div key={t._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    t.priority === "high" ? "bg-red-400" : t.priority === "medium" ? "bg-amber-400" : "bg-emerald-400"
                  }`} />
                  <p className="text-white/60 text-xs flex-1 truncate">{t.title}</p>
                  <span className="text-white/25 text-xs shrink-0">
                    {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))
            }
          </motion.div>

          {/* Overdue */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={13} className="text-red-400/60" />
              <h3 className="text-white/70 text-sm font-semibold">Overdue</h3>
              {overdue.length > 0 && (
                <span className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">{overdue.length}</span>
              )}
            </div>
            {overdue.length === 0
              ? <p className="text-white/20 text-xs py-2">No overdue tasks 🎉</p>
              : overdue.slice(0, 4).map(t => (
                <div key={t._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <p className="text-white/60 text-xs flex-1 truncate">{t.title}</p>
                  <span className="text-red-400/50 text-xs shrink-0">
                    {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))
            }
          </motion.div>
        </div>
      </div>

    </div>
  );
}