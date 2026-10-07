import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotificationToast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="fixed top-20 right-4 z-50 max-w-sm sm:right-6"
      >
        <div className="relative flex items-start gap-3 rounded-2xl border border-emerald-400/30 bg-slate-900/95 p-4 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl sm:p-4.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-500/30 text-emerald-300 ring-1 ring-emerald-400/40">
            <MessageCircle size={20} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {toast.title || "New message received"}
              </p>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>

            <p className="mt-1 text-sm font-semibold text-white truncate">
              {toast.sender || "Math Teacher"}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-300">
              {toast.message || "You have a new message waiting in chat."}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Link
                to={toast.link || "/chat"}
                onClick={onDismiss}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-950/20 transition hover:bg-emerald-400"
              >
                Open Chat <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
