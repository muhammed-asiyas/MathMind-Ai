import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { LayoutDashboard, BookOpen, LogOut, Menu, X, User, ShieldCheck, MessageCircle, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../services/api";
import { useTheme } from "../context/themeContext";
import { isSoundEnabled, toggleSound, playMessageReceived } from "../utils/soundEffects";
import NotificationToast from "./NotificationToast";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(window.scrollY > 8);
  const [activeSection, setActiveSection] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundActive, setSoundActive] = useState(isSoundEnabled());
  const [toast, setToast] = useState(null);
  const prevUnreadRef = useRef(null);

  const pathname = location.pathname;
  const hash = location.hash;

  useEffect(() => {
    const handleSoundToggle = (e) => {
      setSoundActive(e.detail?.enabled ?? isSoundEnabled());
    };
    window.addEventListener("mathmind:sound-toggle", handleSoundToggle);
    return () => window.removeEventListener("mathmind:sound-toggle", handleSoundToggle);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((current) => {
        const next = window.scrollY > 8;
        return current === next ? current : next;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      prevUnreadRef.current = null;
      return undefined;
    }

    let active = true;
    const loadUnreadCount = async () => {
      try {
        const response = await api.get("/notifications");
        if (!active) return;
        const count = response.data?.unreadCount || 0;
        setUnreadCount(count);

        // If new message arrives and user is not on chat page, play chime & show toast!
        if (prevUnreadRef.current !== null && count > prevUnreadRef.current && pathname !== "/chat") {
          playMessageReceived();
          setToast({
            title: "New chat message",
            sender: user.role === "admin" ? "Student" : "Math Teacher",
            message: "You have a new message waiting in chat.",
            link: "/chat",
          });
          window.setTimeout(() => setToast(null), 6500);
        }
        prevUnreadRef.current = count;
      } catch (error) {
        if (active) console.error("Unable to load chat notification count:", error);
      }
    };

    loadUnreadCount();
    const interval = window.setInterval(loadUnreadCount, 4000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [pathname, user]);

  useEffect(() => {
    if (pathname !== "/") {
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

    handleScroll();

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

  const themeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  const visibleUnreadCount = pathname === "/chat" || !user ? 0 : unreadCount;

  const themeToggle = (
    <motion.button
      type="button"
      onClick={toggleTheme}
      title={themeLabel}
      aria-label={themeLabel}
      whileHover={{ scale: 1.08, rotateX: -8, rotateY: 8 }}
      whileTap={{ scale: 0.9, rotateX: 0, rotateY: 180 }}
      transition={{ type: "spring", stiffness: 360, damping: 18 }}
      className="theme-toggle theme-toggle-3d flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-amber-200"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span key={theme} className="theme-toggle-icon" initial={{ opacity: 0, rotateY: -100, scale: 0.65, z: -12 }} animate={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }} exit={{ opacity: 0, rotateY: 100, scale: 0.65, z: -12 }} transition={{ duration: 0.32, ease: "easeOut" }}>
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );

  const soundLabel = soundActive
    ? "Notification sounds enabled (Click to mute)"
    : "Notification sounds muted (Click to enable)";

  const soundToggle = (
    <motion.button
      type="button"
      onClick={() => {
        const next = toggleSound();
        setSoundActive(next);
      }}
      title={soundLabel}
      aria-label={soundLabel}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      className={`theme-toggle theme-toggle-3d flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${soundActive
        ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]"
        : "border-white/10 bg-white/5 text-slate-400 opacity-70"
        }`}
    >
      {soundActive ? <Volume2 size={17} /> : <VolumeX size={17} />}
    </motion.button>
  );

  const chatLink = (mobile = false) => (
    <Link
      to="/chat"
      onClick={mobile ? () => setMobileMenuOpen(false) : undefined}
      className={`${mobile ? "flex gap-2 rounded-lg px-3 py-2" : "flex items-center gap-1.5 rounded-xl px-3 py-2"} relative font-medium transition-all ${isChatActive
        ? "bg-cyan-300/15 text-cyan-200 border border-cyan-300/30 font-semibold"
        : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
        }`}
    >
      <span className="relative flex items-center">
        <MessageCircle size={mobile ? 16 : 17} />
        {visibleUnreadCount > 0 && (
          <>
            <span className="absolute -top-2 -right-2 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
            </span>
            <span className="chat-badge absolute -right-3 -top-3">
              {visibleUnreadCount > 99 ? "99+" : visibleUnreadCount}
            </span>
          </>
        )}
      </span>
      {mobile ? "Teacher chat" : "Chat"}
    </Link>
  );

  return (
    <header>
      <nav className={`app-navbar fixed left-0 right-0 top-0 z-50 w-full border-b border-white/[0.12] bg-slate-950/60 shadow-[0_12px_40px_rgba(2,6,23,0.28)] backdrop-blur-2xl backdrop-saturate-150 ${isScrolled ? "app-navbar--scrolled" : ""}`}>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:py-5">
          <Link to="/" className="group relative text-2xl font-extrabold tracking-tight text-white transition duration-300 hover:text-indigo-100">
            MathMind<span className="text-indigo-400"> AI</span>
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan-300 transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-1.5 shadow-inner shadow-white/[0.03] lg:flex">
            <a
              href="/#features"
              onClick={(e) => handleAnchorClick(e, "features")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${isFeaturesActive
                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
            >
              Features
            </a>

            <a
              href="/#about"
              onClick={(e) => handleAnchorClick(e, "about")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${isAboutActive
                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
            >
              About
            </a>

            {themeToggle}
            {soundToggle}

              {user ? (
                <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                  {user.role !== "admin" && (
                    <>
                      {/* <Link
                      to="/study-hub"
                      className="flex items-center gap-1.5 rounded-xl border border-transparent px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                    >
                      <Target size={16} />
                      Study Hub
                    </Link> */}

                      <Link
                        to="/lessons"
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${isLessonsActive
                          ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                          : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                          }`}
                      >
                        <BookOpen size={16} />
                        Lessons
                      </Link>

                      <Link
                        to="/dashboard"
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${isDashboardActive
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

                  {chatLink()}

                  <div className="flex items-center gap-3 pl-2">
                    <Link
                      to="/profile"
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${isProfileActive
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
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${isLoginActive
                      ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm shadow-indigo-500/10"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${isSignupActive
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
          <div className="flex items-center gap-3 lg:hidden">
            {user && user.role !== "admin" && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isDashboardActive
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}

            {themeToggle}

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
              className="app-navbar-mobile-menu overflow-hidden border-t border-white/[0.08] bg-slate-950/55 shadow-[0_18px_40px_rgba(2,6,23,0.3)] backdrop-blur-2xl lg:hidden"
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
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${isFeaturesActive
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
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${isAboutActive
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
                    {chatLink(true)}
                    {user.role !== "admin" && (
                      <>
                        <Link
                          to="/lessons"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isLessonsActive
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
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isDashboardActive
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
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isProfileActive
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
                      className={`block text-center rounded-lg border px-4 py-2 text-sm font-medium transition ${isLoginActive
                        ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-400 font-semibold"
                        : "border-white/20 text-white hover:bg-white/5"
                        }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block text-center rounded-lg px-4 py-2 text-sm font-semibold transition ${isSignupActive
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

