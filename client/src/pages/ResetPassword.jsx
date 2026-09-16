import { useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import api from "../services/api";

function ResetPassword() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const accountOnly = new URLSearchParams(location.search).get("account") === "1";
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (step === "email") {
        await api.post(accountOnly ? "/auth/account/forgot-password" : "/auth/forgot-password", accountOnly ? {} : { email });
        setMessage(accountOnly ? `A 6-digit code was sent to ${user.email}.` : "If an account exists for this email, a 6-digit code has been sent.");
        setStep("otp");
      } else if (step === "otp") {
        await api.post(accountOnly ? "/auth/account/verify-reset-otp" : "/auth/verify-reset-otp", { otp, ...(accountOnly ? {} : { email }) });
        setStep("password");
      } else {
        if (password !== confirmation) {
          setError("Passwords do not match.");
          return;
        }
        const response = await api.post(accountOnly ? "/auth/account/reset-password" : "/auth/reset-password", { otp, password, ...(accountOnly ? {} : { email }) });
        setMessage(response.data.message);
        setStep("complete");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepNumber = step === "email" ? 1 : step === "otp" ? 2 : 3;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[90vh] max-w-md items-center">
        <div className="motion-surface w-full rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-indigo-950/20 sm:p-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
            <ArrowLeft size={16} /> Back to login
          </Link>

          <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
            {step === "email" && <Mail size={25} />}
            {step === "otp" && <ShieldCheck size={25} />}
            {step === "password" && <KeyRound size={25} />}
            {step === "complete" && <CheckCircle2 size={25} />}
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Account recovery · {stepNumber}/3</p>
          <h1 className="mt-3 text-3xl font-black">
            {step === "email" && "Reset your password"}
            {step === "otp" && "Check your email"}
            {step === "password" && "Choose a new password"}
            {step === "complete" && "Password updated"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {step === "email" && (accountOnly ? `We will send a secure verification code to your login email, ${user?.email}.` : "Enter your MathMind email and we will send a secure verification code.")}
            {step === "otp" && `Enter the 6-digit code sent to ${email}. It expires in 10 minutes.`}
            {step === "password" && "Your identity is verified. Create a new password with at least 6 characters."}
            {step === "complete" && "Your password has been changed. You can now sign in with the new password."}
          </p>

          {step !== "complete" ? (
            <form onSubmit={submit} className="mt-8 space-y-5">
              {step === "email" && (
                accountOnly ? (
                  <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Login email</span>
                    <span className="mt-1 block font-bold text-white">{user?.email}</span>
                  </div>
                ) : (
                  <label className="block text-sm font-semibold text-slate-300">
                    Email address
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
                  </label>
                )
              )}

              {step === "otp" && (
                <label className="block text-sm font-semibold text-slate-300">
                  Verification code
                  <input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} required autoFocus placeholder="000000" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-center text-2xl font-black tracking-[0.45em] text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
                </label>
              )}

              {step === "password" && (
                <>
                  <label className="block text-sm font-semibold text-slate-300">
                    New password
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoFocus placeholder="At least 6 characters" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
                  </label>
                  <label className="block text-sm font-semibold text-slate-300">
                    Confirm new password
                    <input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength={6} placeholder="Repeat your new password" className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
                  </label>
                </>
              )}

              {message && <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm leading-5 text-emerald-200">{message}</p>}
              {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm leading-5 text-red-200">{error}</p>}

              <button type="submit" disabled={loading} className="motion-button w-full rounded-xl bg-indigo-500 py-3.5 font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Please wait..." : step === "email" ? "Send verification code" : step === "otp" ? "Verify code" : "Reset password"}
              </button>

              {step === "otp" && !accountOnly && <button type="button" onClick={() => { setStep("email"); setMessage(""); setError(""); }} className="w-full text-sm font-semibold text-slate-400 transition hover:text-white">Use a different email</button>}
            </form>
          ) : (
            <button type="button" onClick={() => navigate("/login", { replace: true })} className="motion-button mt-8 w-full rounded-xl bg-indigo-500 py-3.5 font-bold text-white transition hover:bg-indigo-400">Continue to login</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
