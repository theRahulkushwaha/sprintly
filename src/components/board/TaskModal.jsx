import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  X,
  Send,
  MessageSquare,
  Calendar,
  Flag,
  Clock3,
} from "lucide-react";

import { useTaskStore } from "../../store/useTaskStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useProjectStore } from "../../store/useProjectStore";

const priorities = ["low", "medium", "high"];

const priorityColors = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium:
    "text-amber-400 bg-amber-500/10 border-amber-500/20",
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

export default function TaskModal({
  task,
  onClose,
}) {
  const { activeProject } =
    useProjectStore();

  const {
    updateTask,
    deleteTask,
    addComment,
    deleteComment,
  } = useTaskStore();

  const { user } =
    useAuthStore();

  const { tasks } =
    useTaskStore();

  const liveTask =
    tasks.find(
      (t) => t._id === task._id
    ) || task;

  const [title, setTitle] =
    useState(task.title);

  const [
    description,
    setDescription,
  ] = useState(
    task.description || ""
  );

  const [priority, setPriority] =
    useState(
      task.priority || "medium"
    );

  const [columnId, setColumnId] =
    useState(task.columnId);

  const [dueDate, setDueDate] =
    useState(
      task.dueDate
        ? new Date(
            task.dueDate
          )
            .toISOString()
            .split("T")[0]
        : ""
    );

  const [comment, setComment] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const handleSave =
    async () => {
      if (!title.trim())
        return;

      try {
        setSaving(true);

        await updateTask(
          task._id,
          {
            title,
            description,
            priority,
            columnId,
            dueDate:
              dueDate || null,
          }
        );

        onClose();
      } catch (err) {
        console.log(err);
      } finally {
        setSaving(false);
      }
    };

  const handleDelete =
    async () => {
      try {
        await deleteTask(
          task._id
        );

        onClose();
      } catch (err) {
        console.log(err);
      }
    };

  const handleComment =
    async () => {
      if (!comment.trim())
        return;

      try {
        await addComment(
          task._id,
          comment
        );

        setComment("");
      } catch (err) {
        console.log(err);
      }
    };

  const handleDeleteComment =
    async (commentId) => {
      try {
        await deleteComment(
          task._id,
          commentId
        );
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.96,
            y: 20,
          }}
          transition={{
            duration: 0.2,
          }}
          onClick={(e) =>
            e.stopPropagation()
          }
          className="
            w-full
            max-w-3xl
            max-h-[92vh]
            overflow-hidden
            rounded-3xl
            border border-white/10
            bg-[#111318]
            shadow-2xl
            flex
            flex-col
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/5 bg-[#151821] shrink-0">

            <div className="flex items-center gap-3 flex-wrap">

              <select
                value={columnId}
                onChange={(e) =>
                  setColumnId(
                    e.target.value
                  )
                }
                className="
                  bg-white/5
                  border border-white/10
                  text-white/70
                  text-sm
                  px-3
                  py-2
                  rounded-xl
                  outline-none
                  focus:border-indigo-500/40
                "
              >
                {activeProject?.columns?.map(
                  (c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-[#1a1d25]"
                    >
                      {c.title}
                    </option>
                  )
                )}
              </select>

              <div
                className={`px-3 py-1.5 rounded-full border text-xs font-medium capitalize ${priorityColors[priority]}`}
              >
                {priority}
              </div>
            </div>

            <button
              onClick={onClose}
              className="
                w-10
                h-10
                rounded-xl
                bg-white/5
                hover:bg-white/10
                flex
                items-center
                justify-center
                text-white/40
                hover:text-white/70
                transition-all
                shrink-0
              "
            >
              <X size={18} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">

            {/* TITLE */}
            <div>
              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Task title..."
                className="
                  w-full
                  bg-transparent
                  text-white
                  text-2xl
                  font-bold
                  outline-none
                  border-b
                  border-transparent
                  focus:border-white/10
                  pb-3
                  placeholder:text-white/20
                "
              />
            </div>

            {/* META */}
            <div className="flex flex-wrap gap-3">

              {/* PRIORITY */}
              <div className="flex items-center gap-2 flex-wrap">

                <Flag
                  size={14}
                  className="text-white/30"
                />

                {priorities.map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setPriority(
                          p
                        )
                      }
                      className={`
                        px-3
                        py-1.5
                        rounded-full
                        border
                        text-xs
                        capitalize
                        transition-all
                        ${
                          priority === p
                            ? priorityColors[
                                p
                              ]
                            : "bg-white/[0.03] border-white/10 text-white/30 hover:text-white/60"
                        }
                      `}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              {/* DATE */}
              <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2">

                <Clock3
                  size={14}
                  className="text-white/30"
                />

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(
                      e.target.value
                    )
                  }
                  className="
                    bg-transparent
                    text-white/70
                    text-sm
                    outline-none
                  "
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>

              <div className="flex items-center gap-2 mb-3">

                <MessageSquare
                  size={14}
                  className="text-indigo-400"
                />

                <h3 className="text-white font-medium">
                  Description
                </h3>
              </div>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Add task description..."
                className="
                  w-full
                  rounded-2xl
                  bg-white/[0.03]
                  border border-white/10
                  px-4
                  py-4
                  text-sm
                  text-white/70
                  placeholder:text-white/20
                  outline-none
                  resize-none
                  focus:border-indigo-500/30
                  transition-all
                "
              />
            </div>

            {/* COMMENTS */}
            <div>

              <div className="flex items-center justify-between mb-4">

                <div className="flex items-center gap-2">

                  <MessageSquare
                    size={14}
                    className="text-indigo-400"
                  />

                  <h3 className="text-white font-medium">
                    Comments
                  </h3>
                </div>

                <span className="text-white/30 text-sm">
                  {
                    liveTask
                      .comments
                      ?.length
                  }
                </span>
              </div>

              {/* COMMENT INPUT */}
              <div className="flex gap-3 mb-5">

                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
                  {user?.name?.[0] ||
                    "U"}
                </div>

                <div className="flex-1 flex gap-2">

                  <input
                    value={comment}
                    onChange={(e) =>
                      setComment(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      e.key ===
                        "Enter" &&
                      handleComment()
                    }
                    placeholder="Write a comment..."
                    className="
                      flex-1
                      h-11
                      rounded-xl
                      bg-white/[0.03]
                      border border-white/10
                      px-4
                      text-sm
                      text-white/70
                      placeholder:text-white/20
                      outline-none
                      focus:border-indigo-500/30
                    "
                  />

                  <button
                    onClick={
                      handleComment
                    }
                    className="
                      w-11
                      h-11
                      rounded-xl
                      bg-indigo-600
                      hover:bg-indigo-500
                      flex
                      items-center
                      justify-center
                      text-white
                      transition-all
                      shrink-0
                    "
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>

              {/* COMMENT LIST */}
              <div className="space-y-3">

                {liveTask.comments?.map(
                  (c) => (
                    <div
                      key={c._id}
                      className="group flex gap-3"
                    >

                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold uppercase shrink-0">
                        {c.authorName?.[0] ||
                          "U"}
                      </div>

                      <div className="flex-1 rounded-2xl bg-white/[0.03] border border-white/8 px-4 py-3">

                        <div className="flex items-start justify-between gap-3 mb-2">

                          <div>

                            <p className="text-sm text-white/80 font-medium">
                              {c.authorName ||
                                "User"}
                            </p>

                            <p className="text-[11px] text-white/25 mt-0.5">
                              {new Date(
                                c.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>

                          {c.authorName ===
                            user?.name && (
                            <button
                              onClick={() =>
                                handleDeleteComment(
                                  c._id
                                )
                              }
                              className="
                                opacity-0
                                group-hover:opacity-100
                                transition-all
                                text-white/20
                                hover:text-red-400
                              "
                            >
                              <Trash2
                                size={13}
                              />
                            </button>
                          )}
                        </div>

                        <p className="text-sm text-white/60 leading-relaxed break-words">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  )
                )}

                {liveTask.comments
                  ?.length ===
                  0 && (
                  <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-white/25 text-sm">
                    No comments yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="shrink-0 border-t border-white/5 bg-[#151821] px-4 sm:px-6 py-4 flex items-center justify-between gap-3">

            <button
              onClick={
                handleDelete
              }
              className="
                flex
                items-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                text-red-400/70
                hover:text-red-400
                hover:bg-red-500/10
                transition-all
                text-sm
              "
            >
              <Trash2 size={15} />
              Delete
            </button>

            <div className="flex items-center gap-2">

              <button
                onClick={onClose}
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  bg-white/[0.04]
                  hover:bg-white/[0.07]
                  text-white/40
                  hover:text-white/70
                  transition-all
                  text-sm
                "
              >
                Cancel
              </button>

              <button
                onClick={
                  handleSave
                }
                disabled={saving}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-indigo-600
                  hover:bg-indigo-500
                  disabled:opacity-50
                  text-white
                  font-medium
                  text-sm
                  shadow-lg
                  shadow-indigo-600/20
                  transition-all
                "
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}