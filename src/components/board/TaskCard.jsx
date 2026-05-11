import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Calendar,
  ChevronRight,
  Trash2,
  Link2,
} from "lucide-react";

import { useTaskStore } from "../../store/useTaskStore";

const priorityStyles = {
  low: "bg-emerald-500/10 text-emerald-400",

  medium:
    "bg-amber-500/10 text-amber-400",

  high: "bg-red-500/10 text-red-400",
};

export default function TaskCard({
  task,
  accentColor,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
  });

  const { deleteTask, moveTask } =
    useTaskStore();

  const style = {
    transform: CSS.Transform.toString(
      transform
    ),
    transition,
  };

  const handleNext = () => {
    const columns =
      window.__columns || [];

    const currentIndex =
      columns.findIndex(
        (c) => c.id === task.columnId
      );

    if (
      currentIndex !== -1 &&
      currentIndex < columns.length - 1
    ) {
      moveTask(
        task._id,
        columns[currentIndex + 1].id
      );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#1a1a24] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all group"
    >

      {/* TOP */}
      <div className="flex items-start justify-between mb-3">

        <div
          {...attributes}
          {...listeners}
          className="flex-1 cursor-grab active:cursor-grabbing"
        >
          <div
            className={`w-2 h-2 rounded-full mb-2 ${accentColor}`}
          />

          <h3 className="text-white/80 text-sm font-medium">
            {task.title}
          </h3>
        </div>

        {/* DELETE */}
        <button
          onClick={() =>
            deleteTask(task._id)
          }
          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* DESCRIPTION */}
      {task.description && (
        <p className="text-white/35 text-xs mb-3 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* META */}
      <div className="flex flex-wrap gap-2 mb-3">

        <span
          className={`text-[10px] px-2 py-1 rounded-full ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/50 flex items-center gap-1">
            <Calendar size={10} />

            {new Date(
              task.dueDate
            ).toLocaleDateString()}
          </span>
        )}

        {task.assignedToName && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
            {task.assignedToName}
          </span>
        )}
      </div>

      {/* RESOURCE */}
      {task.resourceLink && (
        <a
          href={task.resourceLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mb-3"
        >
          <Link2 size={12} />
          Resource
        </a>
      )}

      {/* MOVE BUTTON */}
      <button
        onClick={handleNext}
        className="w-full mt-2 bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 text-white/50 hover:text-indigo-300 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
      >
        Move Next

        <ChevronRight size={13} />
      </button>
    </div>
  );
}