import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Flame, MessageCircle, Sparkles, Volume2 } from "lucide-react";
import mathDiscussionImage from "../assets/math-discussion.jpg";
import learningInPracticeImage from "../assets/learning-in-practice.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IconGlyph from "../components/IconGlyph";
import FloatingMathCanvas from "../components/FloatingMathCanvas";
import { useAuth } from "../context/authContext";
import { playNotificationChime } from "../utils/soundEffects";
import api from "../services/api";

function Home() {
  const { user } = useAuth();
  const [dailyProgress, setDailyProgress] = useState({ attempts: 0, limit: 5 });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 3D Scroll Effects
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 900], [1, 0.96]);
  const heroRotateX = useTransform(scrollY, [0, 900], [0, 8]);
  const heroOpacity = useTransform(scrollY, [0, 850], [1, 0]);
  const heroY = useTransform(scrollY, [0, 900], [0, 72]);

  useEffect(() => {
    if (!user) return;

    const fetchDailyProgress = async () => {
      try {
        const response = await api.get("/progress/daily");
        if (response.data?.daily) {
          setDailyProgress(response.data.daily);
        }
      } catch (err) {
        console.error("Error fetching daily progress on Home:", err);
      }
    };

    fetchDailyProgress();
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications");
        setNotifications(response.data?.notifications || []);
        setUnreadCount(response.data?.unreadCount || 0);
      } catch (err) {
        console.error("Error fetching notifications on Home:", err);
      }
    };

    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 10000);
    return () => window.clearInterval(interval);
  }, [user]);

  const openNotification = async (notification) => {
    if (!notification.read) {
      try {
        await api.patch(`/notifications/${notification._id}/read`);
        setUnreadCount((count) => Math.max(0, count - 1));
        setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, read: true } : item));
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }
  };

  const currentStreak = user?.streak || 0;
  const streakText = `${currentStreak} ${currentStreak === 1 ? "day" : "days"}`;
  const solvedText = user
    ? `${Math.min(dailyProgress.attempts, dailyProgress.limit)} / ${dailyProgress.limit}`
    : "0 / 5";

  return (
    <div id="top" className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <Navbar />

      {user && unreadCount > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.08] p-5 shadow-lg shadow-cyan-950/20 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">New message</p>
                <h2 className="mt-2 text-xl font-black">Your teacher replied to your question.</h2>
              </div>
              <Link to="/chat" className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">Open teacher chat</Link>
            </div>
            <div className="mt-4 space-y-2">
              {notifications.filter((notification) => !notification.read).slice(0, 3).map((notification) => (
                <Link key={notification._id} to={notification.link || "/chat"} onClick={() => openNotification(notification)} className="block rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 transition hover:bg-slate-950/50">
                  <p className="text-sm font-bold text-white">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-white/10" style={{ perspective: "1500px" }}>
        <motion.div
          style={{
            scale: heroScale,
            rotateX: heroRotateX,
            opacity: heroOpacity,
            y: heroY,
            transformStyle: "preserve-3d",
          }}
          className="origin-top"
        >
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <FloatingMathCanvas />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-28">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
                <motion.span animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 2.5, repeat: Infinity }}><Sparkles size={15} aria-hidden="true" /></motion.span>
                AI-powered mathematics learning
              </div>
              <button
                type="button"
                onClick={playNotificationChime}
                title="Click to test chat notification chime sound"
                className="group inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20 active:scale-95 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
              >
                <Volume2 size={13} className="text-emerald-400 transition group-hover:scale-110" />
                <span>Hear notification chime</span>
              </button>
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.04] tracking-tight sm:text-6xl md:text-7xl">
              Turn confusion into
              <span className="block text-indigo-400">confidence.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              MathMind AI gives students a clear next step, a patient tutor, and practice that grows with every problem they solve.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {user ? (
                user.role === "admin" ? (
                  <Link to="/admin" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-center font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400">Go to Admin Dashboard <ArrowRight size={16} aria-hidden="true" /></Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-center font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400">Go to Dashboard <ArrowRight size={16} aria-hidden="true" /></Link>
                    <Link to="/lessons" className="btn-secondary rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-center font-semibold transition hover:bg-white/10">Explore Lessons</Link>
                  </>
                )
              ) : (
                <>
                  <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-center font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-400">Start Learning <ArrowRight size={16} aria-hidden="true" /></Link>
                  <Link to="/login" className="btn-secondary rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-center font-semibold transition hover:bg-white/10">I Already Have an Account</Link>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-emerald-300" aria-hidden="true" />Step-by-step help</span>
              <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-emerald-300" aria-hidden="true" />15 questions per topic</span>
            </div>
          </motion.div>

          <motion.div className="relative mx-auto w-full max-w-xl" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <motion.div className="home-progress-card absolute -right-2 top-6 z-10 rounded-2xl border border-emerald-300/20 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur sm:-right-8" animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
              <p className="home-progress-label text-[10px] font-bold uppercase tracking-wider text-emerald-300">Today&apos;s progress</p>
              <p className="home-progress-value mt-1 flex items-center gap-1.5 text-lg font-black text-white">{solvedText} solved <Check size={17} className="text-emerald-300" aria-hidden="true" /></p>
            </motion.div>

            <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-white/10 shadow-xl">
              <img
                src={mathDiscussionImage}
                alt="A primary-school teacher explains a geometry lesson to students in a bright classroom"
                className="h-full w-full object-cover object-center"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <p className="absolute bottom-0 left-0 p-4 text-sm font-semibold text-white sm:p-5 sm:text-base">
                Every good question moves learning forward.
              </p>
            </div>

            <div className="cursor-tilt rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl shadow-indigo-950/50 backdrop-blur sm:p-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-5 sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">Live practice</p>
                    <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">Let&apos;s crack this together</h2>
                  </div>
                  <motion.span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}><Sparkles size={20} aria-hidden="true" /></motion.span>
                </div>

                <div className="mt-6 rounded-2xl bg-indigo-500/10 p-5">
                  <p className="text-sm text-slate-400">Question 4 of 15 · Algebra</p>
                  <p className="mt-3 text-lg font-bold leading-8 text-white">Solve <span className="text-indigo-300">3x + 2 = 14</span></p>
                  <div className="mt-5 space-y-3 text-sm">
                    {["Subtract 2 from both sides", "Divide both sides by 3", "Check: 3(4) + 2 = 14"].map((step, index) => (
                      <motion.div key={step} className="flex items-center gap-3 text-slate-300" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + index * 0.25 }}>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-400/15 text-xs font-bold text-indigo-300">{index + 1}</span>
                        {step}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
                  <span className="text-slate-400">Your answer</span>
                  <motion.span className="font-black text-emerald-300" animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 2, repeat: Infinity }}>x = 4</motion.span>
                </div>
              </div>
            </div>

            <motion.div className="absolute -bottom-5 -left-3 rounded-2xl border border-amber-300/20 bg-slate-900 px-4 py-3 shadow-xl sm:-left-8" animate={{ y: [0, 7, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
              <p className="text-xs text-slate-400">Learning streak</p>
              <p className="mt-1 flex items-center gap-1.5 font-black text-amber-300"><Flame size={16} aria-hidden="true" />{streakText}</p>
            </motion.div>
          </motion.div>
        </div>
        </motion.div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="landing-features px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-indigo-400">
              LEARNING FEATURES
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              Everything you need to master Math
            </h2>

            <p className="mt-4 text-slate-400">
              Learn at your own pace with intelligent tools
              designed around your progress.
            </p>
          </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65 }}
              className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-emerald-950/20 sm:aspect-[2.4/1]"
            >
              <img
                src={learningInPracticeImage}
                alt="A teacher leads an interactive classroom lesson as primary-school students take part"
                className="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              <p className="absolute bottom-0 left-0 p-5 text-base font-semibold text-white sm:p-7 sm:text-xl">
                Better understanding starts with working it out together.
              </p>
            </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4" style={{ perspective: "1200px" }}>

            {[
              {
                icon: "ai",
                title: "AI Math Tutor",
                text: "Ask questions and receive step-by-step explanations.",
              },
              {
                icon: "lessons",
                title: "Smart Lessons",
                text: "Learn mathematics through structured lessons.",
              },
              {
                icon: "practice",
                title: "Practice",
                text: "Improve your skills with personalized questions.",
              },
              {
                icon: "progress",
                title: "Track Progress",
                text: "Monitor XP, levels, scores, and learning progress.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 60, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, rotateY: index % 2 === 0 ? 10 : -10, rotateX: -10, zIndex: 10 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-7 hover:bg-white/10 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] transition-colors relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.08] text-emerald-300" style={{ transform: "translateZ(30px)" }}>
                  <IconGlyph name={feature.icon} size={25} />
                </motion.div>

                <motion.h3 className="mt-5 text-xl font-bold" style={{ transform: "translateZ(20px)" }}>
                  {feature.title}
                </motion.h3>

                <motion.p className="mt-3 leading-7 text-slate-400" style={{ transform: "translateZ(10px)" }}>
                  {feature.text}
                </motion.p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="px-6 py-24 relative"
        style={{ perspective: "1000px" }}
      >
        <div className="mx-auto max-w-4xl text-center">

          <motion.h2 
            initial={{ opacity: 0, z: -100, rotateX: 20 }}
            whileInView={{ opacity: 1, z: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold"
          >
            Mathematics doesn't have to be difficult.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-400"
          >
            MathMind AI combines interactive learning,
            personalized practice, and artificial intelligence
            to help students build real mathematical
            understanding instead of simply memorizing answers.
          </motion.p>

          {user ? (
            user.role === "admin" ? (
              <Link
                to="/admin"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 font-semibold transition hover:bg-indigo-400"
              >
                Go to Admin Dashboard <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 font-semibold transition hover:bg-indigo-400"
              >
                Go to Your Dashboard <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )
          ) : (
            <Link
              to="/signup"
              className="mt-8 inline-block rounded-xl bg-indigo-500 px-8 py-4 font-semibold transition hover:bg-indigo-400"
            >
              Create Your Free Account
            </Link>
          )}

        </div>
      </section>

      <Footer />

    </div>
  );
}

export default Home;
