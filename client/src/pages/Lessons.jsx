import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Clock,
  Sparkles,
  Trophy,
  PlayCircle,
  Route,
  LayoutGrid,
  ChevronRight,
  Zap,
  CheckCircle2,
  ArrowRight,
  Lock,
  Unlock,
  AlertCircle,
  X,
} from "lucide-react";
import IconGlyph from "../components/IconGlyph";
import { useAuth } from "../context/authContext";

// Fallback roadmap sequence from A to Z (Foundation to Advanced)
const defaultTopicStages = [
  {
    id: "arithmetic",
    order: 1,
    stageNumber: 1,
    title: "Basic Maths & Arithmetic",
    icon: "arithmetic",
    description: "Start here: master place value, multi-digit operations, factors, and foundational number sense.",
    difficulty: "Foundation",
    requiredCorrect: 3,
    lessons: [
      {
        id: "l1",
        title: "Place Value & Core Operations",
        description: "Understand units, tens, hundreds, thousands, and multi-digit addition and subtraction.",
        duration: 10,
        difficulty: "Foundation",
        videoUrl: "https://www.youtube.com/embed/T5Qf0qSSJFI",
      },
      {
        id: "l2",
        title: "Multiplication & Long Division",
        description: "Solve multi-digit multiplication and long division calculations with ease.",
        duration: 12,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/sR83TDp_g2c",
      },
      {
        id: "l3",
        title: "Factors, Multiples & GCF/LCM",
        description: "Find Prime Factors, Greatest Common Factors (GCF), and Least Common Multiples (LCM).",
        duration: 15,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/jFd-6EPfnec",
      },
    ],
  },
  {
    id: "fractions",
    order: 2,
    stageNumber: 2,
    title: "Fractions & Decimals",
    icon: "fractions",
    description: "Build confidence comparing, adding, subtracting, and multiplying fractions using visual models.",
    difficulty: "Beginner",
    requiredCorrect: 3,
    lessons: [
      {
        id: "l4",
        title: "Equivalent Fractions & Simplification",
        description: "Learn how to simplify fractions to lowest terms and find equivalent fractions.",
        duration: 10,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw",
      },
      {
        id: "l5",
        title: "Adding & Subtracting Fractions",
        description: "Find common denominators and solve addition/subtraction problems with fractions.",
        duration: 12,
        difficulty: "Beginner",
        videoUrl: "https://www.youtube.com/embed/5juto2ze8Lg",
      },
      {
        id: "l6",
        title: "Multiplying & Dividing Fractions",
        description: "Master fraction multiplication, reciprocals, and division rules.",
        duration: 15,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/qmfXyR7Z6Lk",
      },
    ],
  },
  {
    id: "algebra",
    order: 3,
    stageNumber: 3,
    title: "Pre-Algebra & Equations",
    icon: "algebra",
    description: "Learn how variables represent unknown values and how equations describe relationships.",
    difficulty: "Intermediate",
    requiredCorrect: 3,
    lessons: [
      {
        id: "l7",
        title: "Variables & Expressions",
        description: "Understand how letters represent unknown quantities in mathematical expressions.",
        duration: 10,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
      },
      {
        id: "l8",
        title: "One-Step Linear Equations",
        description: "Master solving basic equations using inverse operations to isolate variables.",
        duration: 12,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/Qyd_v3DGzTM",
      },
      {
        id: "l9",
        title: "Two-Step & Brackets Equations",
        description: "Solve multi-step linear equations involving coefficients, constants, and parentheses.",
        duration: 15,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/9ITsXICV2u0",
      },
    ],
  },
  {
    id: "geometry",
    order: 4,
    stageNumber: 4,
    title: "Geometry & Spatial Measurement",
    icon: "geometry",
    description: "Explore angles, 2D shapes, perimeter, area, circles, and right-triangle relationships.",
    difficulty: "Intermediate",
    requiredCorrect: 3,
    lessons: [
      {
        id: "l10",
        title: "Angles & Parallel Lines",
        description: "Identify acute, obtuse, right, corresponding, and alternate interior angles.",
        duration: 10,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/DGKwdHMiqCg",
      },
      {
        id: "l11",
        title: "Area & Perimeter Formulae",
        description: "Calculate the perimeter and surface area of rectangles, triangles, and parallelograms.",
        duration: 14,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/xCdxURXMdFY",
      },
      {
        id: "l12",
        title: "Circles & Pythagoras Theorem",
        description: "Work with circumference, circle area, and right-angled triangle side lengths.",
        duration: 18,
        difficulty: "Advanced",
        videoUrl: "https://www.youtube.com/embed/AA6RfgP-AHU",
      },
    ],
  },
  {
    id: "statistics",
    order: 5,
    stageNumber: 5,
    title: "Statistics & Probability",
    icon: "statistics",
    description: "Understand data, averages, spread, probability, and charts used in real-world decisions.",
    difficulty: "Advanced",
    requiredCorrect: 3,
    lessons: [
      {
        id: "l13",
        title: "Data Basics & Display Charts",
        description: "Read tables, bar charts, and data displays with clarity and confidence.",
        duration: 10,
        difficulty: "Intermediate",
        videoUrl: "https://www.youtube.com/embed/qBigTkBLU6g",
      },
      {
        id: "l14",
        title: "Averages & Spread (Mean, Median, Range)",
        description: "Calculate and interpret mean, median, mode, and range for everyday decisions.",
        duration: 14,
        difficulty: "Advanced",
        videoUrl: "https://www.youtube.com/embed/qBigTkBLU6g",
      },
      {
        id: "l15",
        title: "Probability & Real-World Charts",
        description: "Use probability principles and data displays to make informed predictions.",
        duration: 18,
        difficulty: "Advanced",
        videoUrl: "https://www.youtube.com/embed/KzfWUEJjG18",
      },
    ],
  },
];

