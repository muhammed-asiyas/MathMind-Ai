import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { LayoutDashboard, BookOpen, LogOut, Menu, X, User, Target, ShieldCheck, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const pathname = location.pathname;
  const hash = location.hash;

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const featuresEl = document.getElementById("features");
      const aboutEl = document.getElementById("about");
      const scrollPosition = window.scrollY + 200;

      if (aboutEl && scrollPosition >= aboutEl.offsetTop) {
        setActiveSection("about");
      } else if (featuresEl && scrollPosition >= featuresEl.offsetTop) {
        setActiveSection("features");
      } else {
        setActiveSection("home");
      }
    };

    if (hash === "#features") {
      setActiveSection("features");
    } else if (hash === "#about") {
      setActiveSection("about");
    } else {
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, hash]);

  const isFeaturesActive = pathname === "/" && (activeSection === "features" || hash === "#features");
  const isAboutActive = pathname === "/" && (activeSection === "about" || hash === "#about");
  const isLessonsActive = pathname === "/lessons" || pathname.startsWith("/topics");
  const isDashboardActive = pathname === "/dashboard";
  const isProfileActive = pathname === "/profile";
  const isChatActive = pathname === "/chat";
  const isLoginActive = pathname === "/login";
  const isSignupActive = pathname === "/signup";

  const handleAnchorClick = (e, sectionId) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${sectionId}`);
        setActiveSection(sectionId);
      }
    }
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header>
      <nav className="fixed left-0 right-0 top-0 z-50 w-full border-b border-white/[0.12] bg-slate-950/60 shadow-[0_12px_40px_rgba(2,6,23,0.28)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:py-5">
          <Link to="/" className="group relative text-2xl font-extrabold tracking-tight text-white transition duration-300 hover:text-indigo-100">
            MathMind<span className="text-indigo-400"> AI</span>
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-300 transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-1.5 shadow-inner shadow-white/[0.03] md:flex">
            <a
              href="/#features"
              onClick={(e) => handleAnchorClick(e, "features")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                isFeaturesActive
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              Features
            </a>

            <a
              href="/#about"
              onClick={(e) => handleAnchorClick(e, "about")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                isAboutActive
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              About
            </a>

            {user ? (
              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                {user.role !== "admin" && (
                  <>
                    <Link
                      to="/study-hub"
                      className="flex items-center gap-1.5 rounded-xl border border-transparent px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                    >
                      <Target size={16} />
                      Study Hub
                    </Link>

                    <Link
                      to="/lessons"
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isLessonsActive
                          ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                          : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                    >
                      <BookOpen size={16} />
                      Lessons
                    </Link>

                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        isDashboardActive
                          ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                          : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  </>
                )}

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition-all hover:bg-cyan-300/15"
                  >
                    <ShieldCheck size={16} />
                    Admin
                  </Link>
                )}

                <Link
                  to="/chat"
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                    isChatActive
                      ? "bg-cyan-300/15 text-cyan-200 border border-cyan-300/30 font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <MessageCircle size={16} />
                  Chat
                </Link>

                <div className="flex items-center gap-3 pl-2">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                      isProfileActive
                        ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <User size={15} className="text-indigo-400" />
                    {user.firstName || "Student"}
                  </Link>

                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    title="Logout"
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                <Link
                  to="/login"
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isLoginActive
                      ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                    isSignupActive
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40"
                      : "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-3 md:hidden">
            {user && user.role !== "admin" && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isDashboardActive
                    ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-white/10 bg-white/[0.06] p-2 text-slate-300 shadow-inner shadow-white/[0.04] transition hover:border-indigo-300/30 hover:bg-indigo-400/10 hover:text-white"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={mobileMenuOpen ? "close" : "open"}
                  className="flex"
                  initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              className="overflow-hidden border-t border-white/[0.08] bg-slate-950/55 shadow-[0_18px_40px_rgba(2,6,23,0.3)] backdrop-blur-2xl md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="space-y-3 px-6 py-4">
            <a
              href="/#features"
              onClick={(e) => {
                handleAnchorClick(e, "features");
                setMobileMenuOpen(false);
              }}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isFeaturesActive
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              Features
            </a>
            <a
              href="/#about"
              onClick={(e) => {
                handleAnchorClick(e, "about");
                setMobileMenuOpen(false);
              }}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isAboutActive
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              About
            </a>

            {user ? (
              <div className="border-t border-white/10 pt-3 space-y-3">
                <p className="text-xs text-indigo-300 font-medium px-3">
                  Logged in as {user.firstName} {user.lastName}
                </p>
                <Link
                  to="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isChatActive
                      ? "bg-cyan-300/15 text-cyan-200 border border-cyan-300/30 font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <MessageCircle size={16} />
                  Teacher chat
                </Link>
                {user.role !== "admin" && (
                  <>
                    <Link
                      to="/study-hub"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <Target size={16} />
                      Study Hub
                    </Link>
                    <Link
                      to="/lessons"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isLessonsActive
                          ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <BookOpen size={16} />
                      Lessons
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        isDashboardActive
                          ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  </>
                )}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-300/10"
                  >
                    <ShieldCheck size={16} />
                    Admin workspace
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isProfileActive
                      ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <User size={16} />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full text-left transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-center rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    isLoginActive
                      ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-400 font-semibold"
                      : "border-white/20 text-white hover:bg-white/5"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    isSignupActive
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/40"
                      : "bg-indigo-500 text-white hover:bg-indigo-400"
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Flow spacer so page content is never hidden under fixed navbar */}
      <div className="h-[73px] sm:h-[81px] w-full" aria-hidden="true" />

      {/* Real-World App Logout Confirmation Modal Popup */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-modal-title"
              className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900 p-6 shadow-2xl shadow-black/60 sm:p-8"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
                  <LogOut size={22} aria-hidden="true" />
                </div>

                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <h2 id="logout-modal-title" className="mt-5 text-2xl font-black text-white">
                Log out of MathMind AI?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Are you sure you want to log out? Your progress, XP, and daily learning streaks are safely saved.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-600 active:scale-[0.98]"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;

