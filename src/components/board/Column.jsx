import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import { useTaskStore } from "../../store/useTaskStore";

export default function Column({ column, tasks, onEditTask, projectId }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const { addTask } = useTaskStore();

  const handleAdd = () => {
    if (!title.trim()) { setAdding(false); return; }
    addTask({ title, columnId: column.id, projectId });
    setTitle("");
    setAdding(false);
  };

  return (
    <div ref={setNodeRef} className="w-[290px] shrink-0 flex flex-col" style={{ maxHeight: "calc(100vh - 130px)" }}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.dot }} />
          <span className="text-white/60 text-sm font-medium">{column.title}</span>
          <span className="text-white/25 text-xs bg-white/5 px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button onClick={() => setAdding(true)}
          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/25 hover:text-white/60 transition-all">
          <Plus size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} dotColor={column.dot} onEdit={() => onEditTask(task)} />
          ))}
        </SortableContext>

        {adding ? (
          <div className="bg-white/4 border border-white/10 rounded-2xl p-3">
            <textarea autoFocus value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
                if (e.key === "Escape") { setAdding(false); setTitle(""); }
              }}
              placeholder="Task title..." rows={2}
              className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none resize-none" />
            <div className="flex gap-2 mt-2">
              <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-all">Add</button>
              <button onClick={() => { setAdding(false); setTitle(""); }} className="text-white/30 hover:text-white/60 text-xs px-2 transition-all">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 text-white/20 hover:text-white/40 text-sm py-2 px-2 rounded-xl hover:bg-white/3 transition-all">
            <Plus size={13} />Add a task
          </button>
        )}
      </div>
    </div>
  );
}