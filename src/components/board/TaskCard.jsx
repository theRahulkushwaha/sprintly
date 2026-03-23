import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import TaskModal from "./TaskModal";

export default function TaskCard({ task }) {
  const [open, setOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        whileHover={{ scale: 1.04 }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="bg-[#f9fafb] p-4 rounded-2xl shadow-sm cursor-pointer"
      >
        {task.title}
      </motion.div>

      {open && <TaskModal task={task} onClose={() => setOpen(false)} />}
    </>
  );
}