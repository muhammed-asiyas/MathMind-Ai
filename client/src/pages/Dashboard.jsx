import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, LogOut, X } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const dailyGoal = user?.dailyGoal || 10;
  const [dailyProgress, setDailyProgress] = useState({ attempts: 0, limit: dailyGoal });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [streakPopupDismissed, setStreakPopupDismissed] = useState(false);
  const userKey = user?.id || user?._id || user?.email;
  const streakPopupKey = userKey ? `mathora-streak-popup-${userKey}` : "";
  const today = new Date().toISOString().slice(0, 10);
  const showLoginStreak = !streakPopupDismissed && (
    Boolean(location.state?.showLoginStreak)
    || Boolean(streakPopupKey && localStorage.getItem(streakPopupKey) !== today)
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [topicsResponse, dailyResponse] = await Promise.all([
          api.get("/topics"),
          api.get("/progress/daily"),
        ]);

        setTopics(topicsResponse.data.topics);
        setDailyProgress(dailyResponse.data.daily || { attempts: 0, limit: dailyGoal });
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
        setTopicsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dailyGoal, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const dismissLoginStreak = () => {
    if (streakPopupKey) {
      localStorage.setItem(streakPopupKey, today);
    }
    setStreakPopupDismissed(true);
    navigate(location.pathname, { replace: true, state: {} });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

          <p className="mt-4 text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Welcome */}
        <section>
          <p className="text-sm font-medium text-indigo-400">
            YOUR LEARNING SPACE
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Welcome back, {user?.firstName} 👋
          </h1>

          <p className="mt-3 text-slate-400">
            Keep learning and become better at mathematics every day.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="text-3xl">⭐</div>

            <p className="mt-4 text-sm text-slate-400">
              Total XP
            </p>

            <p className="mt-1 text-3xl font-black">
              {user?.xp || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="text-3xl">🏆</div>

            <p className="mt-4 text-sm text-slate-400">
              Current Level
            </p>

            <p className="mt-1 text-3xl font-black">
              {user?.level || 1}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="text-3xl">🔥</div>

            <p className="mt-4 text-sm text-slate-400">
              Learning Streak
            </p>

            <p className="mt-1 text-3xl font-black">
              {user?.streak || 0}
              <span className="ml-1 text-base font-normal text-slate-400">
                days
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="text-3xl">🎯</div>

            <p className="mt-4 text-sm text-slate-400">
              Daily Goal
            </p>

            <p className="mt-1 text-3xl font-black">
                {Math.min(dailyProgress.attempts, dailyProgress.limit)}/{dailyProgress.limit}
            </p>
          </div>

        </section>

        {/* AI Tutor + Daily Goal */}
        <section className="mt-10 grid gap-6 lg:grid-cols-3">

          {/* AI Tutor */}
          <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-6 sm:p-8 lg:col-span-2">

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

            <div className="relative">

              <span className="text-5xl">🤖</span>

              <h2 className="mt-6 text-2xl font-black sm:text-3xl">
                Meet your AI Math Tutor
              </h2>

              <p className="mt-3 max-w-xl text-indigo-100">
                Stuck on a mathematics problem? Ask MathMind AI and get a clear,
                step-by-step explanation.
              </p>

              <button
                className="mt-7 rounded-xl bg-white px-6 py-3 font-bold text-indigo-600 transition hover:bg-indigo-50"
              >
                Ask AI Tutor →
              </button>

            </div>
          </div>

          {/* Daily Goal */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">

            <span className="text-4xl">🎯</span>

            <h2 className="mt-5 text-xl font-bold sm:text-2xl">
              Today's Goal
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Complete {dailyProgress.limit} practice questions today.
            </p>

            <div className="mt-7">

              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.min(Math.round((dailyProgress.attempts / dailyProgress.limit) * 100), 100)}%</span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min((dailyProgress.attempts / dailyProgress.limit) * 100, 100)}%` }}
                />
              </div>

            </div>

          </div>

        </section>

        {/* Topics */}
        <section className="mt-12">

          <div>
            <p className="text-sm font-semibold text-indigo-400">
              EXPLORE
            </p>

            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              Mathematics Topics
            </h2>
          </div>

          {/* Topics loading */}
          {topicsLoading && (
            <div className="mt-7 flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          )}

          {/* No topics */}
          {!topicsLoading && topics.length === 0 && (
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-10 text-center">

              <div className="text-5xl">
                📚
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No topics available
              </h3>

              <p className="mt-2 text-slate-400">
                Topics will appear here once they are added.
              </p>

            </div>
          )}

          {/* Topics */}
          {!topicsLoading && topics.length > 0 && (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {topics.map((topic) => (
                <Link
                  to={`/topics/${topic._id}`}
                  key={topic._id}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-white/10 sm:p-6"
                >

                  <span className="text-4xl">
                    {topic.icon}
                  </span>

                  <h3 className="mt-5 text-xl font-bold transition group-hover:text-indigo-400">
                    {topic.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {topic.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {topic.difficulty}
                    </span>

                    <span className="text-sm font-semibold text-indigo-400">
                      Start →
                    </span>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </section>

      </main>

      <AnimatePresence>
        {showLoginStreak && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissLoginStreak}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="login-streak-title"
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-orange-300/25 bg-slate-900 p-8 text-center shadow-2xl shadow-orange-950/30"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close daily streak popup"
                onClick={dismissLoginStreak}
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} aria-hidden="true" />
              </button>

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-400/15 text-orange-300 shadow-lg shadow-orange-950/30">
                <Flame size={42} fill="currentColor" aria-hidden="true" />
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-orange-300">Daily login streak</p>
              <h2 id="login-streak-title" className="mt-3 text-4xl font-black text-white">
                {user?.streak || 0} days
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {user?.streak > 1
                  ? "Amazing consistency. Keep learning tomorrow to continue your streak."
                  : "Great start. Come back tomorrow to build your streak."}
              </p>

              <button
                type="button"
                onClick={dismissLoginStreak}
                className="mt-7 w-full rounded-xl bg-orange-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-orange-300 active:scale-[0.98]"
              >
                Continue learning
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-dialog-title"
              className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl shadow-black/40 sm:p-8"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                  <LogOut size={23} aria-hidden="true" />
                </div>

                <button
                  type="button"
                  aria-label="Close logout confirmation"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <h2 id="logout-dialog-title" className="mt-6 text-2xl font-black">
                Log out of MathMind?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your progress is saved. You can sign back in whenever you are ready to learn.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400 active:scale-[0.98]"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;