import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl w-96 shadow-md">
        <h1 className="text-2xl font-bold text-indigo-600 mb-1">Sprintly</h1>
        <p className="text-gray-500 text-sm mb-6">Create your account</p>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <input placeholder="Full Name" value={form.name}
          className="w-full mb-3 p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email}
          className="w-full mb-3 p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password (min 6 chars)" value={form.password}
          className="w-full mb-4 p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60">
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p className="text-sm mt-4 text-center text-gray-500">
          Already have an account?{" "}
          <span onClick={() => navigate("/")} className="text-indigo-600 cursor-pointer font-medium hover:underline">Sign In</span>
        </p>
      </div>
    </div>
  );
}