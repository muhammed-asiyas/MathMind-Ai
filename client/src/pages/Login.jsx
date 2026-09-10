import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/authContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      const { token, user } = response.data;

      login(token, user);

      navigate("/", { replace: true, state: { showLoginStreak: true } });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          (error.request
            ? "Cannot connect to the server. Please try again when it is running."
            : "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">

      <div className="mx-auto flex min-h-[90vh] max-w-md items-center">

        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl sm:p-10">

          <Link
            to="/"
            className="block text-center text-3xl font-black text-indigo-400"
          >
            MathMind AI
          </Link>

          <h1 className="mt-8 text-center text-3xl font-bold">
            Welcome back 👋
          </h1>

          <p className="mt-2 text-center text-slate-400">
            Continue your mathematics journey.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 py-3.5 font-semibold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <Link
              to="/forgot-password"
              className="block text-center text-sm font-semibold text-indigo-400 transition hover:text-cyan-300"
            >
              Forgot password?
            </Link>

          </form>

          {message && (
            <p className="mt-5 text-center text-sm text-red-400">
              {message}
            </p>
          )}

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">
              OR
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Create Account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;