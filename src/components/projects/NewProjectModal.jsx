import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";
import { useNavigate } from "react-router-dom";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#14b8a6"];

export default function NewProjectModal({ onClose }) {
  const [form, setForm] = useState({ name: "", description: "", color: "#6366f1" });
  const [loading, setLoading] = useState(false);
  const { createProject } = useProjectStore();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await createProject(form);
      navigate("/board");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-[#1a1a24] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-lg">New Project</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
              <X size={15} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Project Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Mobile App Redesign"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all" />
            </div>
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What is this project about?"
                rows={2}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all resize-none" />
            </div>
            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-full transition-all ${form.color === c ? "ring-2 ring-white/40 ring-offset-2 ring-offset-[#1a1a24] scale-110" : "hover:scale-110"}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 text-white/40 hover:text-white/70 text-sm transition-all">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={loading || !form.name.trim()}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium text-sm transition-all">
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}