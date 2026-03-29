import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";

export default function TaskModal({ task, onClose }) {
  const [title, setTitle] = useState(task.title);
  const { updateTask, deleteTask } = useTaskStore();

  const handleSave = () => {
    if (!title.trim()) return;
    updateTask(task._id, { title });
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task._id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-[#1a1a24] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Edit Task</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
              <X size={15} />
            </button>
          </div>

          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={3}
            autoFocus
            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 transition-all text-sm resize-none mb-5"
          />

          <div className="flex items-center justify-between">
            <button onClick={handleDelete}
              className="flex items-center gap-2 text-red-400/70 hover:text-red-400 text-sm transition-all hover:bg-red-500/10 px-3 py-2 rounded-xl">
              <Trash2 size={14} />
              Delete
            </button>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm text-white/30 hover:text-white/60 bg-white/5 rounded-xl transition-all">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-indigo-600/20">
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}