import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "./Column";
import TaskModal from "./TaskModal";
import { useTaskStore } from "../../store/useTaskStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban } from "lucide-react";

const columns = [
  { id: "todo", title: "To Do", color: "bg-slate-500", dot: "#64748b" },
  { id: "progress", title: "In Progress", color: "bg-amber-500", dot: "#f59e0b" },
  { id: "done", title: "Done", color: "bg-emerald-500", dot: "#10b981" },
];

export default function Board({ onAddTask }) {
  const { tasks, moveTask, fetchTasks } = useTaskStore();
  const { activeProject } = useProjectStore();
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetchTasks(activeProject?._id);
  }, [activeProject?._id]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const newColumnId =
      columns.find((c) => c.id === over.id)?.id ||
      tasks.find((t) => t._id === over.id)?.columnId;
    if (newColumnId) moveTask(active.id, newColumnId);
  };

  if (!activeProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
          <FolderKanban size={28} className="text-white/20" />
        </div>
        <p className="text-white/30 text-sm">No project selected</p>
        <p className="text-white/15 text-xs">Create or select a project from the sidebar</p>
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 p-6 overflow-x-auto flex-1 h-full items-start">
        {columns.map((col, i) => (
          <motion.div key={col.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Column
              column={col}
              tasks={tasks.filter((t) => t.columnId === col.id)}
              onEditTask={setEditTask}
              projectId={activeProject._id}
            />
          </motion.div>
        ))}
      </div>
      {editTask && <TaskModal task={editTask} onClose={() => setEditTask(null)} />}
    </DndContext>
  );
}