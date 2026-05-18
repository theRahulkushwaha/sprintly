import { useState } from "react";

import {
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  Calendar,
  MessageSquare,
  Paperclip,
  ChevronRight,
  Trash2,
  Flag,
} from "lucide-react";

import TaskModal from "./TaskModal";

import { useTaskStore } from "../../store/useTaskStore";

import { useProjectStore } from "../../store/useProjectStore";

const priorityStyles = {
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

  medium:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",

  high:
    "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function TaskCard({
  task,
  accentColor,
}) {
  const [open, setOpen] =
    useState(false);

  const {
    deleteTask,
    moveTask,
  } = useTaskStore();

  const { activeProject } =
    useProjectStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),

    transition,
  };

  const columns =
    activeProject?.columns || [];

  const currentIndex =
    columns.findIndex(
      (c) =>
        c.id === task.columnId
    );

  const nextColumn =
    columns[currentIndex + 1];

  const handleMoveNext =
    async (e) => {
      e.stopPropagation();

      if (!nextColumn)
        return;

      await moveTask(
        task._id,
        nextColumn.id
      );
    };

  const handleDelete =
    async (e) => {
      e.stopPropagation();

      await deleteTask(task._id);
    };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setOpen(true)}
        className="
          relative
          bg-[#17171f]
          border
          border-white/6
          hover:border-indigo-500/30
          rounded-2xl
          px-3
          py-3
          cursor-pointer
          transition-all
          duration-300
          group
          overflow-hidden
          hover:shadow-xl
          hover:shadow-black/30
          min-h-[84px]
        "
      >

        {/* ACCENT */}
        <div
          className={`absolute left-0 top-0 h-full w-1 ${accentColor}`}
        />

        {/* MAIN */}
        <div className="flex items-start justify-between gap-3">

          {/* LEFT */}
          <div className="flex-1 min-w-0">

            {/* TITLE */}
            <h3
              className="
                text-white/90
                text-sm
                font-medium
                leading-snug
                line-clamp-2
                break-words
              "
            >
              {task.title}
            </h3>

            {/* BOTTOM */}
            <div className="flex items-center flex-wrap gap-2 mt-3">

              {/* PRIORITY */}
              <div
                className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border capitalize ${priorityStyles[task.priority]}`}
              >
                <Flag size={9} />

                {task.priority}
              </div>

              {/* ASSIGNEE */}
              {task.assignedToName && (
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded-full px-2 py-1">

                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold uppercase">

                    {
                      task
                        .assignedToName[0]
                    }
                  </div>

                  <span className="text-[10px] text-white/50 truncate max-w-[70px]">
                    {
                      task.assignedToName
                    }
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT DOT */}
          <div
            className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${accentColor}`}
          />
        </div>

        {/* HOVER DETAILS */}
        <div
          className="
            max-h-0
            opacity-0
            overflow-hidden
            group-hover:max-h-[300px]
            group-hover:opacity-100
            transition-all
            duration-300
          "
        >

          {/* DESCRIPTION */}
          {task.description && (
            <p className="text-white/40 text-xs mt-4 leading-relaxed line-clamp-3">
              {task.description}
            </p>
          )}

          {/* META */}
          <div className="flex items-center flex-wrap gap-3 mt-4 text-white/35 text-[11px]">

            <div className="flex items-center gap-1">
              <MessageSquare
                size={11}
              />

              <span>
                {task.comments
                  ?.length || 0}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Paperclip
                size={11}
              />

              <span>
                {task.attachments
                  ?.length || 0}
              </span>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1">

                <Calendar
                  size={11}
                />

                <span>
                  {new Date(
                    task.dueDate
                  ).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* RESOURCE */}
          {task.resourceLink && (
            <a
              href={
                task.resourceLink
              }
              target="_blank"
              rel="noreferrer"
              onClick={(e) =>
                e.stopPropagation()
              }
              className="mt-3 text-[11px] text-indigo-400 hover:text-indigo-300 block truncate"
            >
              {
                task.resourceLink
              }
            </a>
          )}

          {/* ACTIONS */}
          <div className="flex gap-2 mt-4">

            {nextColumn && (
              <button
                onClick={
                  handleMoveNext
                }
                className="
                  flex-1
                  flex
                  items-center
                  justify-center
                  gap-1
                  bg-indigo-600/90
                  hover:bg-indigo-500
                  text-white
                  text-xs
                  py-2
                  rounded-xl
                  transition-all
                "
              >

                Move

                <ChevronRight
                  size={12}
                />
              </button>
            )}

            <button
              onClick={
                handleDelete
              }
              className="
                w-9
                flex
                items-center
                justify-center
                bg-red-500/10
                hover:bg-red-500/20
                text-red-400
                rounded-xl
                transition-all
              "
            >

              <Trash2
                size={13}
              />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <TaskModal
          task={task}
          onClose={() =>
            setOpen(false)
          }
        />
      )}
    </>
  );
}