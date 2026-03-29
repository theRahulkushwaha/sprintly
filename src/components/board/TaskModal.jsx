import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, Send, MessageSquare, Calendar, Flag } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import { useAuthStore } from "../../store/useAuthStore";

const priorities = ["low", "medium", "high"];
const columns = ["todo", "progress", "done"];
const columnLabels = { todo: "To Do", progress: "In Progress", done: "Done" };
const priorityColors = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export default function TaskModal({ task, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [columnId, setColumnId] = useState(task.columnId);
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const { updateTask, deleteTask, addComment, deleteComment } = useTaskStore();
  const { user } = useAuthStore();

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await updateTask(task._id, { title, description, priority, columnId, dueDate: dueDate || null });
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    await deleteTask(task._id);
    onClose();
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await addComment(task._id, comment);
    setComment("");
  };

  // get latest task from store for comments
  const { tasks } = useTaskStore.getState();
  const liveTask = tasks.find(t => t._id === task._id) || task;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-[#13131a] border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <select value={columnId} onChange={(e) => setColumnId(e.target.value)}
                className="bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1.5 rounded-lg outline-none">
                {columns.map(c => <option key={c} value={c} className="bg-[#1a1a24]">{columnLabels[c]}</option>)}
              </select>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title */}
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-white text-xl font-semibold outline-none placeholder-white/20 border-b border-transparent focus:border-white/10 pb-2 transition-all"
              placeholder="Task title..." />

            {/* Meta row */}
            <div className="flex flex-wrap gap-3">
              {/* Priority */}
              <div className="flex items-center gap-2">
                <Flag size={13} className="text-white/30" />
                <div className="flex gap-1.5">
                  {priorities.map((p) => (
                    <button key={p} onClick={() => setPriority(p)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all capitalize ${
                        priority === p ? priorityColors[p] : "text-white/20 bg-white/3 border-white/8 hover:border-white/20"
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-white/30" />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white/50 text-xs px-3 py-1.5 rounded-lg outline-none focus:border-indigo-500/40 transition-all" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-white/25 text-xs uppercase tracking-wider mb-2 block">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3} placeholder="Add a description..."
                className="w-full bg-white/3 border border-white/8 text-white/70 placeholder-white/15 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/40 text-sm resize-none transition-all" />
            </div>

            {/* Comments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={13} className="text-white/30" />
                <label className="text-white/25 text-xs uppercase tracking-wider">Comments ({liveTask.comments?.length || 0})</label>
              </div>

              <div className="space-y-3 mb-3">
                {liveTask.comments?.map((c) => (
                  <div key={c._id} className="flex gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                      {c.authorName?.[0] || "U"}
                    </div>
                    <div className="flex-1 bg-white/3 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/50 text-xs font-medium">{c.authorName || "User"}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/20 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                          {c.authorName === user?.name && (
                            <button onClick={() => deleteComment(task._id, c._id)}
                              className="text-white/15 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                  {user?.name?.[0] || "U"}
                </div>
                <div className="flex-1 flex gap-2">
                  <input value={comment} onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    placeholder="Write a comment..."
                    className="flex-1 bg-white/5 border border-white/10 text-white/70 placeholder-white/20 px-4 py-2.5 rounded-xl outline-none focus:border-indigo-500/40 text-sm transition-all" />
                  <button onClick={handleComment}
                    className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white transition-all shrink-0">
                    <Send size={13} />
                  </button>
                </div>
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