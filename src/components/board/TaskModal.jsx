import { useState } from "react";
import { useTaskStore } from "../../store/useTaskStore";

export default function TaskModal({ task, onClose }) {
  const [title, setTitle] = useState(task.title);
  const { updateTask, deleteTask } = useTaskStore();

  const handleSave = () => {
    if (!title.trim()) return;
    updateTask(task._id, { title }); 
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task._id); 
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[480px] rounded-3xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold text-lg mb-4">Edit Task</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="w-full p-3 bg-gray-100 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-indigo-300"
          autoFocus
        />
        <div className="flex justify-between items-center">
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm font-medium">
            Delete Task
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}