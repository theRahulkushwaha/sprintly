import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "./Column";
import { useTaskStore } from "../../store/useTaskStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useEffect, useState } from "react";
import { FolderKanban, Plus } from "lucide-react";

const COLORS = [
  "bg-slate-500",
  "bg-red-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
];

export default function Board() {
  const { tasks, moveTask, fetchTasks } = useTaskStore();

  const {
    activeProject,
    updateColumns,
  } = useProjectStore();

  const [newColumn, setNewColumn] = useState("");

  useEffect(() => {
    fetchTasks(activeProject?._id);
  }, [activeProject]);

  if (!activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30">
        No project selected
      </div>
    );
  }

  const columns = activeProject.columns || [];
  window.__columns = columns;

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const newColumnId =
      columns.find((c) => c.id === over.id)?.id ||
      tasks.find((t) => t._id === over.id)?.columnId;

    if (newColumnId) {
      moveTask(active.id, newColumnId);
    }
  };

  const addColumn = async () => {
    if (!newColumn.trim()) return;

    const updated = [
      ...columns,
      {
        id: crypto.randomUUID(),
        title: newColumn,
        color:
          COLORS[Math.floor(Math.random() * COLORS.length)],
      },
    ];

    await updateColumns(activeProject._id, updated);

    setNewColumn("");
  };

  const deleteColumn = async (id) => {
    const updated = columns.filter((c) => c.id !== id);

    await updateColumns(activeProject._id, updated);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 p-6 overflow-x-auto flex-1 h-full">

        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            projectId={activeProject._id}
            tasks={tasks.filter(
              (t) => t.columnId === col.id
            )}
            onDelete={() => deleteColumn(col.id)}
          />
        ))}

        {/* Add Column */}
        <div className="w-[300px] shrink-0">
          <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-4">

            <input
              value={newColumn}
              onChange={(e) =>
                setNewColumn(e.target.value)
              }
              placeholder="New column name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
            />

            <button
              onClick={addColumn}
              className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Add Column
            </button>
          </div>
        </div>
      </div>
    </DndContext>
  );
}