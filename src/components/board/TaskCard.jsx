import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import TaskModal from "./TaskModal";

export default function TaskCard({ task, accentColor }) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setOpen(true)}
        className="bg-white/4 hover:bg-white/7 border border-white/8 hover:border-white/15 rounded-2xl p-4 cursor-pointer transition-all group"
      >
        <p className="text-white/80 text-sm leading-relaxed">{task.title}</p>
        <div className="flex items-center justify-between mt-3">
          <div className={`w-1.5 h-1.5 rounded-full ${accentColor || "bg-slate-500"}`} />
          <span className="text-white/20 text-xs opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</span>
        </div>
      </motion.div>
      {open && <TaskModal task={task} onClose={() => setOpen(false)} />}
    </>
  );
}