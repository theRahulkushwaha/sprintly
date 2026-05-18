import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

import Column from "./Column";

import {
  useTaskStore,
} from "../../store/useTaskStore";

import {
  useProjectStore,
} from "../../store/useProjectStore";

import {
  socket,
} from "../../socket";

const COLORS = [
  "bg-slate-500",
  "bg-red-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
];

export default function Board() {
  const {
    tasks,
    moveTask,
    fetchTasks,
  } = useTaskStore();

  const {
    activeProject,
    updateColumns,
  } = useProjectStore();

  const [
    newColumn,
    setNewColumn,
  ] = useState("");

  useEffect(() => {
    if (
      activeProject?._id
    ) {
      fetchTasks(
        activeProject._id
      );

      socket.emit(
        "join-project",
        activeProject._id
      );
    }
  }, [activeProject]);

  if (!activeProject) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-[#0f1117]">

        <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-[32px] p-10 text-center shadow-2xl">

          <div className="w-24 h-24 rounded-[28px] bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">

            <LayoutGrid
              size={42}
              className="text-indigo-400"
            />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
            No Project Selected
          </h2>

          <p className="text-white/40 leading-relaxed text-sm">
            Select a project from the sidebar
            or create a new one to start
            managing your workflows,
            deadlines, and team tasks.
          </p>
        </div>
      </div>
    );
  }

  const columns =
    activeProject.columns || [];

  const handleDragEnd = ({
    active,
    over,
  }) => {
    if (!over) return;

    const targetColumn =
      columns.find(
        (c) =>
          c.id === over.id
      );

    const targetTask =
      tasks.find(
        (t) =>
          t._id === over.id
      );

    const newColumnId =
      targetColumn?.id ||
      targetTask?.columnId;

    if (
      newColumnId &&
      active.id
    ) {
      moveTask(
        active.id,
        newColumnId
      );
    }
  };

  const addColumn =
    async () => {
      if (
        !newColumn.trim()
      )
        return;

      const updated = [
        ...columns,

        {
          id:
            crypto.randomUUID(),

          title: newColumn,

          color:
            COLORS[
              Math.floor(
                Math.random() *
                  COLORS.length
              )
            ],
        },
      ];

      await updateColumns(
        activeProject._id,
        updated
      );

      setNewColumn("");
    };

  const deleteColumn =
    async (id) => {
      const updated =
        columns.filter(
          (c) => c.id !== id
        );

      await updateColumns(
        activeProject._id,
        updated
      );
    };

  return (
    <div className="h-full flex flex-col bg-[#0f1117] overflow-hidden">

      {/* HEADER */}
      <div className="shrink-0 border-b border-white/5 bg-[#0f1117]/90 backdrop-blur-2xl z-10">

        <div className="px-4 md:px-6 lg:px-8 py-5">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            {/* LEFT */}
            <div className="min-w-0">

              <div className="flex items-center gap-3 mb-2">

                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{
                    background:
                      activeProject.color,
                  }}
                />

                <span className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em]">
                  Workspace Board
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight truncate">
                {activeProject.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-3">

                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                  {tasks.length} Tasks
                </div>

                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs">
                  {columns.length} Columns
                </div>

                <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs flex items-center gap-1.5">

                  <Sparkles
                    size={12}
                  />

                  Live Workspace
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-3">

              <input
                value={newColumn}
                onChange={(e) =>
                  setNewColumn(
                    e.target.value
                  )
                }
                placeholder="Create workflow column..."
                className="h-12 w-full sm:w-[250px] bg-white/[0.04] border border-white/10 rounded-2xl px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/40 transition-all"
              />

              <button
                onClick={
                  addColumn
                }
                className="h-12 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap"
              >

                <Plus size={16} />

                Add Column
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOARD */}
      <DndContext
        collisionDetection={
          closestCorners
        }
        onDragEnd={
          handleDragEnd
        }
      >

        {/* MAIN SCROLL AREA */}
        <div className="flex-1 overflow-auto">

          {/* BOARD CONTAINER */}
          <div className="min-h-full p-4 md:p-6 lg:p-8">

            <div
              className="
                grid
                gap-4
                md:gap-5
                lg:gap-6
                h-full
              "
              style={{
                gridTemplateColumns:
                  columns.length === 1
                    ? "1fr"
                    : columns.length === 2
                    ? "repeat(2, minmax(320px, 1fr))"
                    : columns.length === 3
                    ? "repeat(3, minmax(300px, 1fr))"
                    : `repeat(${columns.length}, minmax(320px, 1fr))`,
              }}
            >

              {columns.map(
                (col) => (
                  <div
                    key={col.id}
                    className="
                      min-w-[300px]
                      h-full
                    "
                  >

                    <Column
                      column={col}
                      projectId={
                        activeProject._id
                      }
                      tasks={tasks.filter(
                        (t) =>
                          t.columnId ===
                          col.id
                      )}
                      onDelete={() =>
                        deleteColumn(
                          col.id
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}