const normalizeDisplayName = (value) => String(value || "")
  .trim()
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

function getUniqueLessonsByTitle(lessonItems) {
  const seenTitles = new Set();
  return lessonItems.filter((lesson) => {
    const title = normalizeDisplayName(lesson.title);
    if (!title || seenTitles.has(title)) return false;
    seenTitles.add(title);
    return true;
  });
}

function Lessons() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTopicId = searchParams.get("topicId");

  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [roadmapData, setRoadmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roadmapError, setRoadmapError] = useState("");
  const [viewMode, setViewMode] = useState("roadmap"); // "roadmap" | "grid"
  const [lockedModalStage, setLockedModalStage] = useState(null);

  const isAdmin = user?.role === "admin";

  const formatRoadmapError = (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message;
    if (status === 400 || (typeof msg === "string" && msg.toLowerCase().includes("invalid topic"))) {
      // Backend does not have the /roadmap endpoint deployed yet; gracefully fall back
      return "";
    }
    return msg || "Could not refresh your roadmap progress.";
  };

  const refreshRoadmap = useCallback(async () => {
    try {
      const response = await api.get("/progress/roadmap");
      setRoadmapData(response.data?.roadmap || []);
      setRoadmapError("");
    } catch (err) {
      const formatted = formatRoadmapError(err);
      if (formatted) {
        console.error("ROADMAP REFRESH ERROR:", err);
        setRoadmapError(formatted);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [lessonsResult, topicsResult, roadmapResult] = await Promise.allSettled([
          api.get("/lessons"),
          api.get("/topics"),
          api.get("/progress/roadmap"),
        ]);

        const fetchedLessons = lessonsResult.status === "fulfilled" ? lessonsResult.value.data?.lessons || [] : [];
        const fetchedTopics = topicsResult.status === "fulfilled" ? topicsResult.value.data?.topics || [] : [];
        const fetchedRoadmap = roadmapResult.status === "fulfilled" ? roadmapResult.value.data?.roadmap || [] : [];

        setLessons(fetchedLessons);
        setTopics(fetchedTopics);
        setRoadmapData(fetchedRoadmap);

        if (roadmapResult.status === "rejected") {
          const formatted = formatRoadmapError(roadmapResult.reason);
          setRoadmapError(formatted);
        } else {
          setRoadmapError("");
        }
      } catch (err) {
        console.error("LESSONS FETCH ERROR:", err);
        setRoadmapError("Could not load lessons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const refreshProgress = () => {
      if (document.visibilityState !== "visible") return;
      refreshRoadmap();
    };

    window.addEventListener("focus", refreshProgress);
    document.addEventListener("visibilitychange", refreshProgress);
    return () => {
      window.removeEventListener("focus", refreshProgress);
      document.removeEventListener("visibilitychange", refreshProgress);
    };
  }, [refreshRoadmap]);

  // Prefer the topic record with the most associated lessons when legacy duplicates exist.
  const uniqueTopicsByTitle = new Map();
  for (const topic of topics.length > 0 ? topics : defaultTopicStages) {
    const titleKey = normalizeDisplayName(topic.title);
    const topicId = topic._id || topic.id;
    const lessonCount = lessons.filter(
      (lesson) => String(lesson.topic?._id || lesson.topic) === String(topicId)
    ).length;
    const existingTopic = uniqueTopicsByTitle.get(titleKey);
    if (!existingTopic || lessonCount > existingTopic.lessonCount) {
      uniqueTopicsByTitle.set(titleKey, { topic, lessonCount });
    }
  }
  const uniqueTopics = Array.from(uniqueTopicsByTitle.values())
    .map(({ topic }) => topic)
    .sort((first, second) => (first.order || 0) - (second.order || 0));

  // Merge topic data with roadmap lock & progress states
  const groupedStages = uniqueTopics.map((t, idx) => {
    const topicId = t._id || t.id;
    const roadmapItem = roadmapData.find((r) => String(r.topicId) === String(topicId));

    // Lock status calculation:
    // Admin always unlocked. First stage (idx === 0 or order === 1) is unlocked for everyone.
    // Otherwise use backend roadmap calculation or evaluate previous stage completion.
    const isUnlocked = isAdmin
      ? true
      : roadmapItem !== undefined
      ? Boolean(roadmapItem.isUnlocked)
      : idx === 0;

    const isCompleted = roadmapItem ? Boolean(roadmapItem.isCompleted) : false;
    const correctCount = roadmapItem?.correctCount ?? 0;
    const requiredCorrect = roadmapItem?.requiredCorrect || t.requiredCorrectToUnlock || 3;
    const progressPercent = Math.min(100, Math.round((correctCount / requiredCorrect) * 100));

    // Prerequisite info if locked
    const prevTopic = idx > 0 ? uniqueTopics[idx - 1] : null;
    const prerequisite = roadmapItem?.prerequisite || (!isUnlocked && prevTopic ? {
      topicId: prevTopic._id || prevTopic.id,
      stageNumber: prevTopic.stageNumber || idx,
      title: prevTopic.title,
      requiredCorrect: prevTopic.requiredCorrectToUnlock || 3,
    } : null);

    const topicLessons = getUniqueLessonsByTitle(lessons.filter(
      (l) => String(l.topic?._id || l.topic) === String(topicId)
    ));

    return {
      id: topicId,
      order: t.order || idx + 1,
      stageNumber: t.stageNumber || idx + 1,
      title: t.title,
      icon: t.icon || "book",
      description: t.description,
      difficulty: t.difficulty || "Beginner",
      isUnlocked,
      isCompleted,
      correctCount,
      requiredCorrect,
      progressPercent,
      prerequisite,
      lessons: topicLessons.length > 0 ? topicLessons : getUniqueLessonsByTitle(t.lessons || [
        {
          _id: `temp-${topicId}-1`,
          title: `${t.title} Core Concepts`,
          description: `Learn foundational ${t.title.toLowerCase()} concepts and worked examples.`,
          duration: 10,
          difficulty: "Beginner",
        },
        {
          _id: `temp-${topicId}-2`,
          title: `${t.title} Guided Practice`,
          description: `Step-by-step problem solving in ${t.title.toLowerCase()}.`,
          duration: 12,
          difficulty: "Intermediate",
        },
        {
          _id: `temp-${topicId}-3`,
          title: `${t.title} Advanced Problems`,
          description: `Master complex ${t.title.toLowerCase()} applications.`,
          duration: 15,
          difficulty: "Advanced",
        },
      ]),
    };
  });

  // Calculate overall curriculum progression
  const completedStagesCount = groupedStages.filter((s) => s.isCompleted).length;
  const overallProgressPercent = groupedStages.length > 0
    ? Math.round(groupedStages.reduce((total, stage) => total + stage.progressPercent, 0) / groupedStages.length)
    : 0;
  const currentActiveStage = groupedStages.find((s) => s.isUnlocked && !s.isCompleted) || groupedStages[groupedStages.length - 1];

  // Filter stages if topic selected
  const selectedTopic = topics.find(
    (topic) => String(topic._id || topic.id) === String(selectedTopicId)
  );
  const selectedTopicTitle = normalizeDisplayName(selectedTopic?.title);
  const activeStages = selectedTopicId
    ? groupedStages.filter((stage) => String(stage.id) === String(selectedTopicId)
      || (selectedTopicTitle && normalizeDisplayName(stage.title) === selectedTopicTitle))
    : groupedStages;

  const handleStageClick = (e, stage) => {
    if (!stage.isUnlocked) {
      e.preventDefault();
      setLockedModalStage(stage);
    }
  };

  return (
    <div className="lessons-page min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Sparkles size={14} />
              A to Z Sequential Learning Path
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Mathematics Roadmap
            </h1>

            <p className="mt-3 text-base leading-7 text-slate-400 sm:text-lg">
              Learn mathematics step-by-step from Basic Maths up to Advanced levels. Master each section to unlock the next chapter.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="grid w-full grid-cols-2 gap-1.5 self-start rounded-2xl border border-white/10 bg-white/5 p-1.5 sm:w-auto md:w-72 md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("roadmap")}
              className={`flex h-10 w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2.5 text-xs font-bold transition sm:px-4 ${
                viewMode === "roadmap"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Route size={16} />
              Route Map
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex h-10 w-full min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-2.5 text-xs font-bold transition sm:px-4 ${
                viewMode === "grid"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid size={16} />
              Grid View
            </button>
          </div>
        </div>

        {/* Overall Curriculum Progress Bar */}
        {!loading && (
          <div className="lessons-progress-card mt-8 rounded-3xl border border-emerald-500/20 p-6 shadow-xl backdrop-blur">
            {roadmapError && (
              <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                <span>{roadmapError}</span>
                <button type="button" onClick={refreshRoadmap} className="rounded-lg border border-amber-300/30 px-3 py-1.5 text-xs font-bold transition hover:bg-amber-300/10">
                  Retry
                </button>
              </div>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                    {completedStagesCount}/{groupedStages.length}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Roadmap Progression
                  </p>
                </div>
                <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                  {completedStagesCount === groupedStages.length
                    ? "🎉 Congratulations! All 5 stages mastered!"
                    : `Currently mastering: Stage ${currentActiveStage?.stageNumber || 1} · ${currentActiveStage?.title || "Basic Maths"}`}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">
                  {overallProgressPercent}% Complete
                </span>
                {currentActiveStage && (
                  <Link
                    to={`/topics/${currentActiveStage.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                  >
                    Continue Learning <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>

            {/* Stages progress track */}
            <div className="mt-5 grid grid-cols-5 gap-2 sm:gap-3">
              {groupedStages.map((stage, i) => (
                <div key={stage.id} className="space-y-1.5">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full transition-all duration-500 ${
                        stage.isCompleted
                          ? "bg-emerald-400"
                          : stage.isUnlocked
                          ? "bg-emerald-400"
                          : "bg-transparent"
                      }`}
                      style={{ width: stage.isCompleted ? "100%" : stage.isUnlocked ? `${stage.progressPercent}%` : "0%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={`truncate ${stage.isCompleted ? "text-emerald-300" : stage.isUnlocked ? "text-emerald-300" : "text-slate-500"}`}>
                      {stage.isCompleted ? "✓ " : stage.isUnlocked ? "● " : "🔒 "}
                      Stage {i + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/10 pb-6">
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition ${
              !selectedTopicId
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
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
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <IconGlyph name={stage.icon} size={17} />
              <span>{stage.title}</span>
              {stage.isCompleted ? (
                <span className="text-emerald-400 text-xs">✓</span>
              ) : !stage.isUnlocked ? (
                <Lock size={12} className="text-amber-400" />
              ) : null}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <LoadingSpinner label="Building your learning route map..." className="mt-16 py-12" />
        )}

        {/* ROUTE MAP ROADMAP VIEW */}
        {!loading && viewMode === "roadmap" && (
          <div className="mt-10 space-y-16">
            {activeStages.map((stage) => {
              const isLocked = !stage.isUnlocked;

              return (
                <section
                  key={stage.id}
                  className={`relative transition-all duration-300 ${
                    isLocked ? "opacity-75" : "opacity-100"
                  }`}
                >
                  {/* Stage Header Banner */}
                  <div
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl border p-6 sm:p-8 backdrop-blur transition ${
                      stage.isCompleted
                        ? "border-emerald-500/30 bg-emerald-950/20"
                        : !isLocked
                        ? "border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-400/20"
                        : "border-white/10 bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner ${
                          stage.isCompleted
                            ? "bg-emerald-500/20 text-emerald-300"
                            : !isLocked
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {isLocked ? (
                          <Lock size={26} className="text-amber-400" />
                        ) : (
                          <IconGlyph name={stage.icon} size={28} />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
                          <span
                            className={
                              stage.isCompleted
                                ? "text-emerald-300"
                                : !isLocked
                                ? "text-emerald-300"
                                : "text-slate-400"
                            }
                          >
                            Stage {stage.stageNumber}
                          </span>
                          <span>•</span>
                          <span className="text-slate-400">{stage.difficulty}</span>

                          {stage.isCompleted ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 size={12} /> Mastered
                            </span>
                          ) : isLocked ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                              <Lock size={12} /> Locked Section
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                              <Unlock size={12} /> Unlocked
                            </span>
                          )}
                        </div>

                        <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                          {stage.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-300">
                          {stage.description}
                        </p>

                        {/* Lock / Unlock Criteria Note */}
                        {isLocked && stage.prerequisite && (
                          <p className="mt-2 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                            <AlertCircle size={14} />
                            Complete {stage.prerequisite.requiredCorrect || 3} correct questions in Stage {stage.prerequisite.stageNumber}: {stage.prerequisite.title} to unlock.
                          </p>
                        )}
                        {!isLocked && !stage.isCompleted && (
                          <p className="mt-2 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                            <Zap size={14} />
                            Complete {stage.requiredCorrect} correct questions to unlock the next chapter! ({stage.correctCount}/{stage.requiredCorrect})
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isLocked ? (
                        <button
                          type="button"
                          onClick={() => setLockedModalStage(stage)}
                          className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm font-bold text-amber-300 transition hover:bg-amber-400/20 active:scale-[0.98]"
                        >
                          <Lock size={16} /> Locked (View Requirement)
                        </button>
                      ) : (
                        <Link
                          to={`/topics/${stage.id}`}
                          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition active:scale-[0.98] ${
                            stage.isCompleted
                              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25"
                              : "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25"
                          }`}
                        >
                          <Zap size={16} />
                          {stage.isCompleted ? "Review Stage Practice" : "Start Stage Practice"}{" "}
                          <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Vertical Connected Route Map Path */}
                  <div className="relative mt-8 pl-4 sm:pl-8">
                    {/* Vertical Glowing Route Line */}
                    <div
                      className={`absolute bottom-8 left-9 top-4 w-1 rounded-full sm:left-13 ${
                        isLocked
                          ? "bg-white/10"
                          : "bg-gradient-to-b from-emerald-500 via-emerald-300 to-emerald-500/20"
                      }`}
                    />

                    <div className="space-y-8">
                      {stage.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson._id || lesson.id}
                          className="relative flex items-start gap-4 sm:gap-6"
                        >
                          {/* Node Pin */}
                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 text-xs font-black sm:h-12 sm:w-12 sm:text-sm ${
                              isLocked
                                ? "border-slate-700 bg-slate-900 text-slate-500"
                                : stage.isCompleted
                                ? "border-emerald-400 bg-slate-900 text-emerald-300 shadow-emerald-950/60"
                                : "border-emerald-400 bg-slate-900 text-emerald-300 shadow-emerald-950/60"
                            }`}
                          >
                            {isLocked ? (
                              <Lock size={14} className="text-slate-500" />
                            ) : (
                              `${stage.stageNumber}.${lessonIndex + 1}`
                            )}
                          </div>

                          {/* Lesson Card */}
                          <div
                            className={`group flex-1 rounded-3xl border p-5 sm:p-6 shadow-xl backdrop-blur transition duration-300 ${
                              isLocked
                                ? "border-white/5 bg-slate-900/50 cursor-pointer hover:border-amber-400/30"
                                : "border-white/10 bg-slate-900/90 hover:border-emerald-500/40 hover:bg-slate-900"
                            }`}
                            onClick={(e) => handleStageClick(e, stage)}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/20">
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

                            <h3
                              className={`mt-4 text-xl font-bold transition ${
                                isLocked
                                  ? "text-slate-300 group-hover:text-amber-300"
                                  : "text-white group-hover:text-emerald-400"
                              }`}
                            >
                              {lesson.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {lesson.description}
                            </p>

                            <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between">
                              {isLocked ? (
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                                  <Lock size={13} /> Locked until previous stage completed
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                                  <CheckCircle2 size={14} /> Available to learn
                                </span>
                              )}

                              {isLocked ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLockedModalStage(stage);
                                  }}
                                  className="flex items-center gap-1 text-xs font-bold text-amber-300 hover:underline"
                                >
                                  Unlock Info <ChevronRight size={14} />
                                </button>
                              ) : (
                                <Link
                                  to={`/topics/${stage.id}?lessonId=${lesson._id || lesson.id}`}
                                  className="flex items-center gap-1 text-sm font-bold text-emerald-400 group-hover:translate-x-1 transition-transform"
                                >
                                  Start Lesson <ChevronRight size={16} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Stage Boss Milestone Trophy */}
                      <div className="relative flex items-center gap-4 sm:gap-6 pt-2">
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 sm:h-12 sm:w-12 ${
                            isLocked
                              ? "border-slate-700 bg-slate-900 text-slate-600"
                              : "border-amber-400 bg-amber-400/20 text-amber-300 shadow-xl"
                          }`}
                        >
                          <Trophy size={20} />
                        </div>

                        <div
                          className={`flex flex-1 flex-wrap items-center justify-between gap-4 rounded-2xl border px-5 py-4 backdrop-blur ${
                            isLocked
                              ? "border-white/5 bg-slate-900/40 text-slate-400"
                              : "border-amber-400/20 bg-amber-400/10 text-white"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                              Stage Milestone
                            </p>
                            <p className="text-sm font-bold">
                              Complete {stage.title} Practice to master Stage {stage.stageNumber} and earn XP!
                            </p>
                          </div>

                          {isLocked ? (
                            <button
                              type="button"
                              onClick={() => setLockedModalStage(stage)}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                            >
                              <Lock size={13} /> Locked Challenge
                            </button>
                          ) : (
                            <Link
                              to={`/topics/${stage.id}`}
                              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-300"
                            >
                              Take Stage Challenge <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* GRID VIEW */}
        {!loading && viewMode === "grid" && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeStages.flatMap((stage) =>
              stage.lessons.map((lesson, idx) => {
                const isLocked = !stage.isUnlocked;

                return (
                  <div
                    key={lesson._id || lesson.id || `${stage.id}-${idx}`}
                    onClick={(e) => handleStageClick(e, stage)}
                    className={`group flex flex-col justify-between rounded-3xl border p-6 shadow-xl transition duration-300 ${
                      isLocked
                        ? "border-white/5 bg-slate-900/50 opacity-70 cursor-pointer hover:border-amber-400/40"
                        : "border-white/10 bg-slate-900/90 hover:border-emerald-500/50 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                          {isLocked ? (
                            <Lock size={18} className="text-amber-400" />
                          ) : (
                            <IconGlyph name={stage.icon} size={21} />
                          )}
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                            isLocked
                              ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                              : "border-white/10 bg-white/5 text-emerald-300"
                          }`}
                        >
                          {isLocked ? "🔒 " : ""}Stage {stage.stageNumber} · {stage.title}
                        </span>
                      </div>

                      <h2
                        className={`mt-5 text-xl font-bold transition ${
                          isLocked ? "text-slate-300" : "group-hover:text-emerald-400"
                        }`}
                      >
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

                      {isLocked ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLockedModalStage(stage);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline"
                        >
                          <Lock size={12} /> Locked
                        </button>
                      ) : (
                        <Link
                          to={`/topics/${stage.id}?lessonId=${lesson._id || lesson.id}`}
                          className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400 group-hover:translate-x-1 transition-transform"
                        >
                          Start <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* LOCKED STAGE GUIDANCE MODAL */}
        {lockedModalStage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 backdrop-blur-sm"
            onClick={() => setLockedModalStage(null)}
          >
            <div
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-400/30 bg-slate-900 p-6 sm:p-8 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLockedModalStage(null)}
                className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 border border-amber-400/30">
                <Lock size={28} />
              </div>

              <div className="mt-4">
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
                  Sequential Roadmap
                </span>
                <h3 className="mt-3 text-2xl font-black text-white">
                  Stage {lockedModalStage.stageNumber}: {lockedModalStage.title} is Locked
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  To learn mathematics simply and step-by-step from A to Z, students must complete each chapter sequentially.
                </p>
              </div>

              {lockedModalStage.prerequisite && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Prerequisite Requirement:
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Complete Stage {lockedModalStage.prerequisite.stageNumber}: {lockedModalStage.prerequisite.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Answer at least {lockedModalStage.prerequisite.requiredCorrect || 3} practice questions correctly to unlock {lockedModalStage.title}.
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                {lockedModalStage.prerequisite ? (
                  <button
                    type="button"
                    onClick={() => {
                      const prereqId = lockedModalStage.prerequisite.topicId;
                      setLockedModalStage(null);
                      navigate(`/topics/${prereqId}`);
                    }}
                    className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                  >
                    Go to Prerequisite Stage
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setLockedModalStage(null);
                      navigate(`/topics/${groupedStages[0]?.id}`);
                    }}
                    className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
                  >
                    Start with Basic Maths
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setLockedModalStage(null)}
                  className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Lessons;