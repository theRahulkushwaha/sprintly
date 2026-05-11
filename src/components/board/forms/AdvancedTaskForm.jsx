import { useState } from "react";

import {
  Calendar,
  Link2,
  User,
  Flag,
} from "lucide-react";

import { useTaskStore } from "../../../store/useTaskStore";

const priorities = [
  "low",
  "medium",
  "high",
];

const priorityStyles = {
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

  medium:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",

  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdvancedTaskForm({
  column,
  projectId,
  onClose,
}) {
  const { addTask } = useTaskStore();

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("medium");

  const [dueDate, setDueDate] =
    useState("");

  const [resourceLink, setResourceLink] =
    useState("");

  const [assignedToName, setAssignedToName] =
    useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await addTask({
      title,
      description,
      priority,
      dueDate,
      resourceLink,
      assignedToName,
      assignedTo: null,
      projectId,
      columnId: column.id,
    });

    onClose();
  };

  return (
    <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-4 space-y-4">

      {/* TITLE */}
      <input
        autoFocus
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        placeholder="Task title"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none"
      />

      {/* DESCRIPTION */}
      <textarea
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        placeholder="Description"
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none"
      />

      {/* PRIORITY */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Flag
            size={13}
            className="text-white/30"
          />

          <span className="text-xs text-white/40">
            Priority
          </span>
        </div>

        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() =>
                setPriority(p)
              }
              className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
                priority === p
                  ? priorityStyles[p]
                  : "bg-white/5 border-white/10 text-white/30"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* DUE DATE */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar
            size={13}
            className="text-white/30"
          />

          <span className="text-xs text-white/40">
            Deadline
          </span>
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none"
        />
      </div>

      {/* ASSIGNEE */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User
            size={13}
            className="text-white/30"
          />

          <span className="text-xs text-white/40">
            Assign To
          </span>
        </div>

        <input
          value={assignedToName}
          onChange={(e) =>
            setAssignedToName(
              e.target.value
            )
          }
          placeholder="Developer name"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none"
        />
      </div>

      {/* RESOURCE */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link2
            size={13}
            className="text-white/30"
          />

          <span className="text-xs text-white/40">
            Resource Link
          </span>
        </div>

        <input
          value={resourceLink}
          onChange={(e) =>
            setResourceLink(
              e.target.value
            )
          }
          placeholder="https://..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 pt-1">

        <button
          onClick={handleSubmit}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm transition-all"
        >
          Create Task
        </button>

        <button
          onClick={onClose}
          className="px-4 bg-white/5 hover:bg-white/10 text-white/40 rounded-xl text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}