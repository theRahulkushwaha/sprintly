import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mx-4"
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

        <h1 className="text-white text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-white/40 text-sm mb-8">Sign in to continue to your workspace</p>

        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </motion.div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block uppercase tracking-wider">Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 transition-all text-sm" />
          </div>
          <div>
            <label className="text-white/50 text-xs font-medium mb-1.5 block uppercase tracking-wider">Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/60 transition-all text-sm" />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-indigo-600/25">
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-white/30 text-sm mt-6">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium">
            Create one
          </span>
        </p>
      </motion.div>
    </div>
  );
}