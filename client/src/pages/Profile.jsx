import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Award,
  BarChart3,
  Check,
  Flame,
  KeyRound,
  LockKeyhole,
  Mail,
  Save,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import api from "../services/api";

const topics = ["Algebra", "Geometry", "Fractions", "Arithmetic"];
const goals = [5, 10, 15, 20];

function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    preferredTopic: user?.preferredTopic || "Algebra",
    dailyGoal: user?.dailyGoal || 10,
  }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const initials = `${form.firstName?.[0] || "M"}${form.lastName?.[0] || "A"}`.toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "New member";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await api.put("/users/profile", {
        ...form,
        dailyGoal: Number(form.dailyGoal),
      });
      updateUser(response.data.user);
      setSaved(true);
    } catch (saveError) {
      setError(saveError.response?.data?.message || "We could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          className="relative overflow-hidden rounded-b-[2rem] border-x border-b border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-cyan-500/10 px-6 py-10 sm:px-10 sm:py-14"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles size={15} /> Your account
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Profile & preferences</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Shape MathMind around the way you learn. Your preferences help keep every next step focused and useful.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-black shadow-lg shadow-indigo-950/40">
                {initials}
              </div>
              <div>
                <p className="font-bold text-white">{form.firstName || "MathMind"} {form.lastName}</p>
                <p className="text-xs text-slate-400">Member since {memberSince}</p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="stagger-grid mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <form onSubmit={handleSave} className="motion-surface reveal-on-scroll rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">Personal details</p>
                <h2 className="mt-2 text-2xl font-black">Make this space yours</h2>
              </div>
              <div className="hidden rounded-xl bg-indigo-500/10 p-3 text-indigo-300 sm:block"><UserRound size={21} /></div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-300">
                First name
                <input name="firstName" value={form.firstName} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
              </label>
              <label className="text-sm font-semibold text-slate-300">
                Last name
                <input name="lastName" value={form.lastName} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
              </label>
            </div>

            <label className="mt-5 block text-sm font-semibold text-slate-300">
              Email address
              <div className="relative mt-2">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={user?.email || ""} readOnly className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-11 pr-12 text-slate-400 outline-none" />
                <LockKeyhole size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
              <span className="mt-2 block text-xs font-normal text-slate-500">Your login email is protected and cannot be changed here.</span>
            </label>

            <div className="mt-9 border-t border-white/10 pt-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">Learning preferences</p>
              <h3 className="mt-2 text-xl font-black">Choose your focus</h3>
              <p className="mt-1 text-sm text-slate-400">We will use this to make your learning path feel more relevant.</p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {topics.map((topic) => (
                  <button key={topic} type="button" onClick={() => { setForm((current) => ({ ...current, preferredTopic: topic })); setSaved(false); }} className={`motion-button rounded-xl border px-3 py-3 text-sm font-bold transition ${form.preferredTopic === topic ? "border-indigo-400 bg-indigo-500/15 text-indigo-200 shadow-lg shadow-indigo-950/20" : "border-white/10 bg-slate-950/30 text-slate-400 hover:border-white/25 hover:text-white"}`}>
                    {topic}
                  </button>
                ))}
              </div>

              <div className="mt-7">
                <p className="text-sm font-semibold text-slate-300">Daily practice goal</p>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {goals.map((goal) => (
                    <button key={goal} type="button" onClick={() => { setForm((current) => ({ ...current, dailyGoal: goal })); setSaved(false); }} className={`motion-button rounded-xl border px-2 py-3 text-center transition ${Number(form.dailyGoal) === goal ? "border-cyan-300 bg-cyan-400/10 text-cyan-200" : "border-white/10 bg-slate-950/30 text-slate-400 hover:border-white/25 hover:text-white"}`}>
                      <span className="block text-lg font-black">{goal}</span>
                      <span className="text-[10px] uppercase tracking-wider">questions</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                {saved && <span className="flex items-center gap-2 font-semibold text-emerald-300"><Check size={17} /> Changes saved</span>}
                {error && <span className="text-red-300">{error}</span>}
              </div>
              <button type="submit" disabled={saving} className="motion-button flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">
                <Save size={17} /> {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="motion-surface reveal-on-scroll rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Your momentum</p>
                  <h2 className="mt-2 text-xl font-black">Keep the rhythm</h2>
                </div>
                <BarChart3 className="text-cyan-300" size={22} />
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 p-4"><span className="flex items-center gap-3 text-sm text-slate-400"><Award size={18} className="text-amber-300" /> Total XP</span><strong className="text-white">{user?.xp || 0}</strong></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 p-4"><span className="flex items-center gap-3 text-sm text-slate-400"><Flame size={18} className="text-orange-300" /> Current streak</span><strong className="text-white">{user?.streak || 0} days</strong></div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-950/50 p-4"><span className="flex items-center gap-3 text-sm text-slate-400"><Target size={18} className="text-indigo-300" /> Daily target</span><strong className="text-white">{form.dailyGoal} questions</strong></div>
              </div>
            </div>

            <div className="motion-surface reveal-on-scroll rounded-3xl border border-indigo-400/20 bg-indigo-400/[0.06] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/15 text-indigo-300">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black">Keep your account secure</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Reset your password using a verification code sent to your email.
                  </p>
                  <Link
                    to="/forgot-password?account=1"
                    className="motion-button mt-5 inline-flex items-center gap-2 rounded-xl border border-indigo-300/30 bg-indigo-400/10 px-4 py-2.5 text-sm font-bold text-indigo-200 transition hover:bg-indigo-400/20"
                  >
                    <KeyRound size={16} /> Reset password
                  </Link>
                </div>
              </div>
            </div>

            <div className="motion-surface reveal-on-scroll rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300"><Check size={20} /></div>
              <h2 className="mt-5 text-lg font-black">Your progress is safe</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Your XP, streak, and completed lessons stay connected to this account wherever you learn.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Profile;
