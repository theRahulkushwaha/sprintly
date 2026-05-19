import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  MessageSquare,
  Paperclip,
  ChevronRight,
  Trash2,
  Flag,
  ArrowUpRight,
  Send,
  X,
} from "lucide-react";
import TaskModal from "./TaskModal";
import { useTaskStore } from "../../store/useTaskStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useRBAC, PERMISSIONS } from "../../hooks/useRBAC";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const priorityStyles = {
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function TaskCard({ task, accentColor }) {
  const [open, setOpen] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { deleteTask, moveTask, addComment } = useTaskStore();
  const { activeProject } = useProjectStore();
  const { hasPermission, isDeveloper } = useRBAC();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task._id,
    disabled: isDeveloper && task.assignedTo !== user?._id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: "relative",
  };

  const columns = activeProject?.columns || [];
  const currentIndex = columns.findIndex((c) => c.id === task.columnId);
  const nextColumn = columns[currentIndex + 1];

  const handleMoveNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!nextColumn) return;
    moveTask(task._id, nextColumn.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    deleteTask(task._id);
  };

  const handleCardClick = () => {
    if (!isDragging) {
      navigate(`/subtasks/${task._id}`);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowCommentModal(true);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    setSubmitting(true);
    try {
      await addComment(task._id, commentText);
      setCommentText("");
      setShowCommentModal(false);
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(hasPermission(PERMISSIONS.MOVE_TASK) ? attributes : {})}
        {...(hasPermission(PERMISSIONS.MOVE_TASK) ? listeners : {})}
        onClick={handleCardClick}
        className="relative group overflow-hidden rounded-2xl border border-white/[0.05] bg-gradient-to-b from-[#181820] to-[#12131a] px-3 py-3 transition-all duration-300 min-h-[82px] hover:border-indigo-500/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 cursor-pointer"
      >
        {/* LEFT ACCENT */}
        <div className={"absolute left-0 top-0 h-full w-1.5 rounded-l-2xl " + accentColor} />

        {/* TOP ROW */}
        <div className="flex items-start justify-between gap-3 pl-2">
          <div className="flex-1 min-w-0">
            <div
              className={
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wide mb-3 " +
                (priorityStyles[task.priority] || priorityStyles.medium)
              }
            >
              <Flag size={10} />
              {task.priority}
            </div>

            <h3 className="text-white text-[15px] font-semibold leading-snug line-clamp-2 break-words">
              {task.title}
            </h3>

            {task.description && (
              <p className="text-white/35 text-xs leading-relaxed mt-2 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          <div className={"w-3 h-3 rounded-full shrink-0 mt-1 shadow-lg " + accentColor} />
        </div>

        {/* QUICK META */}
        <div className="flex items-center justify-between mt-4 pl-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleCommentClick}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.05] text-white/45 hover:text-indigo-300 hover:border-indigo-500/20 hover:bg-indigo-500/10 transition-all"
            >
              <MessageSquare size={12} />
              <span className="text-[11px] font-medium">
                {task.comments?.length || 0}
              </span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.05] text-white/40">
              <Paperclip size={12} />
              <span className="text-[11px] font-medium">
                {task.attachments?.length || 0}
              </span>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.05] text-white/40">
                <Calendar size={12} />
                <span className="text-[11px]">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {task.assignedToName && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[11px] font-bold uppercase shadow-lg shadow-indigo-500/20">
              {task.assignedToName[0]}
            </div>
          )}
        </div>

        {/* EXPANDED SECTION */}
        <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-[300px] group-hover:opacity-100">
          <div className="pt-5 mt-5 border-t border-white/[0.06] pl-2">
            {task.assignedToName && (
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">
                  Assigned To
                </p>
                <p className="text-sm text-white/70">{task.assignedToName}</p>
              </div>
            )}

            {task.resourceLink && (
              <a
                href={task.resourceLink}
                target="_blank"
                rel="noreferrer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xs truncate mb-4"
              >
                <ArrowUpRight size={12} />
                {task.resourceLink}
              </a>
            )}

            <div className="flex gap-2">
              {nextColumn && hasPermission(PERMISSIONS.MOVE_TASK) && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={handleMoveNext}
                  className="flex-1 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center justify-center gap-1 transition-all"
                >
                  Move to {nextColumn.title}
                  <ChevronRight size={13} />
                </button>
              )}

              {hasPermission(PERMISSIONS.DELETE_TASK) && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={handleDelete}
                  className="w-10 h-10 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 flex items-center justify-center text-red-400 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a24] border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#151821]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                    <MessageSquare size={14} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Add Comment</h3>
                    <p className="text-white/30 text-xs">Task: {task.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="text-white/40 hover:text-white/70 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment here..."
                  rows={4}
                  className="w-full bg-[#0f0f13] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-all resize-none"
                  autoFocus
                />
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-white/10 bg-[#151821]">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitComment}
                  disabled={submitting || !commentText.trim()}
                  className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    "Posting..."
                  ) : (
                    <>
                      <Send size={14} />
                      Post Comment
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}