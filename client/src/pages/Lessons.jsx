import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  BookOpen,
  Clock,
  Sparkles,
  Trophy,
  PlayCircle,
  Route,
  LayoutGrid,
  ChevronRight,
  Zap,
  CheckCircle2,
} from "lucide-react";

// Robust fallback data in case database initial request is delayed
const defaultTopicStages = [
  {
    id: "algebra",
    title: "Algebra & Equations",
    icon: "🧮",
    description: "Master variables, expressions, and equation solving.",
    difficulty: "Beginner",
    lessons: [
      {
        id: "l1",
        title: "Variables & Expressions",
        description: "Understand how letters represent unknown quantities in mathematical expressions.",
        duration: 10,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
      },
      {
        id: "l2",
        title: "One-Step Equations",
        description: "Master solving basic equations using inverse operations to isolate variables.",
        duration: 12,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/Qyd_v3DGzTM",
      },
      {
        id: "l3",
        title: "Two-Step & Brackets Equations",
        description: "Solve multi-step linear equations involving coefficients and parentheses.",
        duration: 15,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/9ITsXICV2u0",
      },
    ],
  },
  {
    id: "geometry",
    title: "Geometry & Shapes",
    icon: "📐",
    description: "Explore angles, area, perimeter, and space measurement.",
    difficulty: "Intermediate",
    lessons: [
      {
        id: "l4",
        title: "Angles & Parallel Lines",
        description: "Identify acute, obtuse, right, corresponding, and alternate interior angles.",
        duration: 10,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/DGKwdHMiqCg",
      },
      {
        id: "l5",
        title: "Area & Perimeter Formulae",
        description: "Calculate the perimeter and surface area of rectangles, triangles, and parallelograms.",
        duration: 14,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/xCdxURXMdFY",
      },
      {
        id: "l6",
        title: "Circles & Pythagoras Theorem",
        description: "Work with circumference, circle area, and right-angled triangle side lengths.",
        duration: 18,
        difficulty: "Advanced",
        videoUrl: "https://www.youtube.com/embed/AA6RfgP-AHU",
      },
    ],
  },
  {
    id: "fractions",
    title: "Fractions & Decimals",
    icon: "🍕",
    description: "Build confidence comparing, adding, and multiplying fractions.",
    difficulty: "Beginner",
    lessons: [
      {
        id: "l7",
        title: "Equivalent Fractions & Simplification",
        description: "Learn how to simplify fractions to lowest terms and find equivalent fractions.",
        duration: 8,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw",
      },
      {
        id: "l8",
        title: "Adding & Subtracting Fractions",
        description: "Find common denominators and solve addition/subtraction problems with fractions.",
        duration: 12,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/5juto2ze8Lg",
      },
      {
        id: "l9",
        title: "Multiplying & Dividing Fractions",
        description: "Master fraction multiplication, reciprocals, and division rules.",
        duration: 15,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/qmfXyR7Z6Lk",
      },
    ],
  },
  {
    id: "arithmetic",
    title: "Essential Arithmetic",
    icon: "🔢",
    description: "Strengthen number sense with place value, factors, and operations.",
    difficulty: "Beginner",
    lessons: [
      {
        id: "l10",
        title: "Place Value & Operations",
        description: "Understand units, tens, hundreds, thousands, and multi-digit addition and subtraction.",
        duration: 10,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/T5Qf0qSSJFI",
      },
      {
        id: "l11",
        title: "Multiplication & Long Division",
        description: "Solve multi-digit multiplication and long division calculations with ease.",
        duration: 14,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/T5Qf0qSSJFI",
      },
      {
        id: "l12",
        title: "Factors, Multiples & GCF/LCM",
        description: "Find Prime Factors, Greatest Common Factors (GCF), and Least Common Multiples (LCM).",
        duration: 16,
        difficulty: "Advanced",
        videoUrl: "https://www.youtube.com/embed/jFd-6EPfnec",
      },
    ],
  },
];

