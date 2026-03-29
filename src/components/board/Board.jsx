import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "./Column";
import { useTaskStore } from "../../store/useTaskStore";
import { useEffect } from "react";

const columns = [
  { id: "todo", title: "To Do", color: "bg-slate-500", light: "bg-slate-500/10 border-slate-500/20" },
  { id: "progress", title: "In Progress", color: "bg-amber-500", light: "bg-amber-500/10 border-amber-500/20" },
  { id: "done", title: "Done", color: "bg-emerald-500", light: "bg-emerald-500/10 border-emerald-500/20" },
];

export default function Board() {
  const { tasks, moveTask, fetchTasks } = useTaskStore();

  useEffect(() => { fetchTasks(); }, []);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const newColumnId =
      columns.find((c) => c.id === over.id)?.id ||
      tasks.find((t) => t._id === over.id)?.columnId;
    if (newColumnId) moveTask(active.id, newColumnId);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 p-6 overflow-x-auto flex-1 h-full">
        {columns.map((col) => (
          <Column key={col.id} column={col} tasks={tasks.filter((t) => t.columnId === col.id)} />
        ))}
      </div>
    </DndContext>
  );
}