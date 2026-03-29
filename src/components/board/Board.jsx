import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "./Column";
import { useTaskStore } from "../../store/useTaskStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useEffect } from "react";
import { FolderKanban } from "lucide-react";

const columns = [
  { id: "todo", title: "To Do", color: "bg-slate-500", dot: "#64748b" },
  { id: "progress", title: "In Progress", color: "bg-amber-500", dot: "#f59e0b" },
  { id: "done", title: "Done", color: "bg-emerald-500", dot: "#10b981" },
];

export default function Board() {
  const { tasks, moveTask, fetchTasks } = useTaskStore();
  const { activeProject } = useProjectStore();

  useEffect(() => {
    fetchTasks(activeProject?._id);
  }, [activeProject]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const newColumnId = columns.find((c) => c.id === over.id)?.id || tasks.find((t) => t._id === over.id)?.columnId;
    if (newColumnId) moveTask(active.id, newColumnId);
  };

  if (!activeProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
          <FolderKanban size={28} className="text-white/20" />
        </div>
        <div>
          <p className="text-white/50 font-medium">No project selected</p>
          <p className="text-white/20 text-sm mt-1">Create a project from the sidebar to get started</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 p-6 overflow-x-auto flex-1 h-full">
        {columns.map((col) => (
          <Column key={col.id} column={col}
            tasks={tasks.filter((t) => t.columnId === col.id)}
            projectId={activeProject?._id} />
        ))}
      </div>
    </DndContext>
  );
}