function Lessons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTopicId = searchParams.get("topicId");

  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("roadmap"); // "roadmap" | "grid"

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [lessonsRes, topicsRes] = await Promise.all([
          api.get("/lessons"),
          api.get("/topics").catch(() => ({ data: { topics: [] } })),
        ]);

        const fetchedLessons = lessonsRes.data?.lessons || [];
        const fetchedTopics = topicsRes.data?.topics || [];

        setLessons(fetchedLessons);
        setTopics(fetchedTopics);
      } catch (err) {
        console.error("LESSONS FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group lessons by topic for the route map
  const groupedStages = topics.length > 0
    ? topics.map((t) => {
        const topicLessons = lessons.filter(
          (l) => l.topic?._id === t._id || l.topic === t._id
        );
        return {
          id: t._id,
          title: t.title,
          icon: t.icon || "📚",
          description: t.description,
          difficulty: t.difficulty || "Beginner",
          lessons: topicLessons.length > 0 ? topicLessons : [
            {
              _id: `temp-${t._id}-1`,
              title: `${t.title} Core Concepts`,
              description: `Learn foundational ${t.title.toLowerCase()} concepts and worked examples.`,
              duration: 10,
              difficulty: "Beginner",
            },
            {
              _id: `temp-${t._id}-2`,
              title: `${t.title} Guided Practice`,
              description: `Step-by-step problem solving in ${t.title.toLowerCase()}.`,
              duration: 12,
              difficulty: "Intermediate",
            },
            {
              _id: `temp-${t._id}-3`,
              title: `${t.title} Advanced Problems`,
              description: `Master complex ${t.title.toLowerCase()} applications.`,
              duration: 15,
              difficulty: "Advanced",
            },
          ],
        };
      })
    : defaultTopicStages;

  // Filter stages if topic selected
  const activeStages = selectedTopicId
    ? groupedStages.filter((stage) => stage.id === selectedTopicId)
    : groupedStages;

  const totalLessonsCount = activeStages.reduce((acc, stage) => acc + stage.lessons.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <Sparkles size={14} />
              Interactive Learning Path
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Mathematics Route Map
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-400 sm:text-lg">
              Follow your structured learning roadmap. Master each stage through step-by-step lessons, video explanations, and live practice.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("roadmap")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                viewMode === "roadmap"
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Route size={16} />
              Route Map
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={16} />
              Grid View
            </button>
          </div>
        </div>

        {/* Topic Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/10 pb-6">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
              !selectedTopicId
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            All Route Stages ({groupedStages.length})
          </button>

          {groupedStages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSearchParams({ topicId: stage.id })}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
                selectedTopicId === stage.id
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{stage.icon}</span>
              <span>{stage.title}</span>
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-16 flex justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-400">Building your learning route map...</p>
            </div>
          </div>
        )}

        {/* ROUTE MAP ROADMAP VIEW */}
        {!loading && viewMode === "roadmap" && (
          <div className="mt-10 space-y-16">
            {activeStages.map((stage, stageIndex) => (
              <section key={stage.id} className="relative">
                {/* Stage Header Banner */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-6 sm:p-8 backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-3xl shadow-inner">
                      {stage.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                        <span>Stage {stageIndex + 1}</span>
                        <span>•</span>
                        <span>{stage.difficulty}</span>
                      </div>
                      <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                        {stage.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-300">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/topics/${stage.id}`}
                    className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 active:scale-[0.98]"
                  >
                    <Zap size={16} />
                    Start Stage Practice →
                  </Link>
                </div>

                {/* Vertical Connected Route Map Path */}
                <div className="relative mt-8 pl-4 sm:pl-8">
                  {/* Vertical Glowing Route Line */}
                  <div className="absolute bottom-8 left-9 top-4 w-1 bg-gradient-to-b from-indigo-500 via-cyan-400 to-indigo-500/20 rounded-full sm:left-13" />

                  <div className="space-y-8">
                    {stage.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson._id || lesson.id} className="relative flex items-start gap-4 sm:gap-6">
                        {/* Node Pin */}
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 border-2 border-indigo-400 text-xs font-black text-indigo-300 shadow-xl shadow-indigo-950/60 sm:h-12 sm:w-12 sm:text-sm">
                          {stageIndex + 1}.{lessonIndex + 1}
                        </div>

                        {/* Lesson Card */}
                        <div className="group flex-1 rounded-3xl border border-white/10 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/20">
                                <PlayCircle size={13} /> Video Tutorial
                              </span>
                              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 capitalize">
                                {lesson.difficulty || "Beginner"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                              <Clock size={14} />
                              <span>{lesson.duration || 10} min lesson</span>
                            </div>
                          </div>

                          <h3 className="mt-4 text-xl font-bold text-white transition group-hover:text-indigo-400">
                            {lesson.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {lesson.description}
                          </p>

                          <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                              <CheckCircle2 size={14} /> Available to learn
                            </span>

                            <Link
                              to={`/topics/${stage.id}?lessonId=${lesson._id || lesson.id}`}
                              className="flex items-center gap-1 text-sm font-bold text-indigo-400 group-hover:translate-x-1 transition-transform"
                            >
                              Start Lesson <ChevronRight size={16} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Stage Boss Milestone Trophy */}
                    <div className="relative flex items-center gap-4 sm:gap-6 pt-2">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 border-2 border-amber-400 text-amber-300 shadow-xl sm:h-12 sm:w-12">
                        <Trophy size={20} />
                      </div>

                      <div className="flex flex-1 flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 backdrop-blur">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                            Stage Milestone
                          </p>
                          <p className="text-sm font-bold text-white">
                            Complete {stage.title} Practice to Earn +50 XP 🏆
                          </p>
                        </div>

                        <Link
                          to={`/topics/${stage.id}`}
                          className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-300"
                        >
                          Take Topic Challenge →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && viewMode === "grid" && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeStages.flatMap((stage) =>
              stage.lessons.map((lesson, idx) => (
                <Link
                  key={lesson._id || lesson.id || `${stage.id}-${idx}`}
                  to={`/topics/${stage.id}?lessonId=${lesson._id || lesson.id}`}
                  className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-sm font-bold text-indigo-300">
                        {stage.icon}
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-300 border border-white/10">
                        {stage.title}
                      </span>
                    </div>

                    <h2 className="mt-5 text-xl font-bold transition group-hover:text-indigo-400">
                      {lesson.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-300 capitalize">
                        {lesson.difficulty || "Beginner"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {lesson.duration || 10} min
                      </span>
                    </div>

                    <span className="text-sm font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Start →
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Lessons;