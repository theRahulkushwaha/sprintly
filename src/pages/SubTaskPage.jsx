import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  Trash2,
  Edit2,
  X,
  UserPlus,
  Send,
  MessageSquare,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import API from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";

export default function SubTaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tasks } = useTaskStore();
  const [task, setTask] = useState(null);
  const [subTasks, setSubTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchTask();
    fetchSubTasks();
    fetchUsers();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const taskData = tasks.find(t => t._id === taskId);
      if (taskData) {
        setTask(taskData);
      } else {
        const res = await API.get(`/tasks/${taskId}`);
        setTask(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubTasks = async () => {
    try {
      const res = await API.get(`/subtasks/task/${taskId}`);
      setSubTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createSubTask = async () => {
    if (!formData.title.trim()) return;

    try {
      const res = await API.post(`/subtasks/task/${taskId}`, formData);
      setSubTasks([res.data, ...subTasks]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "",
        dueDate: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create sub-task");
    }
  };

  const updateSubTaskStatus = async (subTaskId, newStatus) => {
    try {
      const res = await API.put(`/subtasks/${subTaskId}`, { status: newStatus });
      setSubTasks(subTasks.map(st => st._id === subTaskId ? res.data : st));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubTask = async (subTaskId) => {
    if (window.confirm("Are you sure you want to delete this sub-task?")) {
      try {
        await API.delete(`/subtasks/${subTaskId}`);
        setSubTasks(subTasks.filter(st => st._id !== subTaskId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const updateSubTask = async () => {
    try {
      const res = await API.put(`/subtasks/${editingSubTask._id}`, editingSubTask);
      setSubTasks(subTasks.map(st => st._id === editingSubTask._id ? res.data : st));
      setEditingSubTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={18} className="text-emerald-400" />;
      case "in-progress":
        return <Clock size={18} className="text-amber-400" />;
      default:
        return <Circle size={18} className="text-white/30" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  const stats = {
    total: subTasks.length,
    completed: subTasks.filter(st => st.status === "completed").length,
    inProgress: subTasks.filter(st => st.status === "in-progress").length,
    todo: subTasks.filter(st => st.status === "todo").length,
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Sub-tasks" />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Button & Task Info */}
            <div className="mb-6">
              <button
                onClick={() => navigate("/board")}
                className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-all mb-4"
              >
                <ArrowLeft size={16} />
                Back to Board
              </button>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h1 className="text-2xl font-bold text-white mb-2">{task?.title}</h1>
                {task?.description && (
                  <p className="text-white/40 text-sm">{task.description}</p>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task?.priority)}`}>
                    {task?.priority} priority
                  </span>
                  <span className="text-white/30 text-xs">
                    {subTasks.length} sub-tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-white/30 text-xs">Total</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
                <p className="text-white/30 text-xs">Completed</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{stats.inProgress}</p>
                <p className="text-white/30 text-xs">In Progress</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-slate-400">{stats.todo}</p>
                <p className="text-white/30 text-xs">To Do</p>
              </div>
            </div>

            {/* Create Sub-task Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full mb-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={18} />
              Create New Sub-task
            </button>

            {/* Sub-tasks List */}
            <div className="space-y-3">
              {subTasks.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-white/30">No sub-tasks yet. Create your first sub-task!</p>
                </div>
              ) : (
                subTasks.map((subTask) => (
                  <motion.div
                    key={subTask._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
                  >
                    {editingSubTask?._id === subTask._id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <input
                          value={editingSubTask.title}
                          onChange={(e) => setEditingSubTask({ ...editingSubTask, title: e.target.value })}
                          className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
                          placeholder="Title"
                        />
                        <textarea
                          value={editingSubTask.description}
                          onChange={(e) => setEditingSubTask({ ...editingSubTask, description: e.target.value })}
                          className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500 resize-none"
                          rows={2}
                          placeholder="Description"
                        />
                        <select
                          value={editingSubTask.priority}
                          onChange={(e) => setEditingSubTask({ ...editingSubTask, priority: e.target.value })}
                          className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
                        >
                          <option value="low" className="bg-[#1a1a24] text-white">Low</option>
                          <option value="medium" className="bg-[#1a1a24] text-white">Medium</option>
                          <option value="high" className="bg-[#1a1a24] text-white">High</option>
                        </select>
                        <div className="flex gap-2">
                          <button onClick={updateSubTask} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm transition-all">
                            Save
                          </button>
                          <button onClick={() => setEditingSubTask(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 py-2 rounded-lg text-sm transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => {
                            const newStatus = subTask.status === "completed" ? "todo" : 
                                            subTask.status === "in-progress" ? "completed" : "in-progress";
                            updateSubTaskStatus(subTask._id, newStatus);
                          }}
                          className="mt-1"
                        >
                          {getStatusIcon(subTask.status)}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="text-white font-medium">{subTask.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(subTask.priority)}`}>
                              <Flag size={10} className="inline mr-1" />
                              {subTask.priority}
                            </span>
                          </div>
                          
                          {subTask.description && (
                            <p className="text-white/40 text-sm mb-2">{subTask.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs">
                            {subTask.assignedTo && (
                              <div className="flex items-center gap-1 text-white/30">
                                <UserPlus size={12} />
                                Assigned to: {subTask.assignedToName || subTask.assignedTo?.name}
                              </div>
                            )}
                            {subTask.dueDate && (
                              <div className="text-white/30">
                                Due: {new Date(subTask.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingSubTask(subTask)}
                            className="text-white/30 hover:text-white/60 transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteSubTask(subTask._id)}
                            className="text-white/30 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Sub-task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a24] border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">Create Sub-task</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-white/40 hover:text-white/70 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sub-task title"
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-all"
                />
                
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description (optional)"
                  rows={3}
                  className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 outline-none focus:border-indigo-500 resize-none transition-all"
                />
                
                {/* Priority Dropdown - FIXED */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="low" className="bg-[#1a1a24] text-white">Low Priority</option>
                    <option value="medium" className="bg-[#1a1a24] text-white">Medium Priority</option>
                    <option value="high" className="bg-[#1a1a24] text-white">High Priority</option>
                  </select>
                </div>
                
                {/* Assign To Dropdown - FIXED */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Assign To</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-[#1a1a24] text-white/60">Select a team member...</option>
                    {users.filter(u => u.organization === user?.organization).map(u => (
                      <option key={u._id} value={u._id} className="bg-[#1a1a24] text-white">
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Due Date */}
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Due Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={createSubTask}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg transition-all font-medium"
                >
                  Create Sub-task
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}