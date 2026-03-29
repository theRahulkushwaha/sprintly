import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Send, Calendar, Flag, User, MessageSquare } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import { useAuthStore } from "../../store/useAuthStore";

const priorities = ["low", "medium", "high"];
const priorityColors = {
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  high: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function TaskModal({ task, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
  const [assigneeName, setAssigneeName] = useState(task.assigneeName || "");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const { updateTask, deleteTask, addComment, deleteComment } = useTaskStore();
  const { user } = useAuthStore();

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await updateTask(task._id, { title, description, priority, dueDate: dueDate || null, assigneeName });
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    await deleteTask(task._id);
    onClose();
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await addComment(task._id, comment);
    setComment("");
  };

  // Get latest task data from store
  const { tasks } = useTaskStore();
  const liveTask = tasks.find((t) => t._id === task._id) || task;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
          className="bg-[#13131a] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-white font-semibold">Task Details</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
              <X size={15} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="text-white/30 text-xs uppercase tracking-wider mb-2 block">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/8 text-white px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 transition-all text-sm" />
            </div>

            {/* Description */}
            <div>
              <label className="text-white/30 text-xs uppercase tracking-wider mb-2 block">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} placeholder="Add a description..."
                className="w-full bg-white/5 border border-white/8 text-white placeholder-white/15 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 transition-all text-sm resize-none" />
            </div>

            {/* Priority + Due Date + Assignee row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-white/30 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flag size={10} /> Priority
                </label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white/5 border border-white/8 text-white px-3 py-2.5 rounded-xl outline-none text-sm appearance-none cursor-pointer">
                  {priorities.map((p) => <option key={p} value={p} className="bg-[#13131a]">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/30 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar size={10} /> Due Date
                </label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/8 text-white/70 px-3 py-2.5 rounded-xl outline-none text-sm [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-white/30 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User size={10} /> Assignee
                </label>
                <input value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)}
                  placeholder="Name..." className="w-full bg-white/5 border border-white/8 text-white placeholder-white/15 px-3 py-2.5 rounded-xl outline-none focus:border-indigo-500/50 transition-all text-sm" />
              </div>
            </div>

            {/* Priority preview */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${priorityColors[priority]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </span>
              {dueDate && (
                <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/30">
                  Due {new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>

            {/* Comments */}
            <div>
              <label className="text-white/30 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare size={10} /> Comments ({liveTask.comments?.length || 0})
              </label>

              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {liveTask.comments?.map((c) => (
                  <div key={c._id} className="bg-white/3 border border-white/5 rounded-xl px-4 py-3 group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-indigo-400 text-xs font-medium">{c.authorName || "User"}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white/15 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                        <button onClick={() => deleteComment(task._id, c._id)}
                          className="text-white/15 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 text-xs">✕</button>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm">{c.text}</p>
                  </div>
                ))}
                {(!liveTask.comments || liveTask.comments.length === 0) && (
                  <p className="text-white/15 text-xs text-center py-3">No comments yet</p>
                )}
              </div>

              <div className="flex gap-2">
                <input value={comment} onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 bg-white/5 border border-white/8 text-white placeholder-white/15 px-4 py-2.5 rounded-xl outline-none focus:border-indigo-500/50 transition-all text-sm" />
                <button onClick={handleAddComment}
                  className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white transition-all shrink-0">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <button onClick={handleDelete}
              className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-sm transition-all hover:bg-red-500/10 px-3 py-2 rounded-xl">
              <Trash2 size={14} /> Delete
            </button>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-2 text-sm text-white/30 hover:text-white/60 bg-white/5 rounded-xl transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all font-medium shadow-lg shadow-indigo-600/20">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}