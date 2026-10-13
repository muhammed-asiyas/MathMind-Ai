import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const ROUND_LENGTH = 10;
const ROUND_SECONDS = 60;

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[otherIndex]] = [shuffled[otherIndex], shuffled[index]];
  }
  return shuffled;
};

const normalizeAnswer = (answer) => String(answer || "")
  .normalize("NFKC")
  .trim()
  .toLowerCase()
  .replace(/[−–—]/g, "-")
  .replace(/[\s,]+/g, "");

function Quiz() {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [questionBank, setQuestionBank] = useState([]);
  const [roundQuestions, setRoundQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [gameState, setGameState] = useState("ready");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState("");
  const answerInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    api.get("/topics")
      .then(({ data }) => {
        if (!active) return;
        const availableTopics = data.topics || [];
        setTopics(availableTopics);
        if (availableTopics[0]?._id) setLoadingLessons(true);
        setSelectedTopicId(availableTopics[0]?._id || "");
        setError("");
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Could not load maths topics.");
      })
      .finally(() => {
        if (active) setLoadingTopics(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTopicId) return undefined;

    let active = true;

    api.get(`/lessons?topicId=${selectedTopicId}`)
      .then(({ data }) => {
        if (!active) return;
        const availableLessons = data.lessons || [];
        setLessons(availableLessons);
        setLoadingQuestions(availableLessons.length > 0);
        setSelectedLessonId(availableLessons[0]?._id || "");
        setError(availableLessons.length === 0 ? "There are no lessons available for this topic yet." : "");
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Could not load lessons for this topic.");
      })
      .finally(() => {
        if (active) setLoadingLessons(false);
      });

    return () => {
      active = false;
    };
  }, [selectedTopicId]);

  useEffect(() => {
    if (!selectedLessonId) return undefined;
    let active = true;
    api.get(`/quizzes/lessons/${selectedLessonId}/questions`)
      .then(({ data }) => {
        if (!active) return;
        const availableQuestions = data.questions || [];
        setQuestionBank(availableQuestions);
        setError(availableQuestions.length === 0 ? "No questions are available for this lesson yet." : "");
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Could not load questions for this lesson.");
      })
      .finally(() => {
        if (active) setLoadingQuestions(false);
      });

    return () => {
      active = false;
    };
  }, [selectedLessonId]);

  useEffect(() => {
    if (gameState !== "playing") return undefined;

    const timerId = window.setInterval(() => {
      setTimeLeft((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timerId);
          setGameState("finished");
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing" || feedback || timeLeft === 0) return undefined;

    const frameId = window.requestAnimationFrame(() => answerInputRef.current?.focus());
    return () => window.cancelAnimationFrame(frameId);
  }, [feedback, gameState, questionIndex, timeLeft]);

  const currentQuestion = roundQuestions[questionIndex];
  const roundLength = roundQuestions.length;
  const selectedTopic = topics.find((topic) => topic._id === selectedTopicId);
  const selectedLesson = lessons.find((lesson) => lesson._id === selectedLessonId);
  const roundFinished = gameState === "finished";
  const playableQuestionCount = Math.min(questionBank.length, ROUND_LENGTH);
  const maxRoundScore = playableQuestionCount * 100;

  const startGame = () => {
    if (questionBank.length === 0) return;
    const selectedQuestions = shuffle(questionBank).slice(0, ROUND_LENGTH);
    setRoundQuestions(selectedQuestions);
    setQuestionIndex(0);
    setAnswer("");
    setFeedback(null);
    setScore(0);
    setCorrectAnswers(0);
    setAnsweredCount(0);
    setTimeLeft(ROUND_SECONDS);
    setGameState("playing");
  };

  const submitAnswer = (event) => {
    event.preventDefault();
    if (!currentQuestion || feedback || !answer.trim() || timeLeft === 0) return;

    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(currentQuestion.answer);
    setFeedback({ isCorrect });
    setAnsweredCount((count) => count + 1);
    if (isCorrect) {
      setScore((currentScore) => currentScore + 100);
      setCorrectAnswers((count) => count + 1);
    }
  };

  const continueRound = () => {
    if (questionIndex + 1 >= roundLength) {
      setGameState("finished");
      return;
    }
    setQuestionIndex((index) => index + 1);
    setAnswer("");
    setFeedback(null);
  };

  const changeTopic = (event) => {
    setSelectedTopicId(event.target.value);
    setGameState("ready");
    setLoadingLessons(Boolean(event.target.value));
    setLoadingQuestions(false);
    setLessons([]);
    setSelectedLessonId("");
    setQuestionBank([]);
    setRoundQuestions([]);
    setError("");
  };

  const changeLesson = (event) => {
    setSelectedLessonId(event.target.value);
    setGameState("ready");
    setLoadingQuestions(Boolean(event.target.value));
    setQuestionBank([]);
    setRoundQuestions([]);
    setError("");
  };

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const loading = loadingTopics || loadingLessons || loadingQuestions;

  return (
    <div className="quiz-page min-h-screen bg-slate-950 text-white transition-colors duration-200">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6">
        <Link to="/dashboard" className="quiz-back-link inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        {/* First Box: Hero Banner */}
        <section className="quiz-hero-card mt-6 overflow-hidden rounded-3xl border border-amber-300/20 p-5 sm:p-8 transition-all">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="quiz-hero-badge inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em]">
                <Zap size={15} /> Timed game mode
              </p>
              <h1 className="quiz-hero-title mt-3 text-3xl font-black tracking-tight sm:text-4xl">Math Sprint</h1>
              <p className="quiz-hero-desc mt-3 max-w-2xl leading-7 text-slate-300">
                Solve real-world maths challenges against the clock. Earn 100 points for every correct answer, then take tricky problems to your AI tutor for a step-by-step explanation.
              </p>
            </div>
            <div className="quiz-hero-stat rounded-2xl border p-4 text-sm transition-all">
              <p className="flex items-center gap-2 font-bold"><Clock3 size={16} className="quiz-stat-icon" /> 60 seconds</p>
              <p className="mt-2 flex items-center gap-2 font-bold"><Trophy size={16} className="quiz-stat-icon" /> {playableQuestionCount ? `Up to ${maxRoundScore.toLocaleString()} points` : "100 points per answer"}</p>
            </div>
          </div>
        </section>

        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        )}

        {/* Second Box: Content / Challenge Card */}
        <section className="quiz-content-card mt-6 rounded-3xl border p-4 sm:p-7 transition-all">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="quiz-label text-sm font-semibold">
              Choose a maths topic
              <select
                value={selectedTopicId}
                onChange={changeTopic}
                disabled={loadingTopics || topics.length === 0 || (gameState === "playing" && timeLeft > 0)}
                className="quiz-select mt-2 w-full rounded-xl border px-4 py-3 outline-none disabled:opacity-60"
              >
                {loadingTopics && <option value="">Loading topics...</option>}
                {!loadingTopics && topics.length === 0 && <option value="">No topics available</option>}
                {topics.map((topic) => <option key={topic._id} value={topic._id}>{topic.title}</option>)}
              </select>
            </label>
            <label className="quiz-label text-sm font-semibold">
              Choose a lesson challenge
              <select
                value={selectedLessonId}
                onChange={changeLesson}
                disabled={loadingLessons || lessons.length === 0 || (gameState === "playing" && timeLeft > 0)}
                className="quiz-select mt-2 w-full rounded-xl border px-4 py-3 outline-none disabled:opacity-60"
              >
                {loadingLessons && <option value="">Loading lessons...</option>}
                {!loadingLessons && lessons.length === 0 && <option value="">No lessons available</option>}
                {lessons.map((lesson) => <option key={lesson._id} value={lesson._id}>{lesson.title}</option>)}
              </select>
            </label>
          </div>

          {gameState === "ready" && (
            <div className="quiz-ready-box mt-6 rounded-2xl border p-5 sm:p-7 transition-all">
              <div className="flex items-start gap-4">
                <span className="quiz-sparkle-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"><Sparkles size={23} /></span>
                <div>
                  <p className="quiz-challenge-eyebrow text-xs font-bold uppercase tracking-wider">Your challenge</p>
                  <h2 className="quiz-challenge-title mt-1 text-xl font-black">{selectedLesson?.title || selectedTopic?.title || "Pick a topic to begin"}</h2>
                  <p className="quiz-challenge-desc mt-2 text-sm leading-6">
                    {loading
                      ? "Getting your questions ready..."
                      : `${playableQuestionCount} questions picked at random. Some connect maths to everyday decisions like shopping, measuring, and planning.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={startGame}
                disabled={loading || questionBank.length === 0}
                className="quiz-start-btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-black transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Zap size={17} /> {loading ? "Loading challenge..." : "Start Math Sprint"}
              </button>
            </div>
          )}

          {gameState === "playing" && timeLeft > 0 && currentQuestion && (
            <div className="mt-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="quiz-stat-card rounded-2xl border p-3 text-center sm:p-4 transition-all">
                  <p className="quiz-stat-sub text-[10px] font-bold uppercase tracking-wider">Question</p>
                  <p className="mt-1 font-black">{questionIndex + 1}<span className="quiz-stat-total">/{roundLength}</span></p>
                </div>
                <div className="quiz-timer-card rounded-2xl border p-3 text-center sm:p-4 transition-all">
                  <p className="text-[10px] font-bold uppercase tracking-wider">Time left</p>
                  <p role="timer" aria-live="polite" className={`mt-1 font-black tabular-nums ${timeLeft <= 10 ? "quiz-time-warning text-rose-400 font-extrabold" : ""}`}>{formatTime(timeLeft)}</p>
                </div>
                <div className="quiz-score-card rounded-2xl border p-3 text-center sm:p-4 transition-all">
                  <p className="text-[10px] font-bold uppercase tracking-wider">Score</p>
                  <p className="mt-1 font-black tabular-nums">{score}</p>
                </div>
              </div>
              <div
                className="quiz-progress-track mt-4 h-2 overflow-hidden rounded-full"
                role="progressbar"
                aria-label="Round progress"
                aria-valuemin={0}
                aria-valuemax={roundLength}
                aria-valuenow={answeredCount}
              >
                <div className="quiz-progress-bar h-full rounded-full transition-all" style={{ width: `${(answeredCount / roundLength) * 100}%` }} />
              </div>

              <div className="quiz-question-box mt-5 rounded-2xl border p-5 sm:p-7 transition-all">
                <p className="quiz-question-meta flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <BrainCircuit size={15} /> {selectedTopic?.title} · {selectedLesson?.title}
                </p>
                <h2 className="quiz-question-prompt mt-4 text-xl font-bold leading-8 sm:text-2xl">{currentQuestion.prompt}</h2>
                <form onSubmit={submitAnswer}>
                  <label htmlFor="sprint-answer" className="quiz-label mt-6 block text-sm font-semibold">Your answer</label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="sprint-answer"
                      ref={answerInputRef}
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      disabled={Boolean(feedback)}
                      maxLength={80}
                      placeholder="Type your answer"
                      className="quiz-answer-input min-w-0 flex-1 rounded-xl border px-4 py-3 outline-none disabled:opacity-60"
                    />
                    {!feedback ? (
                      <button type="submit" disabled={!answer.trim()} className="quiz-action-btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50">
                        Check answer <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button type="button" onClick={continueRound} className="quiz-action-btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition">
                        {questionIndex + 1 >= roundLength ? "See results" : "Next question"} <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </form>

                {feedback && (
                  <div role="status" className={`quiz-feedback-box mt-4 rounded-xl border p-4 transition-all ${feedback.isCorrect ? "quiz-feedback-correct" : "quiz-feedback-incorrect"}`}>
                    <p className="flex items-center gap-2 font-bold">
                      {feedback.isCorrect ? <CheckCircle2 size={17} /> : <BrainCircuit size={17} />}
                      {feedback.isCorrect ? "Correct — 100 points!" : `Not quite. The answer is ${currentQuestion.answer}.`}
                    </p>
                    {currentQuestion.hint && <p className="quiz-feedback-hint mt-2 text-sm leading-6">{currentQuestion.hint}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {roundFinished && (
            <div className="quiz-result-box mt-6 rounded-2xl border p-5 text-center sm:p-8 transition-all">
              <Trophy size={38} className="quiz-result-trophy mx-auto" />
              <p className="quiz-result-eyebrow mt-4 text-xs font-bold uppercase tracking-[0.18em]">Sprint complete</p>
              <h2 className="quiz-result-score mt-2 text-3xl font-black">{score} points</h2>
              <p className="quiz-result-desc mt-2">You solved {correctAnswers} of {answeredCount} attempted questions correctly{timeLeft === 0 ? " before time ran out" : ""}.</p>
              <p className="quiz-result-note mt-1 text-xs">Game points are for this round and are separate from your saved XP.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={startGame} className="quiz-start-btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold transition">
                  <RotateCcw size={16} /> Play again
                </button>
                <Link to="/ai-tutor" className="quiz-secondary-btn inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-semibold transition">
                  <BrainCircuit size={16} /> Ask AI tutor about a problem
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Quiz;
