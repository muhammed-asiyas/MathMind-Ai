import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, BrainCircuit, Flame, Gauge, Sparkles, Target, TrendingUp } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";

function StudyHub() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [dailyProgress, setDailyProgress] = useState({
    attempts: 0,
    limit: user?.dailyGoal || 10,
    correct: 0,
    wrong: 0,
  });
  const [learningProfile, setLearningProfile] = useState(null);
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudyData = async () => {
      try {
        const [topicsResponse, lessonsResponse, dailyResponse, profileResponse] = await Promise.all([
          api.get("/topics"),
          api.get("/lessons"),
          api.get("/progress/daily"),
          api.get("/progress/learning-profile"),
        ]);

        setTopics(topicsResponse.data?.topics || []);
        setLessons(lessonsResponse.data?.lessons || []);
        setDailyProgress(
          dailyResponse.data?.daily || {
            attempts: 0,
            limit: user?.dailyGoal || 10,
            correct: 0,
            wrong: 0,
          }
        );
        setLearningProfile(profileResponse.data?.profile || null);
      } catch (error) {
        console.error("StudyHub load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudyData();
  }, [user?.dailyGoal]);

  const nextMilestone = useMemo(() => {
    if (!learningProfile?.nextLevel) return null;

    const remaining = Math.max(
      learningProfile.nextLevel.requiredXp - (learningProfile.xp || 0),
      0
    );

    return {
      ...learningProfile.nextLevel,
      remaining,
    };
  }, [learningProfile]);

  const recommendedTopicInfo = useMemo(() => {
    if (!topics.length) {
      return {
        title: user?.preferredTopic || "Algebra",
        id: null,
      };
    }

    const preferred = user?.preferredTopic || "Algebra";
    const matchedTopic = topics.find((topic) => topic.title === preferred) || topics[0];

    return {
      title: matchedTopic.title,
      id: matchedTopic._id,
    };
  }, [topics, user?.preferredTopic]);

  const recommendedTopic = recommendedTopicInfo.title;

  const nextLesson = useMemo(() => {
    if (!lessons.length) return null;

    const topicId = recommendedTopicInfo.id;
    return lessons.find((lesson) => {
      const lessonTopicId = typeof lesson.topic === "string" ? lesson.topic : lesson.topic?._id;
      return lessonTopicId === topicId || lesson.topic?.title === recommendedTopic;
    }) || lessons[0];
  }, [lessons, recommendedTopic, recommendedTopicInfo.id]);

  const storyCard = learningProfile?.realWorldApplication ||
    "Use today’s concept to solve a real decision, estimate a quantity, or plan a practical task with confidence.";

  const challengeMap = {
    Algebra: "A school club is buying notebooks for a project. If 3 packs cost $18 and each pack contains 5 notebooks, how much does each notebook cost?",
    Geometry: "A rectangular garden needs fencing around its perimeter. If the garden is 12 m long and 7 m wide, how much fencing is needed?",
    Fractions: "A recipe uses 3/4 of a cup of flour for one batch. How much flour is needed for 2 batches and how would you simplify the result?",
    Arithmetic: "A bus ticket costs $8.50 and a student buys 3 tickets. What is the total and how do you check the calculation mentally?",
  };

  const challengePrompt = challengeMap[recommendedTopic] || "Use the lesson concept to estimate, compare, and justify a real-world answer confidently.";

  const quickActions = [
    {
      label: "Continue lessons",
      description: "Pick up the next concept in your route.",
      icon: BookOpen,
      action: () => navigate("/lessons"),
    },
    {
      label: "Ask the AI tutor",
      description: "Get a clear explanation for a problem you are stuck on.",
      icon: BrainCircuit,
      action: () => navigate("/ai-tutor"),
    },
    {
      label: "Review your profile",
      description: "Track your streak, XP, and daily target.",
      icon: TrendingUp,
      action: () => navigate("/profile"),
    },
  ];

  const goalOptions = [5, 10, 15, 20];

  const handleGoalSet = (goal) => {
    if (!user) return;

    updateUser({ ...user, dailyGoal: goal });
    setDailyProgress((current) => ({ ...current, limit: goal }));
  };

  const handleStartLesson = () => {
    if (nextLesson) {
      const topicId = typeof nextLesson.topic === "string" ? nextLesson.topic : nextLesson.topic?._id || recommendedTopicInfo.id;
      const lessonId = nextLesson._id || nextLesson.id;

      if (topicId && lessonId) {
        navigate(`/topics/${topicId}?lessonId=${lessonId}`);
        return;
      }
    }

    navigate("/lessons");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Study Hub</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Learn with purpose today.
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200">
              <Sparkles size={16} />
              Real-world learning focus
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-indigo-400/15 bg-indigo-500/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Today’s lesson</p>
              <h2 className="mt-3 text-2xl font-black">{recommendedTopic} focus</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Review the idea, solve a realistic task, and finish with a quick check of your understanding.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleStartLesson}
                  className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"
                >
                  {nextLesson ? `Start ${nextLesson.title} →` : "Start today’s lesson →"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/ai-tutor")}
                  className="rounded-xl border border-white/10 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                >
                  Ask AI tutor
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-400/15 bg-emerald-500/5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Real-world challenge</p>
              <p className="mt-3 text-base leading-7 text-slate-200">{challengePrompt}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Daily target</p>
              <p className="mt-3 text-2xl font-black">
                {Math.min(dailyProgress.attempts, dailyProgress.limit)}/{dailyProgress.limit}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {dailyProgress.limit - dailyProgress.attempts > 0
                  ? `${dailyProgress.limit - dailyProgress.attempts} left to finish today.`
                  : "Your target is complete for today."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current streak</p>
              <p className="mt-3 text-2xl font-black">{user?.streak || 0} days</p>
              <p className="mt-2 text-sm text-slate-300">Consistency helps you retain new ideas.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next level</p>
              <p className="mt-3 text-2xl font-black">
                {nextMilestone ? `${nextMilestone.remaining} XP` : "Complete"}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {nextMilestone ? `Until ${nextMilestone.title}.` : "You have reached the highest level."}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Real-world application
                </p>
                <h2 className="mt-2 text-2xl font-black">How this connects to real life</h2>
              </div>
              <Target className="text-cyan-300" size={22} />
            </div>

            <p className="mt-5 text-base leading-7 text-slate-300">{storyCard}</p>

            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-200">Recommended focus</p>
                  <p className="mt-1 text-xl font-black">{recommendedTopic}</p>
                </div>
                <Gauge size={22} className="text-emerald-300" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Quick actions</p>
            <div className="mt-5 space-y-3">
              {quickActions.map(({ label, description, icon: Icon, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left transition hover:border-violet-400/40 hover:bg-violet-500/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-white">{label}</p>
                      <ArrowRight size={16} className="text-slate-400" />
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Progress</p>
            <h2 className="mt-2 text-2xl font-black">Today’s momentum</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cyan-200">Practice progress</p>
                    <p className="mt-1 text-xl font-black">
                      {dailyProgress.correct || 0} correct
                    </p>
                  </div>
                  <Gauge size={22} className="text-cyan-300" />
                </div>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-200">XP gained</p>
                    <p className="mt-1 text-xl font-black">{user?.xp || 0}</p>
                  </div>
                  <Flame size={22} className="text-amber-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Daily target</p>
            <h2 className="mt-2 text-2xl font-black">Set your study goal</h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => handleGoalSet(goal)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    Number(user?.dailyGoal || 10) === goal
                      ? "border-indigo-400 bg-indigo-500/15 text-indigo-200"
                      : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {goal} questions
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Progress to target</span>
                <span>{Math.min((dailyProgress.attempts / dailyProgress.limit) * 100, 100).toFixed(0)}%</span>
              </div>

              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min((dailyProgress.attempts / dailyProgress.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudyHub;
