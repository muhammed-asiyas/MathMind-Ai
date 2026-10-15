import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  KeyRound,
  LockKeyhole,
  Mail,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import api from "../services/api";

function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const initials = `${form.firstName?.[0] || "M"}${form.lastName?.[0] || "A"}`.toUpperCase();
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
        firstName: form.firstName,
        lastName: form.lastName,
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
    <div className="profile-page min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          className="profile-hero relative overflow-hidden rounded-b-[2rem] border-x border-b border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-600 to-cyan-900/10 px-6 py-10 sm:px-10 sm:py-14"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles size={15} /> Your account
              </p>
              <h1 className="profile-hero-title mt-3 text-4xl font-black tracking-tight sm:text-5xl">Account details</h1>
              <p className="profile-hero-copy mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Manage your personal information and account security.
              </p>
            </div>
            <div className="profile-identity flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-lg font-black shadow-lg shadow-indigo-950/40">
                {initials}
              </div>
              <div>
                <p className="profile-identity-name font-bold text-white">{form.firstName || "MathMind"} {form.lastName}</p>
                <p className="text-xs text-slate-400">{user?.role === "admin" ? "Administrator account" : "Student account"}</p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="stagger-grid mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <form onSubmit={handleSave} className="motion-surface reveal-on-scroll rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">Personal information</p>
                <h2 className="mt-2 text-2xl font-black">Edit your details</h2>
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

          </aside>
        </div>
      </main>
    </div>
  );
}

export default Profile;
