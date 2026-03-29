import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, AlertCircle } from "lucide-react";

const priorityConfig = {
  high:   { label: "High",   color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20" },
  medium: { label: "Medium", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20" },
  low:    { label: "Low",    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

export default function TaskCard({ task, dotColor, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.columnId !== "done";

  return (
    <motion.div ref={setNodeRef} style={style} {...attributes} {...listeners}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      onClick={onEdit}
      className="bg-white/4 hover:bg-white/7 border border-white/8 hover:border-white/15 rounded-2xl p-4 cursor-pointer transition-all group"
    >
      {/* Priority badge */}
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.color} ${priority.bg} ${priority.border}`}>
          {priority.label}
        </span>
        {isOverdue && <AlertCircle size={12} className="text-red-400" />}
      </div>

      <p className="text-white/80 text-sm leading-relaxed mb-3">{task.title}</p>

      {task.description && (
        <p className="text-white/30 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-400" : "text-white/25"}`}>
              <Calendar size={11} />
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          )}
          {task.comments?.length > 0 && (
            <div className="flex items-center gap-1 text-white/25 text-xs">
              <MessageSquare size={11} />
              {task.comments.length}
            </div>
          )}
        </div>
        {task.assigneeName && (
          <div className="w-5 h-5 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs font-bold uppercase">
            {task.assigneeName[0]}
          </div>
        )}
      </div>
    </motion.div>
  );
}