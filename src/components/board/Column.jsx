import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import TaskCard from "./TaskCard";
import { useTaskStore } from "../../store/useTaskStore";

export default function Column({ column, tasks }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const [title, setTitle] = useState("");
  const { addTask } = useTaskStore();

  const handleAdd = () => {
    if (!title.trim()) return;

    addTask({
      title,
      columnId: column.id,
    });

    setTitle("");
  };

  return (
    <div
      ref={setNodeRef}
      className="min-w-[300px] bg-white rounded-3xl p-4 shadow-md"
    >
      <h2 className="font-semibold mb-4">{column.title}</h2>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 mb-4 min-h-[50px]">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </SortableContext>

      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add task..."
          className="flex-1 p-2 bg-gray-100 rounded-lg"
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-3 rounded-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}