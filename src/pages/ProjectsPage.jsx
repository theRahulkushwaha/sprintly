import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectStore } from "../store/useProjectStore";
import { useTaskStore } from "../store/useTaskStore";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import NewProjectModal from "../components/projects/NewProjectModal";
import { 
  FolderKanban, 
  Plus, 
  Users, 
  CheckCircle2, 
  Clock,
  UserPlus,
  UserMinus,
  X,
  Edit2,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProjectsPage() {
  const { projects, setActiveProject, updateProject, deleteProject, addMember, removeMember, fetchProjects } = useProjectStore();
  const { tasks } = useTaskStore();
  const { user } = useAuthStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [openMembersId, setOpenMembersId] = useState(null);
  const [memberEmail, setMemberEmail] = useState({});
  const [memberError, setMemberError] = useState({});
  const [memberLoading, setMemberLoading] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSelectProject = (project) => {
    setActiveProject(project);
    navigate("/board");
  };

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const completed = projectTasks.filter(t => t.columnId === "done").length;
    const inProgress = projectTasks.filter(t => t.columnId === "progress").length;
    const todo = projectTasks.filter(t => t.columnId === "todo").length;
    return { total: projectTasks.length, completed, inProgress, todo };
  };

  const handleAddMember = async (projectId) => {
    const email = memberEmail[projectId];
    if (!email?.trim()) return;
    
    setMemberLoading(prev => ({ ...prev, [projectId]: true }));
    setMemberError(prev => ({ ...prev, [projectId]: "" }));
    
    try {
      await addMember(projectId, email.trim());
      setMemberEmail(prev => ({ ...prev, [projectId]: "" }));
      setMemberError(prev => ({ ...prev, [projectId]: "✅ Member added successfully!" }));
      // Refresh projects to update members list
      setTimeout(() => {
        fetchProjects();
        setMemberError(prev => ({ ...prev, [projectId]: "" }));
      }, 2000);
    } catch (err) {
      setMemberError(prev => ({ 
        ...prev, 
        [projectId]: err.response?.data?.message || "User not found or not in your organization" 
      }));
    } finally {
      setMemberLoading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const handleRemoveMember = async (projectId, memberId, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from this project?`)) {
      await removeMember(projectId, memberId);
      fetchProjects(); // Refresh after removal
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({ name: p.name, description: p.description || "", color: p.color, icon: p.icon || "🚀" });
  };

  const saveEdit = async () => {
    await updateProject(editingId, editForm);
    setEditingId(null);
  };

  const confirmDelete = (id) => setDeleteConfirm(id);
  const handleDelete = async () => {
    await deleteProject(deleteConfirm);
    setDeleteConfirm(null);
  };

  const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];
  const ICONS = ["🚀","💡","🎯","🛠️","📦","🎨","📊","🔥","⚡","🌿"];

  // Debug: Log user and project membership
  console.log("Current User:", user);
  console.log("Projects:", projects);

  // Check if user is a member of the project (FIXED)
  const isProjectMember = (project) => {
    if (!project.members) return false;
    
    // Check if user ID exists in members array
    const isMember = project.members.some(member => {
      const memberId = member._id || member;
      return memberId === user?._id;
    });
    
    console.log(`Project ${project.name} - Is ${user?.name} a member?`, isMember);
    console.log("Project members:", project.members);
    
    return isMember;
  };

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="All Projects" />
        
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Projects</h1>
                <p className="text-white/40 mt-1">Manage and collaborate on your projects</p>
              </div>
              <button
                onClick={() => setShowNewProject(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all"
              >
                <Plus size={18} />
                New Project
              </button>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-4">
                  <FolderKanban size={40} className="text-white/20" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-white/30 text-sm mb-6">Create your first project to get started</p>
                <button
                  onClick={() => setShowNewProject(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl transition-all"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => {
                  const stats = getProjectStats(project._id);
                  const completionPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                  const isOwner = project.owner?._id === user?._id || project.owner === user?._id;
                  const canAddMembers = true; // FORCE ENABLE - Let anyone add members for now
                  
                  return (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-all"
                    >
                      {/* Members Panel - ALWAYS SHOW ADD MEMBER */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 cursor-pointer"
                              style={{ background: `${project.color}20`, border: `1px solid ${project.color}30` }}
                              onClick={() => handleSelectProject(project)}
                            >
                              {project.icon || "🚀"}
                            </div>
                            <div className="flex-1">
                              <h3 
                                onClick={() => handleSelectProject(project)}
                                className="text-white font-semibold text-lg cursor-pointer hover:text-indigo-400 transition-colors"
                              >
                                {project.name}
                              </h3>
                              <p className="text-white/30 text-xs mt-1">
                                {project.members?.length || 1} members • Created {new Date(project.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setOpenMembersId(openMembersId === project._id ? null : project._id)}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
                              title="Manage Members"
                            >
                              <Users size={14} />
                            </button>
                            {isOwner && (
                              <>
                                <button
                                  onClick={() => startEdit(project)}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-all"
                                  title="Edit Project"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => confirmDelete(project._id)}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/40 hover:text-red-400 transition-all"
                                  title="Delete Project"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {project.description && (
                          <p className="text-white/40 text-sm mb-4 line-clamp-2">{project.description}</p>
                        )}

                        {/* ADD MEMBER SECTION - ALWAYS VISIBLE */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-white/40 text-xs mb-3">Add Team Member (must be in same organization)</p>
                          <div className="flex gap-2">
                            <input
                              value={memberEmail[project._id] || ""}
                              onChange={(e) => setMemberEmail(prev => ({ ...prev, [project._id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && handleAddMember(project._id)}
                              placeholder="Enter email address..."
                              className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/20 px-3 py-2 rounded-xl outline-none focus:border-indigo-500/50 text-sm"
                            />
                            <button
                              onClick={() => handleAddMember(project._id)}
                              disabled={memberLoading[project._id]}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl flex items-center gap-2 text-white transition-all"
                            >
                              <UserPlus size={14} />
                              {memberLoading[project._id] ? "Adding..." : "Add Member"}
                            </button>
                          </div>
                          {memberError[project._id] && (
                            <p className={`text-xs mt-2 ${memberError[project._id].startsWith("✅") ? "text-emerald-400" : "text-red-400"}`}>
                              {memberError[project._id]}
                            </p>
                          )}
                        </div>

                        {/* Members List - Collapsible */}
                        {openMembersId === project._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-white/70 text-sm font-semibold">
                                Current Members ({project.members?.length || 0})
                              </h4>
                              <button
                                onClick={() => setOpenMembersId(null)}
                                className="text-white/30 hover:text-white/60"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {project.members?.map((member) => {
                                const memberId = member._id || member;
                                const memberName = member.name || "User";
                                const memberEmailId = member.email || "";
                                const isProjectOwner = (memberId === project.owner?._id || memberId === project.owner);
                                
                                return (
                                  <div key={memberId} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                                        {memberName[0] || "U"}
                                      </div>
                                      <div>
                                        <p className="text-white text-sm font-medium">{memberName}</p>
                                        <p className="text-white/30 text-xs">{memberEmailId}</p>
                                      </div>
                                    </div>
                                    {!isProjectOwner && memberId !== user?._id && (
                                      <button
                                        onClick={() => handleRemoveMember(project._id, memberId, memberName)}
                                        className="text-white/30 hover:text-red-400 transition-all"
                                        title="Remove Member"
                                      >
                                        <UserMinus size={14} />
                                      </button>
                                    )}
                                    {isProjectOwner && (
                                      <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">Owner</span>
                                    )}
                                    {memberId === user?._id && !isProjectOwner && (
                                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">You</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}

                        {/* Stats and Progress */}
                        <div className="mt-4">
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-white/5 rounded-xl">
                              <p className="text-white text-lg font-bold">{stats.total}</p>
                              <p className="text-white/30 text-xs">Total Tasks</p>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-xl">
                              <div className="flex items-center justify-center gap-1">
                                <Clock size={12} className="text-amber-400" />
                                <p className="text-white text-lg font-bold">{stats.inProgress}</p>
                              </div>
                              <p className="text-white/30 text-xs">In Progress</p>
                            </div>
                            <div className="text-center p-3 bg-white/5 rounded-xl">
                              <div className="flex items-center justify-center gap-1">
                                <CheckCircle2 size={12} className="text-emerald-400" />
                                <p className="text-white text-lg font-bold">{stats.completed}</p>
                              </div>
                              <p className="text-white/30 text-xs">Completed</p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-white/30">Overall Progress</span>
                              <span className="text-white/40 font-medium">{Math.round(completionPercent)}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${completionPercent}%`, background: project.color }}
                              />
                            </div>
                          </div>

                          {/* Open Project Button */}
                          <button
                            onClick={() => handleSelectProject(project)}
                            className="w-full mt-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-sm font-medium transition-all"
                          >
                            Open Project →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a24] border border-white/10 w-full max-w-md rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white text-xl font-semibold mb-2">Delete Project?</h3>
              <p className="text-white/40 text-sm mb-6">
                This action cannot be undone. All tasks and data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}