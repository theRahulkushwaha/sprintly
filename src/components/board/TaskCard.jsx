import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, AlertCircle } from "lucide-react";
import TaskModal from "./TaskModal";

const priorityConfig = {
  high:   { label: "High",   class: "text-red-400 bg-red-500/10 border-red-500/20" },
  medium: { label: "Medium", class: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  low:    { label: "Low",    class: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

export default function TaskCard({ task, accentColor, dotColor }) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.columnId !== "done";

  return (
    <>
      <motion.div ref={setNodeRef} style={style} {...attributes} {...listeners}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => setOpen(true)}
        className="bg-white/4 hover:bg-white/7 border border-white/8 hover:border-white/15 rounded-2xl p-4 cursor-pointer transition-all group">

        {/* Priority */}
        <div className="flex items-center justify-between mb-2.5">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.class}`}>
            {priority.label}
          </span>
          {task.comments?.length > 0 && (
            <div className="flex items-center gap-1 text-white/20">
              <MessageSquare size={11} />
              <span className="text-xs">{task.comments.length}</span>
            </div>
          )}
        </div>

        <p className="text-white/80 text-sm leading-relaxed mb-3">{task.title}</p>

        {task.description && (
          <p className="text-white/30 text-xs mb-3 line-clamp-2">{task.description}</p>
        )}

        {task.dueDate && (
          <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-400" : "text-white/25"}`}>
            {isOverdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
            <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        )}
      </motion.div>

      {open && <TaskModal task={task} onClose={() => setOpen(false)} />}
    </>
  );
}