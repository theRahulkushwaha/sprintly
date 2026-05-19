import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { 
  Trash2, Edit2, Check, User, Lock, FolderKanban, 
  UserPlus, UserMinus, AlertTriangle, Users, Shield,
  Building2, Save, X as CloseIcon
} from "lucide-react";
import API from "../services/api";
import { useRBAC } from "../hooks/useRBAC";
import { Link } from "react-router-dom";
import { useTaskStore } from "../store/useTaskStore";

const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6"];
const ICONS  = ["🚀","💡","🎯","🛠️","📦","🎨","📊","🔥","⚡","🌿"];
const TABS = [
  { id: "profile",  label: "Profile",  icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
];

export default function SettingsPage() {
  const { isAdmin, userRole } = useRBAC();
  const { user, updateUser, logout } = useAuthStore();
  const { projects, updateProject, deleteProject, addMember, removeMember, fetchProjects } = useProjectStore();
  const { tasks } = useTaskStore();

  const [activeTab, setActiveTab] = useState("profile");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);
  const [openMembersId, setOpenMembersId] = useState(null);
  
  // Organization settings
  const [orgForm, setOrgForm] = useState({
    name: user?.organization || "",
    description: "",
    website: "",
    industry: "",
    size: ""
  });
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgMessage, setOrgMessage] = useState("");
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  
  // Role change modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(userRole);
  const [roleChangeMsg, setRoleChangeMsg] = useState("");
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Load organization details on mount
  useEffect(() => {
    fetchOrganizationDetails();
  }, []);

  const fetchOrganizationDetails = async () => {
    try {
      const res = await API.get("/organization");
      if (res.data) {
        setOrgForm({
          name: res.data.name || user?.organization || "",
          description: res.data.description || "",
          website: res.data.website || "",
          industry: res.data.industry || "",
          size: res.data.size || ""
        });
      }
    } catch (err) {
      console.error("Failed to fetch organization details:", err);
    }
  };

  const updateOrganization = async () => {
    if (!orgForm.name.trim()) {
      setOrgMessage("Organization name is required");
      return;
    }
    
    setOrgLoading(true);
    setOrgMessage("");
    
    try {
      const res = await API.put("/organization", orgForm);
      setOrgMessage("✅ Organization updated successfully!");
      setIsEditingOrg(false);
      
      // Update user's organization in localStorage
      const updatedUser = { ...user, organization: orgForm.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setTimeout(() => setOrgMessage(""), 3000);
    } catch (err) {
      setOrgMessage(err.response?.data?.message || "Failed to update organization");
    } finally {
      setOrgLoading(false);
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

  const handleAddMember = async (projectId) => {
    if (!memberEmail.trim()) return;
    setMemberLoading(true);
    setMemberError("");
    try {
      await addMember(projectId, memberEmail.trim());
      setMemberEmail("");
      setMemberError("✅ Member added successfully!");
      setTimeout(() => setMemberError(""), 3000);
    } catch (err) {
      setMemberError(err.response?.data?.message || "User not found");
    } finally {
      setMemberLoading(false);
    }
  };

  const changePassword = async () => {
    setPwMsg("");
    if (pwForm.next !== pwForm.confirm) { setPwMsg("Passwords don't match"); return; }
    if (pwForm.next.length < 6) { setPwMsg("Min 6 characters"); return; }
    try {
      await API.put("/auth/password", { currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwMsg("✅ Password updated successfully");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwMsg(err.response?.data?.message || "Failed to update password");
    }
  };

  const handleRoleChange = async () => {
    setRoleChangeMsg("");
    setRoleChangeLoading(true);
    try {
      await updateUserRole(user._id, selectedRole);
      setRoleChangeMsg("✅ Role updated successfully! Please logout and login again to see changes.");
      setTimeout(() => {
        setRoleChangeMsg("");
        setShowRoleModal(false);
      }, 3000);
    } catch (err) {
      setRoleChangeMsg(err.response?.data?.message || "Failed to update role");
    } finally {
      setRoleChangeLoading(false);
    }
  };

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", 
    "Retail", "Manufacturing", "Consulting", "Media", 
    "Real Estate", "Transportation", "Other"
  ];

  const companySizes = [
    "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
  ];

  return (
    <div className="flex h-screen bg-[#0f0f13] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Settings" />

        <div className="flex-1 flex overflow-hidden">

          {/* Left tab nav */}
          <div className="w-56 border-r border-white/5 p-4 shrink-0">
            <p className="text-white/20 text-xs uppercase tracking-wider font-semibold px-3 mb-3">Settings</p>
            <div className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                    activeTab === id
                      ? "bg-indigo-500/15 text-indigo-400 font-medium"
                      : "text-white/35 hover:text-white/70 hover:bg-white/5"
                  }`}>
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">

            {/* ── Profile Tab ── */}
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-white text-xl font-semibold">Profile</h2>
                  <div className="flex gap-3">
                    {!isAdmin && (
                      <button
                        onClick={() => setShowRoleModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm hover:bg-indigo-500/20 transition-all"
                      >
                        <Shield size={14} />
                        Change Role
                      </button>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/20 transition-all">
                        <Shield size={14} />
                        Admin Panel
                      </Link>
                    )}
                  </div>
                </div>
                <p className="text-white/30 text-sm mb-8">Your personal information</p>

                <div className="flex items-center gap-5 mb-8 p-6 bg-white/3 border border-white/8 rounded-2xl">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-bold uppercase shrink-0">
                    {user?.name?.[0]}
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold">{user?.name}</p>
                    <p className="text-white/40 text-sm mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-2 text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full capitalize">
                      {userRole || "Developer"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "Full Name", value: user?.name },
                    { label: "Email Address", value: user?.email },
                    { label: "Role", value: userRole?.toUpperCase() || "DEVELOPER" },
                    { label: "Organization", value: user?.organization || "N/A" },
                    { label: "Member Since", value: new Date().getFullYear().toString() },
                    { label: "Projects", value: projects.length },
                    { label: "Total Tasks", value: tasks.length },
                    { label: "Completed Tasks", value: tasks.filter(t => t.columnId === "done").length },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/3 border border-white/8 rounded-xl p-4">
                      <p className="text-white/30 text-xs uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-white/70 text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Organization Tab ── */}
            {activeTab === "organization" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-white text-xl font-semibold">Organization Settings</h2>
                  {!isEditingOrg && (
                    <button
                      onClick={() => setIsEditingOrg(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm hover:bg-indigo-500/20 transition-all"
                    >
                      <Edit2 size={14} />
                      Edit Organization
                    </button>
                  )}
                </div>
                <p className="text-white/30 text-sm mb-8">Manage your organization details</p>

                {isEditingOrg ? (
                  <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Organization Name *</label>
                      <input
                        value={orgForm.name}
                        onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                        placeholder="Enter organization name"
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Description</label>
                      <textarea
                        value={orgForm.description}
                        onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
                        placeholder="Tell us about your organization"
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Website</label>
                      <input
                        value={orgForm.website}
                        onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                        placeholder="https://yourcompany.com"
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Industry</label>
                        <select
                          value={orgForm.industry}
                          onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all"
                        >
                          <option value="">Select industry</option>
                          {industries.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">Company Size</label>
                        <select
                          value={orgForm.size}
                          onChange={(e) => setOrgForm({ ...orgForm, size: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all"
                        >
                          <option value="">Select size</option>
                          {companySizes.map(size => (
                            <option key={size} value={size}>{size} employees</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {orgMessage && (
                      <div className={`text-sm px-4 py-3 rounded-xl border ${
                        orgMessage.startsWith("✅") 
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-red-400 bg-red-500/10 border-red-500/20"
                      }`}>
                        {orgMessage}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={updateOrganization}
                        disabled={orgLoading || !orgForm.name.trim()}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                      >
                        <Save size={16} />
                        {orgLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingOrg(false);
                          fetchOrganizationDetails();
                          setOrgMessage("");
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <CloseIcon size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                          <Building2 size={24} className="text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-white text-lg font-semibold">{orgForm.name || user?.organization || "Not set"}</h3>
                          <p className="text-white/30 text-sm">Organization</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {orgForm.description && (
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Description</p>
                          <p className="text-white/60 text-sm">{orgForm.description}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        {orgForm.website && (
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Website</p>
                            <a href={orgForm.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-sm hover:underline">
                              {orgForm.website}
                            </a>
                          </div>
                        )}
                        
                        {orgForm.industry && (
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Industry</p>
                            <p className="text-white/60 text-sm">{orgForm.industry}</p>
                          </div>
                        )}
                        
                        {orgForm.size && (
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Company Size</p>
                            <p className="text-white/60 text-sm">{orgForm.size} employees</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Password Tab ── */}
            {activeTab === "password" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
                <h2 className="text-white text-xl font-semibold mb-1">Change Password</h2>
                <p className="text-white/30 text-sm mb-8">Update your account password</p>

                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
                  {[
                    { key: "current", label: "Current Password", placeholder: "Enter current password" },
                    { key: "next", label: "New Password", placeholder: "Enter new password (min 6 chars)" },
                    { key: "confirm", label: "Confirm New Password", placeholder: "Confirm new password" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-white/40 text-xs uppercase tracking-wider mb-1.5 block">{label}</label>
                      <input type="password" placeholder={placeholder} value={pwForm[key]}
                        onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 text-sm transition-all" />
                    </div>
                  ))}

                  {pwMsg && (
                    <p className={`text-sm px-4 py-3 rounded-xl border ${
                      pwMsg.startsWith("✅")
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-red-400 bg-red-500/10 border-red-500/20"
                    }`}>{pwMsg}</p>
                  )}

                  <button onClick={changePassword}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-3 rounded-xl transition-all font-medium shadow-lg shadow-indigo-600/20 mt-2">
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Projects Tab ── */}
            {activeTab === "projects" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-white text-xl font-semibold mb-1">Manage Projects</h2>
                <p className="text-white/30 text-sm mb-8">Edit, manage members, or delete your projects</p>

                {/* Projects content remains the same as before */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {projects.map((p) => {
                    const projectTasks = tasks.filter(t => t.projectId === p._id);
                    const doneTasks = projectTasks.filter(t => t.columnId === "done");
                    const pct = projectTasks.length ? Math.round((doneTasks.length / projectTasks.length) * 100) : 0;

                    return (
                      <div key={p._id} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                        {/* Project card content - same as before */}
                        {/* ... */}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => !roleChangeLoading && setShowRoleModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a24] border border-white/10 w-full max-w-md rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white text-xl font-semibold mb-2">Change Role</h3>
              <p className="text-white/40 text-sm mb-6">Select your new role</p>
              
              <div className="space-y-3">
                {[
                  { id: "admin", name: "Admin", description: "Full access" },
                  { id: "manager", name: "Manager", description: "Manage teams" },
                  { id: "developer", name: "Developer", description: "View tasks" },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedRole === role.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <p className="text-white font-medium">{role.name}</p>
                      <p className="text-white/30 text-xs">{role.description}</p>
                    </div>
                    {selectedRole === role.id && <Check size={16} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
              
              {roleChangeMsg && (
                <div className={`mt-4 text-sm px-3 py-2 rounded-lg ${
                  roleChangeMsg.startsWith("✅") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {roleChangeMsg}
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowRoleModal(false)} className="flex-1 py-2 rounded-lg bg-white/5 text-white/60">
                  Cancel
                </button>
                <button onClick={handleRoleChange} disabled={roleChangeLoading || selectedRole === userRole}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50">
                  {roleChangeLoading ? "Updating..." : "Update Role"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}