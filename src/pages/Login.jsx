import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

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
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl w-96 shadow-md">
        <h1 className="text-2xl font-bold text-indigo-600 mb-1">Sprintly</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <input placeholder="Email" type="email" value={form.email}
          className="w-full mb-3 p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        <input type="password" placeholder="Password" value={form.password}
          className="w-full mb-4 p-3 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="text-sm mt-4 text-center text-gray-500">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="text-indigo-600 cursor-pointer font-medium hover:underline">Register</span>
        </p>
      </div>
    </div>
  );
}