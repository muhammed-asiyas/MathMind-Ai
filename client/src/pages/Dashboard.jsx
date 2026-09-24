import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, LogOut, X, Trophy, Medal, Users, TrendingUp } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import Hero3DWrapper from "../components/Hero3DWrapper";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const dailyGoal = user?.dailyGoal || 10;
  const [dailyProgress, setDailyProgress] = useState({ attempts: 0, limit: dailyGoal });
  const [learningProfile, setLearningProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState({ students: [], currentStudent: null, totalStudents: 0 });
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
        const [topicsResponse, dailyResponse, learningProfileResponse, leaderboardResponse] = await Promise.all([
          api.get("/topics"),
          api.get("/progress/daily"),
          api.get("/progress/learning-profile"),
          api.get("/users/leaderboard").catch(() => ({ data: { students: [], currentStudent: null, totalStudents: 0 } })),
        ]);

        setTopics(topicsResponse.data.topics);
        setDailyProgress(dailyResponse.data.daily || { attempts: 0, limit: dailyGoal });
        setLearningProfile(learningProfileResponse.data.profile || null);
        setLeaderboard(leaderboardResponse.data || { students: [], currentStudent: null, totalStudents: 0 });
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
        <Hero3DWrapper>
          <p className="text-sm font-medium text-indigo-400">
            YOUR LEARNING SPACE
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            Welcome back, {user?.firstName} 👋
          </h1>

          <p className="mt-3 text-slate-400">
            Keep learning and become better at mathematics every day.
          </p>
        </Hero3DWrapper>

        {/* Stats */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: "1000px" }}>

          <motion.div whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }} transition={{ type: "spring", stiffness: 300 }} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6" style={{ transformStyle: "preserve-3d" }}>
            <div className="text-3xl" style={{ transform: "translateZ(30px)" }}>⭐</div>

            <p className="mt-4 text-sm text-slate-400" style={{ transform: "translateZ(20px)" }}>
              Total XP
            </p>

            <p className="mt-1 text-3xl font-black" style={{ transform: "translateZ(10px)" }}>
              {user?.xp || 0}
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, rotateY: -5, rotateX: -5 }} transition={{ type: "spring", stiffness: 300 }} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6" style={{ transformStyle: "preserve-3d" }}>
            <div className="text-3xl" style={{ transform: "translateZ(30px)" }}>🏆</div>

            <p className="mt-4 text-sm text-slate-400" style={{ transform: "translateZ(20px)" }}>
              Current Level
            </p>

            <p className="mt-1 text-3xl font-black" style={{ transform: "translateZ(10px)" }}>
              {learningProfile?.level || user?.level || 1}
            </p>
            <p className="mt-1 text-xs font-semibold text-indigo-300" style={{ transform: "translateZ(10px)" }}>{learningProfile?.title || "Foundation"}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }} transition={{ type: "spring", stiffness: 300 }} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6" style={{ transformStyle: "preserve-3d" }}>
            <div className="text-3xl" style={{ transform: "translateZ(30px)" }}>🔥</div>

            <p className="mt-4 text-sm text-slate-400" style={{ transform: "translateZ(20px)" }}>
              Learning Streak
            </p>

            <p className="mt-1 text-3xl font-black" style={{ transform: "translateZ(10px)" }}>
              {user?.streak || 0}
              <span className="ml-1 text-base font-normal text-slate-400">
                days
              </span>
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05, rotateY: -5, rotateX: -5 }} transition={{ type: "spring", stiffness: 300 }} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6" style={{ transformStyle: "preserve-3d" }}>
            <div className="text-3xl" style={{ transform: "translateZ(30px)" }}>🎯</div>

            <p className="mt-4 text-sm text-slate-400" style={{ transform: "translateZ(20px)" }}>
              Daily Goal
            </p>

            <p className="mt-1 text-3xl font-black" style={{ transform: "translateZ(10px)" }}>
                {Math.min(dailyProgress.attempts, dailyProgress.limit)}/{dailyProgress.limit}
            </p>
          </motion.div>

        </section>

        <motion.section 
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 rounded-3xl border border-amber-300/15 bg-gradient-to-br from-amber-300/[0.08] via-white/[0.04] to-indigo-400/[0.06] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300"><Trophy size={15} /> Learning leaderboard</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">Learn consistently. Move up.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">All-time XP rankings reward completed practice, not just one strong day.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/35 px-3 py-2 text-xs font-semibold text-slate-300"><Users size={14} /> {leaderboard.totalStudents} learners</div>
          </div>

          {leaderboard.students.length > 0 ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-2">
                {leaderboard.students.map((student, index) => {
                  const isCurrentStudent = student.id === String(user?.id || user?._id);
                  const isPodium = student.rank <= 3;
                  return (
                    <motion.div
                      key={student.id}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${isCurrentStudent ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-slate-950/25 hover:bg-white/[0.06]"}`}
                      initial={{ opacity: 0, x: -18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ delay: index * 0.045, duration: 0.35 }}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${student.rank === 1 ? "bg-amber-300 text-slate-950" : student.rank === 2 ? "bg-slate-300 text-slate-950" : student.rank === 3 ? "bg-orange-400 text-slate-950" : "bg-white/10 text-slate-300"}`}>
                        {isPodium ? <Medal size={17} /> : student.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">{student.name}{isCurrentStudent && <span className="ml-2 text-xs font-semibold text-cyan-300">You</span>}</p>
                        <p className="mt-0.5 text-xs text-slate-500">Level {student.level} · {student.streak} day streak</p>
                      </div>
                      <div className="text-right"><p className="text-sm font-black text-amber-200">{student.xp.toLocaleString()} XP</p><p className="text-[10px] uppercase tracking-wider text-slate-500">earned</p></div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/35 p-5">
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-200"><TrendingUp size={17} className="text-cyan-300" /> Your position</div>
                  {leaderboard.currentStudent ? (
                    <>
                      <p className="mt-5 text-5xl font-black text-white">#{leaderboard.currentStudent.rank}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">Keep completing practice questions to climb the rankings.</p>
                    </>
                  ) : <p className="mt-5 text-sm leading-6 text-slate-400">Complete your first practice question to join the leaderboard.</p>}
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-cyan-300">Ranked by lifetime XP</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/25 p-8 text-center">
              <Trophy className="mx-auto text-amber-300" size={30} />
              <p className="mt-3 font-bold text-slate-200">The leaderboard is ready for its first learner.</p>
              <p className="mt-1 text-sm text-slate-500">Complete a practice question to start earning XP.</p>
            </div>
          )}
        </motion.section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.06] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Your learning level</p>
                <h2 className="mt-2 text-2xl font-black">Level {learningProfile?.level || user?.level || 1}: {learningProfile?.title || "Foundation"}</h2>
              </div>
              <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-bold text-cyan-200">{learningProfile?.progressPercent || 0}% to next</span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-950/60">
              <div className="h-full rounded-full bg-cyan-300 transition-all duration-500" style={{ width: `${learningProfile?.progressPercent || 0}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {learningProfile?.nextLevel ? `${learningProfile.nextLevel.requiredXp - (learningProfile.xp || 0)} XP until Level ${learningProfile.nextLevel.level} ${learningProfile.nextLevel.title}.` : "You have reached the highest learning level."}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-300/15 bg-emerald-300/[0.06] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Use maths in real life</p>
            <h2 className="mt-2 text-2xl font-black">Today&apos;s application</h2>
            <p className="mt-4 leading-7 text-slate-300">{learningProfile?.realWorldApplication || "Practice a maths skill and connect it to a real decision, measurement, or plan."}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-300">Focus: {learningProfile?.recommendedTopic || user?.preferredTopic || "Algebra"}</p>
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
                type="button"
                onClick={() => navigate("/ai-tutor")}
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
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: "1000px" }}>

              {topics.map((topic, index) => (
                <motion.div
                  key={topic._id}
                  initial={{ opacity: 0, y: 30, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: index % 2 === 0 ? 5 : -5, rotateX: -5, zIndex: 10 }}
                >
                  <Link
                    to={`/topics/${topic._id}`}
                    className="block h-full group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition duration-300 hover:border-indigo-500/50 hover:bg-white/10 sm:p-6"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div className="text-4xl" style={{ transform: "translateZ(30px)" }}>
                      {topic.icon}
                    </motion.div>

                    <motion.h3 className="mt-5 text-xl font-bold transition group-hover:text-indigo-400" style={{ transform: "translateZ(20px)" }}>
                      {topic.title}
                    </motion.h3>

                    <motion.p className="mt-2 text-sm text-slate-400" style={{ transform: "translateZ(10px)" }}>
                      {topic.description}
                    </motion.p>

                    <div className="mt-4 flex items-center justify-between" style={{ transform: "translateZ(15px)" }}>
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {topic.difficulty}
                      </span>
                      <span className="text-sm font-semibold text-indigo-400">
                        Start →
                      </span>
                    </div>
                  </Link>
                </motion.div>
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