import AdvancedTaskForm from "./forms/AdvancedTaskForm";
import { useRBAC, PERMISSIONS } from "../../hooks/useRBAC";
import { PermissionGuard } from "../rbac/PermissionGuard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";

import { useState } from "react";

import {
  Plus,
  Trash2,
} from "lucide-react";

import TaskCard from "./TaskCard";

export default function Column({ column, tasks, projectId, onDelete }) {
  const { hasPermission } = useRBAC();
  const { setNodeRef } = useDroppable({ id: column.id });
  const [adding, setAdding] = useState(false);

  return (
    <div ref={setNodeRef} className="w-[320px] shrink-0 flex flex-col max-h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${column.color}`} />
          <span className="text-white/70 text-sm font-semibold">{column.title}</span>
          <span className="text-white/25 text-xs bg-white/5 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <PermissionGuard permission={PERMISSIONS.CREATE_TASK}>
            <button
              onClick={() => setAdding(true)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
            >
              <Plus size={13} />
            </button>
          </PermissionGuard>

          <PermissionGuard permission={PERMISSIONS.MANAGE_COLUMNS}>
            <button
              onClick={onDelete}
              className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 pb-2">
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              accentColor={column.color}
            />
          ))}
        </SortableContext>

        {/* TASK FORM */}
        {adding ? (
          <AdvancedTaskForm
            column={column}
            projectId={projectId}
            onClose={() => setAdding(false)}
          />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full flex items-center gap-2 text-white/20 hover:text-white/40 text-sm py-2 px-3 rounded-xl hover:bg-white/3 transition-all"
          >
            <Plus size={14} />
            Add a task
          </button>
        )}
      </div>
    </div>
  );
}