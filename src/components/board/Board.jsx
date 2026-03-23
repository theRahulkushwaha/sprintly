import { DndContext, closestCorners } from "@dnd-kit/core";
import Column from "./Column";
import { useTaskStore } from "../../store/useTaskStore";
import { useEffect } from "react";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function Board() {
  const { tasks, moveTask, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const newColumnId =
      columns.find((c) => c.id === over.id)?.id ||
      tasks.find((t) => t._id === over.id)?.columnId;

    if (newColumnId) {
      moveTask(active.id, newColumnId);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-6 overflow-x-auto flex-1">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.columnId === col.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}