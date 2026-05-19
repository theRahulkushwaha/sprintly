import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { Shield, Users, Code, Check, Building2 } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: "developer",
    organization: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, login } = useAuthStore();

  const roles = [
    { id: "admin", name: "Admin", icon: Shield, description: "Full access to everything", color: "purple" },
    { id: "manager", name: "Manager", icon: Users, description: "Can assign tasks and manage projects", color: "blue" },
    { id: "developer", name: "Developer", icon: Code, description: "View and update assigned tasks", color: "emerald" },
  ];

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password || !form.organization) { 
      setError("Please fill in all fields"); 
      return; 
    }
    if (form.password.length < 6) { 
      setError("Password must be at least 6 characters"); 
      return; 
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role, form.organization);
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl px-8 py-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mx-4"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="white"/>
              <rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
              <rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
              <rect x="13" y="13" width="8" height="8" rx="2" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-tight">Sprintly</span>
        </div>

        <h1 className="text-white text-2xl font-bold mb-1">Create account</h1>
        <p className="text-white/40 text-sm mb-8">Join your organization and start managing projects</p>

        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </motion.div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block uppercase tracking-wider">Full Name</label>
            <input 
              placeholder="John Doe" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 transition-all text-sm" 
            />
          </div>
          
          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 transition-all text-sm" 
            />
          </div>

          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block uppercase tracking-wider">Organization/Company Name</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                placeholder="Acme Inc." 
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 transition-all text-sm" 
              />
            </div>
            <p className="text-white/20 text-xs mt-1">Users from the same organization can collaborate on projects</p>
          </div>
          
          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              placeholder="Min 6 characters" 
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 transition-all text-sm" 
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="text-white/50 text-xs font-medium mb-3 block uppercase tracking-wider">Select Role</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = form.role === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setForm({ ...form, role: role.id })}
                    className={`relative p-4 rounded-xl border transition-all text-left ${
                      isSelected 
                        ? `border-${role.color}-500 bg-${role.color}-500/10 ring-2 ring-offset-2 ring-offset-[#0f0f13] ring-${role.color}-500` 
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check size={14} className={`text-${role.color}-400`} />
                      </div>
                    )}
                    <Icon size={20} className={`text-${role.color}-400 mb-2`} />
                    <h3 className="text-white text-sm font-semibold">{role.name}</h3>
                    <p className="text-white/30 text-xs mt-1">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-indigo-600/25"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-white/30 text-sm mt-6">
          Already have an account?{" "}
          <span onClick={() => navigate("/")} className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
            Sign in
          </span>
        </p>
      </motion.div>
    </div>
  );
}