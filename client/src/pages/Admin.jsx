import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  FolderMinus,
  FolderPlus,
  FileMinus,
  FilePlus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

const emptyTopic = { title: "", description: "", icon: "📚", difficulty: "Beginner", order: "" };
const emptyLesson = { topic: "", title: "", questionSetKey: "", description: "", videoUrl: "", difficulty: "Beginner", order: "1", duration: "10" };
const emptyStudent = { firstName: "", lastName: "", email: "", password: "" };

// ── Small reusable spinner ──────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
    </div>
  );
}



function Admin() {
  // ── Data state ──────────────────────────────────────────────────────────
  const [overview, setOverview] = useState({ metrics: {}, recentStudents: [], topics: [], lessons: [] });
  const [allStudents, setAllStudents] = useState([]);

  // ── Form state ──────────────────────────────────────────────────────────
  const [topicForm, setTopicForm] = useState(emptyTopic);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [studentForm, setStudentForm] = useState(emptyStudent);

  // ── Navigation ──────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState("overview"); // "overview" | "students" | "content"
  const [activeForm, setActiveForm] = useState("addTopic"); // "addTopic" | "removeTopic" | "addLesson" | "removeLesson"

  // ── Search / confirm ────────────────────────────────────────────────────
  const [studentSearch, setStudentSearch] = useState("");
  const [topicSearch, setTopicSearch] = useState("");
  const [lessonSearch, setLessonSearch] = useState("");
  const [lessonTopicFilter, setLessonTopicFilter] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // ── Loading / feedback ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ── Helpers ─────────────────────────────────────────────────────────────
  const clearFeedback = () => { setMessage(""); setError(""); };
  const updateForm = (setter) => (e) => setter((cur) => ({ ...cur, [e.target.name]: e.target.value }));

  // ── Data loaders ─────────────────────────────────────────────────────────
  const loadOverview = async () => {
    setLoading(true);
    clearFeedback();
    try {
      const { data } = await api.get("/admin/overview");
      setOverview(data);
      if (!lessonForm.topic && data.topics?.[0]?._id) {
        setLessonForm((cur) => ({ ...cur, topic: data.topics[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const loadAllStudents = async () => {
    setStudentsLoading(true);
    try {
      const { data } = await api.get("/admin/students");
      setAllStudents(data.students || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load student list.");
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => { loadOverview(); }, []);
  useEffect(() => { if (activeSection === "students") loadAllStudents(); }, [activeSection]);

  // ── Topic handlers ───────────────────────────────────────────────────────
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    setSaving(true); clearFeedback();
    try {
      await api.post("/topics", { ...topicForm, order: Number(topicForm.order || overview.topics.length + 1) });
      setTopicForm(emptyTopic);
      setMessage("Topic created successfully.");
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create topic.");
    } finally { setSaving(false); }
  };

  const handleDeleteTopic = async (id) => {
    setRemovingId(id); clearFeedback();
    try {
      await api.delete(`/topics/${id}`);
      setMessage("Topic and its lessons removed successfully.");
      setConfirmId(null);
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete topic.");
    } finally { setRemovingId(null); }
  };

  // ── Lesson handlers ───────────────────────────────────────────────────────
  const handleCreateLesson = async (e) => {
    e.preventDefault();
    setSaving(true); clearFeedback();
    try {
      await api.post("/lessons", { ...lessonForm, order: Number(lessonForm.order), duration: Number(lessonForm.duration) });
      setLessonForm((cur) => ({ ...emptyLesson, topic: cur.topic }));
      setMessage("Lesson created successfully.");
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create lesson.");
    } finally { setSaving(false); }
  };

  const handleDeleteLesson = async (id) => {
    setRemovingId(id); clearFeedback();
    try {
      await api.delete(`/lessons/${id}`);
      setMessage("Lesson removed successfully.");
      setConfirmId(null);
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete lesson.");
    } finally { setRemovingId(null); }
  };

  // ── Student handlers ──────────────────────────────────────────────────────
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSaving(true); clearFeedback();
    try {
      await api.post("/admin/students", studentForm);
      setStudentForm(emptyStudent);
      setMessage("Student account created successfully.");
      await loadAllStudents();
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create student.");
    } finally { setSaving(false); }
  };

  const handleRemoveStudent = async (id) => {
    setRemovingId(id); clearFeedback();
    try {
      await api.delete(`/admin/students/${id}`);
      setAllStudents((prev) => prev.filter((s) => s._id !== id));
      setMessage("Student removed successfully.");
      setConfirmId(null);
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove student.");
    } finally { setRemovingId(null); }
  };

  // ── Derived lists ─────────────────────────────────────────────────────────
  const metrics = [
    ["Students", overview.metrics.studentCount || 0, Users, "text-cyan-300"],
    ["Topics", overview.metrics.topicCount || 0, LayoutDashboard, "text-indigo-300"],
    ["Lessons", overview.metrics.lessonCount || 0, BookOpen, "text-amber-300"],
    ["Progress records", overview.metrics.progressCount || 0, CheckCircle2, "text-emerald-300"],
  ];

  const navItems = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "students", label: "Students", icon: Users },
    { key: "content", label: "Content", icon: BookOpen },
  ];

  const contentTabs = [
    { key: "addTopic", label: "Add Topic", icon: FolderPlus, color: "text-emerald-400" },
    { key: "removeTopic", label: "Remove Topic", icon: FolderMinus, color: "text-rose-400" },
    { key: "addLesson", label: "Add Lesson", icon: FilePlus, color: "text-indigo-400" },
    { key: "removeLesson", label: "Remove Lesson", icon: FileMinus, color: "text-orange-400" },
  ];

  const filteredStudents = allStudents.filter((s) => {
    const q = studentSearch.toLowerCase();
    return !q || [s.firstName, s.lastName, s.email].some((v) => v?.toLowerCase().includes(q));
  });

  const filteredTopics = overview.topics.filter((t) => {
    const q = topicSearch.toLowerCase();
    return !q || t.title?.toLowerCase().includes(q);
  });

  const filteredLessons = overview.lessons.filter((l) => {
    const q = lessonSearch.toLowerCase();
    const matchesSearch = !q || l.title?.toLowerCase().includes(q);
    const matchesTopic = !lessonTopicFilter || l.topic?._id === lessonTopicFilter;
    return matchesSearch && matchesTopic;
  });

  // ── Shared remove-list row renderer ──────────────────────────────────────
  const RemoveRow = ({ id, onDelete, children }) => (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
      <div className="min-w-0 flex-1">{children}</div>
      {confirmId === id ? (
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onDelete(id)}
            disabled={removingId === id}
            className="rounded-lg bg-rose-500 px-2 py-1 text-xs font-bold hover:bg-rose-400 disabled:opacity-60 transition-colors"
          >
            {removingId === id ? "…" : "Confirm"}
          </button>
          <button
            onClick={() => setConfirmId(null)}
            className="rounded-lg bg-slate-700 px-2 py-1 text-xs font-bold hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmId(id)}
          title="Remove"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-all"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              <ShieldCheck size={15} /> Admin workspace
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Keep learning content healthy.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Monitor learner activity, manage student accounts, and maintain the topic and lesson catalog.
            </p>
          </div>
          <span className="w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200">
            Admin access verified
          </span>
        </motion.header>

        {/* Top-level Section Nav */}
        <div className="mt-6 flex gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1 w-fit">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setActiveSection(key); clearFeedback(); setConfirmId(null); }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                activeSection === key
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div role="alert" className="mt-5 rounded-2xl border border-rose-300/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}
        {message && (
          <div role="status" className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ══════════════ OVERVIEW ══════════════ */}
          {activeSection === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map(([label, value, Icon, color]) => (
                  <div key={label} className="motion-surface rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <Icon className={color} size={20} />
                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                    <p className="mt-1 text-3xl font-black">{loading ? "..." : value}</p>
                  </div>
                ))}
              </section>

              <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Recent learners</p>
                      <h2 className="mt-1 text-2xl font-black">Activity snapshot</h2>
                    </div>
                    <Users className="text-cyan-300" size={22} />
                  </div>
                  <div className="mt-5 space-y-2">
                    {overview.recentStudents.length === 0 ? (
                      <p className="rounded-xl bg-slate-950/40 p-5 text-sm text-slate-500">No student accounts yet.</p>
                    ) : overview.recentStudents.map((student) => (
                      <div key={student._id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-xs font-black text-indigo-200">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{student.firstName} {student.lastName}</p>
                          <p className="truncate text-xs text-slate-500">{student.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-200">{student.xp || 0} XP</p>
                          <p className="text-xs text-slate-500">Level {student.level || 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">Content inventory</p>
                  <h2 className="mt-1 text-2xl font-black">Topics and lessons</h2>
                  <div className="mt-5 space-y-3">
                    {overview.topics.map((topic) => (
                      <div key={topic._id} className="flex items-center justify-between rounded-xl bg-slate-950/35 px-4 py-3">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <span>{topic.icon}</span>{topic.title}
                        </span>
                        <span className="text-xs text-slate-500">
                          {overview.lessons.filter((l) => l.topic?._id === topic._id).length} lessons
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* ══════════════ STUDENTS ══════════════ */}
          {activeSection === "students" && (
            <motion.div key="students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">

                {/* Add Student */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                      <UserPlus className="text-emerald-300" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Student management</p>
                      <h2 className="text-xl font-black">Add student</h2>
                    </div>
                  </div>
                  <form onSubmit={handleAddStudent} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input required name="firstName" value={studentForm.firstName} onChange={updateForm(setStudentForm)} placeholder="First name" className="admin-input" id="admin-student-firstname" />
                      <input required name="lastName" value={studentForm.lastName} onChange={updateForm(setStudentForm)} placeholder="Last name" className="admin-input" id="admin-student-lastname" />
                    </div>
                    <input required type="email" name="email" value={studentForm.email} onChange={updateForm(setStudentForm)} placeholder="Email address" className="admin-input w-full" id="admin-student-email" />
                    <input required type="password" name="password" value={studentForm.password} onChange={updateForm(setStudentForm)} placeholder="Temporary password (min 6 chars)" className="admin-input w-full" id="admin-student-password" minLength={6} />
                    <button id="admin-add-student-btn" disabled={saving} className="motion-button flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-60">
                      <UserPlus size={16} />
                      {saving ? "Creating..." : "Create student account"}
                    </button>
                  </form>
                </div>

                {/* Remove Student */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15">
                        <UserMinus className="text-rose-300" size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Student management</p>
                        <h2 className="text-xl font-black">Remove student</h2>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">{allStudents.length} total</span>
                  </div>
                  <input type="text" placeholder="Search by name or email…" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="admin-input w-full mb-4" id="admin-student-search" />
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                    {studentsLoading ? <Spinner /> : filteredStudents.length === 0 ? (
                      <p className="rounded-xl bg-slate-950/40 p-5 text-center text-sm text-slate-500">
                        {studentSearch ? "No students match your search." : "No student accounts found."}
                      </p>
                    ) : filteredStudents.map((s) => (
                      <RemoveRow key={s._id} id={s._id} onDelete={handleRemoveStudent}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-xs font-black text-indigo-200">
                            {s.firstName?.[0]}{s.lastName?.[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{s.firstName} {s.lastName}</p>
                            <p className="truncate text-xs text-slate-500">{s.email}</p>
                          </div>
                          <div className="ml-auto text-right hidden sm:block">
                            <p className="text-sm font-bold text-amber-200">{s.xp || 0} XP</p>
                            <p className="text-xs text-slate-500">Lv {s.level || 1}</p>
                          </div>
                        </div>
                      </RemoveRow>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════ CONTENT ══════════════ */}
          {activeSection === "content" && (
            <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

              {/* Content sub-tab bar */}
              <div className="mt-8 flex flex-wrap gap-2">
                {contentTabs.map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    type="button"
                    id={`admin-content-tab-${key}`}
                    onClick={() => { setActiveForm(key); clearFeedback(); setConfirmId(null); }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold border transition-all ${
                      activeForm === key
                        ? "border-indigo-500/50 bg-indigo-500/15 text-white shadow-lg shadow-indigo-500/10"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <Icon size={15} className={activeForm === key ? "text-white" : color} />
                    {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">

                {/* ── Add Topic ── */}
                {activeForm === "addTopic" && (
                  <motion.section key="addTopic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                        <FolderPlus className="text-emerald-300" size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Content operations</p>
                        <h2 className="text-xl font-black">Add new topic</h2>
                      </div>
                    </div>
                    <form onSubmit={handleCreateTopic} className="grid gap-4 md:grid-cols-2">
                      <input required name="title" value={topicForm.title} onChange={updateForm(setTopicForm)} placeholder="Topic title" className="admin-input" id="admin-topic-title" />
                      <input name="icon" value={topicForm.icon} onChange={updateForm(setTopicForm)} placeholder="Icon (emoji)" className="admin-input" id="admin-topic-icon" />
                      <textarea required name="description" value={topicForm.description} onChange={updateForm(setTopicForm)} placeholder="What will students learn?" className="admin-input min-h-24 md:col-span-2" id="admin-topic-desc" />
                      <select name="difficulty" value={topicForm.difficulty} onChange={updateForm(setTopicForm)} className="admin-input" id="admin-topic-difficulty">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                      <input name="order" type="number" value={topicForm.order} onChange={updateForm(setTopicForm)} placeholder="Display order" className="admin-input" id="admin-topic-order" />
                      <button disabled={saving} id="admin-create-topic-btn" className="motion-button flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold md:col-span-2 hover:bg-emerald-400 transition-colors disabled:opacity-60">
                        <Plus size={16} />{saving ? "Saving..." : "Create topic"}
                      </button>
                    </form>
                  </motion.section>
                )}

                {/* ── Remove Topic ── */}
                {activeForm === "removeTopic" && (
                  <motion.section key="removeTopic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15">
                          <FolderMinus className="text-rose-300" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-rose-300">Content operations</p>
                          <h2 className="text-xl font-black">Remove topic</h2>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">{overview.topics.length} topics</span>
                    </div>
                    <div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs text-amber-200">
                      ⚠️ Removing a topic will also delete all its lessons and student progress for that topic.
                    </div>
                    <input type="text" placeholder="Search topics…" value={topicSearch} onChange={(e) => setTopicSearch(e.target.value)} className="admin-input w-full mb-4" id="admin-topic-search" />
                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                      {loading ? <Spinner /> : filteredTopics.length === 0 ? (
                        <p className="rounded-xl bg-slate-950/40 p-5 text-center text-sm text-slate-500">
                          {topicSearch ? "No topics match your search." : "No topics found."}
                        </p>
                      ) : filteredTopics.map((t) => (
                        <RemoveRow key={t._id} id={t._id} onDelete={handleDeleteTopic}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{t.icon}</span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold">{t.title}</p>
                              <p className="text-xs text-slate-500">
                                {overview.lessons.filter((l) => l.topic?._id === t._id).length} lessons · {t.difficulty}
                              </p>
                            </div>
                          </div>
                        </RemoveRow>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* ── Add Lesson ── */}
                {activeForm === "addLesson" && (
                  <motion.section key="addLesson" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15">
                        <FilePlus className="text-indigo-300" size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">Content operations</p>
                        <h2 className="text-xl font-black">Add new lesson</h2>
                      </div>
                    </div>
                    <form onSubmit={handleCreateLesson} className="grid gap-4 md:grid-cols-2">
                      <select required name="topic" value={lessonForm.topic} onChange={updateForm(setLessonForm)} className="admin-input" id="admin-lesson-topic">
                        <option value="">Choose topic</option>
                        {overview.topics.map((t) => (
                          <option key={t._id} value={t._id}>{t.icon} {t.title}</option>
                        ))}
                      </select>
                      <input required name="title" value={lessonForm.title} onChange={updateForm(setLessonForm)} placeholder="Lesson title" className="admin-input" id="admin-lesson-title" />
                      <input required name="questionSetKey" value={lessonForm.questionSetKey} onChange={updateForm(setLessonForm)} placeholder="Question set key" className="admin-input" id="admin-lesson-qkey" />
                      <input required name="videoUrl" value={lessonForm.videoUrl} onChange={updateForm(setLessonForm)} placeholder="YouTube embed URL" className="admin-input" id="admin-lesson-video" />
                      <textarea required name="description" value={lessonForm.description} onChange={updateForm(setLessonForm)} placeholder="Lesson description" className="admin-input min-h-24 md:col-span-2" id="admin-lesson-desc" />
                      <select name="difficulty" value={lessonForm.difficulty} onChange={updateForm(setLessonForm)} className="admin-input" id="admin-lesson-difficulty">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                      <div className="grid grid-cols-2 gap-4">
                        <input required name="order" type="number" value={lessonForm.order} onChange={updateForm(setLessonForm)} placeholder="Order" className="admin-input" id="admin-lesson-order" />
                        <input required name="duration" type="number" value={lessonForm.duration} onChange={updateForm(setLessonForm)} placeholder="Minutes" className="admin-input" id="admin-lesson-duration" />
                      </div>
                      <button disabled={saving} id="admin-create-lesson-btn" className="motion-button flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold md:col-span-2 hover:bg-indigo-400 transition-colors disabled:opacity-60">
                        <Plus size={16} />{saving ? "Saving..." : "Create lesson"}
                      </button>
                    </form>
                  </motion.section>
                )}

                {/* ── Remove Lesson ── */}
                {activeForm === "removeLesson" && (
                  <motion.section key="removeLesson" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7"
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15">
                          <FileMinus className="text-orange-300" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-orange-300">Content operations</p>
                          <h2 className="text-xl font-black">Remove lesson</h2>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">{overview.lessons.length} lessons</span>
                    </div>

                    {/* Filters */}
                    <div className="grid gap-3 sm:grid-cols-2 mb-4">
                      <input type="text" placeholder="Search lessons…" value={lessonSearch} onChange={(e) => setLessonSearch(e.target.value)} className="admin-input" id="admin-lesson-search" />
                      <select value={lessonTopicFilter} onChange={(e) => setLessonTopicFilter(e.target.value)} className="admin-input" id="admin-lesson-filter-topic">
                        <option value="">All topics</option>
                        {overview.topics.map((t) => (
                          <option key={t._id} value={t._id}>{t.icon} {t.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                      {loading ? <Spinner /> : filteredLessons.length === 0 ? (
                        <p className="rounded-xl bg-slate-950/40 p-5 text-center text-sm text-slate-500">
                          {lessonSearch || lessonTopicFilter ? "No lessons match your filters." : "No lessons found."}
                        </p>
                      ) : filteredLessons.map((l) => (
                        <RemoveRow key={l._id} id={l._id} onDelete={handleDeleteLesson}>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">{l.title}</p>
                            <p className="truncate text-xs text-slate-500">
                              {l.topic?.title} · {l.difficulty} · {l.duration} min
                            </p>
                          </div>
                        </RemoveRow>
                      ))}
                    </div>
                  </motion.section>
                )}

              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default Admin;
