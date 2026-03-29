import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { useTaskStore } from "../../store/useTaskStore";

const priorityColors = {
  low:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  high:   "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function Column({ column, tasks, projectId }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [adding, setAdding] = useState(false);
  const { addTask } = useTaskStore();

  const handleAdd = () => {
    if (!title.trim()) { setAdding(false); return; }
    addTask({ title, columnId: column.id, projectId, priority });
    setTitle(""); setPriority("medium"); setAdding(false);
  };

  return (
    <div ref={setNodeRef} className="w-[300px] shrink-0 flex flex-col max-h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${column.color}`} />
          <span className="text-white/70 text-sm font-semibold">{column.title}</span>
          <span className="text-white/25 text-xs bg-white/5 px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button onClick={() => setAdding(true)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all">
          <Plus size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 pb-2">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} accentColor={column.color} dotColor={column.dot} />
          ))}
        </SortableContext>

        {adding ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-3">
            <textarea autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
                if (e.key === "Escape") { setAdding(false); setTitle(""); }
              }}
              placeholder="Task title..." rows={2}
              className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none resize-none" />

            {/* Priority picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-white/25 text-xs mr-1">Priority:</span>
              {["low", "medium", "high"].map((p) => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all capitalize ${
                    priority === p ? priorityColors[p] : "text-white/20 bg-white/3 border-white/8 hover:border-white/20"
                  }`}>
                  {p}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={handleAdd}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all">
                Add
              </button>
              <button onClick={() => { setAdding(false); setTitle(""); setPriority("medium"); }}
                className="text-white/30 hover:text-white/60 text-xs px-2 py-1.5 transition-all">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 text-white/20 hover:text-white/40 text-sm py-2 px-3 rounded-xl hover:bg-white/3 transition-all">
            <Plus size={14} /> Add a task
          </button>
        )}
      </div>
    </div>
  );
}