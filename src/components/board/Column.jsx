import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { useTaskStore } from "../../store/useTaskStore";

export default function Column({ column, tasks }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const { addTask } = useTaskStore();

  const handleAdd = () => {
    if (!title.trim()) { setAdding(false); return; }
    addTask({ title, columnId: column.id });
    setTitle("");
    setAdding(false);
  };

  return (
    <div ref={setNodeRef} className="w-[300px] shrink-0 flex flex-col max-h-full">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${column.color}`} />
          <span className="text-white/70 text-sm font-semibold">{column.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${column.light} font-medium`}
            style={{ color: "rgba(255,255,255,0.4)" }}>
            {tasks.length}
          </span>
        </div>
        <button onClick={() => setAdding(true)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all">
          <Plus size={13} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => <TaskCard key={task._id} task={task} accentColor={column.color} />)}
        </SortableContext>

        {/* Add card inline */}
        {adding ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <textarea
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); } if (e.key === "Escape") { setAdding(false); setTitle(""); } }}
              placeholder="Task title..."
              rows={2}
              className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none resize-none"
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all">Add</button>
              <button onClick={() => { setAdding(false); setTitle(""); }} className="text-white/30 hover:text-white/60 text-xs px-2 py-1.5 transition-all">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 text-white/20 hover:text-white/40 text-sm py-2 px-3 rounded-xl hover:bg-white/3 transition-all">
            <Plus size={14} />
            Add a task
          </button>
        )}
      </div>
    </div>
  );
}