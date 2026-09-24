import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, MessageCircle, Send, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import api from "../services/api";

const formatTime = (date) => new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit" }).format(new Date(date));

function Chat() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [conversation, setConversation] = useState(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await api.get(isAdmin ? "/chat/conversations" : "/chat/conversations/me");
        if (!active) return;
        const nextConversations = data.conversations || (data.conversation ? [data.conversation] : []);
        setConversations(nextConversations);
        if (isAdmin && !selectedId && nextConversations[0]) setSelectedId(nextConversations[0]._id);
        if (!isAdmin && data.conversation) setConversation(data.conversation);
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || "Could not load chat.");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const interval = window.setInterval(load, 5000);
    return () => { active = false; window.clearInterval(interval); };
  }, [isAdmin, selectedId]);

  useEffect(() => {
    if (!isAdmin || !selectedId) return undefined;
    let active = true;
    const loadSelected = async () => {
      try {
        const { data } = await api.get(`/chat/conversations/${selectedId}`);
        if (active) setConversation(data.conversation);
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || "Could not load messages.");
      }
    };
    loadSelected();
    const interval = window.setInterval(loadSelected, 3000);
    return () => { active = false; window.clearInterval(interval); };
  }, [isAdmin, selectedId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages?.length]);

  const selectConversation = (nextId) => {
    setSelectedId(nextId);
    setConversation(null);
    setError("");
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody || sending) return;
    setSending(true);
    setError("");
    try {
      const endpoint = isAdmin ? `/chat/conversations/${selectedId}/messages` : "/chat/messages";
      const { data } = await api.post(endpoint, { body: trimmedBody });
      setConversation(data.conversation);
      setBody("");
      if (isAdmin) setConversations((current) => current.map((item) => item._id === data.conversation._id ? data.conversation : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not send message.");
    } finally {
      setSending(false);
    }
  };

  const student = conversation?.student;
  const title = isAdmin
    ? (student ? `${student.firstName} ${student.lastName}` : "Select a student")
    : "Your teacher";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link to={isAdmin ? "/admin" : "/dashboard"} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"><ArrowLeft size={16} /> Back</Link>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Live support</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Math help, human to human.</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Ask a question, share where you are stuck, and keep the conversation with your teacher in one place.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Live support</div>
        </div>

        {error && <p className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        <div className="grid min-h-[560px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] lg:grid-cols-[300px_1fr]">
          {isAdmin && <aside className="border-b border-white/10 bg-slate-900/60 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4 font-bold"><Users size={18} className="text-cyan-300" /> Student inbox</div>
            <div className="max-h-[500px] overflow-y-auto p-3">
              {conversations.length === 0 && !loading && <p className="px-3 py-8 text-center text-sm leading-6 text-slate-500">Student conversations will appear here when a learner asks for help.</p>}
              {conversations.map((item) => {
                const itemStudent = item.student;
                return <button type="button" key={item._id} onClick={() => selectConversation(item._id)} className={`w-full rounded-2xl p-3 text-left transition ${selectedId === item._id ? "bg-cyan-300/15 ring-1 ring-cyan-300/30" : "hover:bg-white/5"}`}>
                  <div className="flex items-start justify-between gap-2"><span className="truncate font-bold">{itemStudent?.firstName} {itemStudent?.lastName}</span>{item.unreadForAdmin > 0 && <span className="rounded-full bg-cyan-300 px-2 py-0.5 text-[10px] font-black text-slate-950">{item.unreadForAdmin}</span>}</div>
                  <p className="mt-1 truncate text-xs text-slate-500">{item.lastMessagePreview || "No messages yet"}</p>
                </button>;
              })}
            </div>
          </aside>}

          <section className="flex min-h-[560px] flex-col">
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-7"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200"><MessageCircle size={19} /></div><div><p className="font-bold">{title}</p><p className="text-xs text-slate-500">{isAdmin ? "Teacher workspace" : "Usually replies during learning hours"}</p></div></div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
              {!conversation && <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center"><MessageCircle size={34} className="text-slate-600" /><p className="mt-4 font-bold text-slate-300">{isAdmin ? "Choose a student conversation" : "Start a conversation with your teacher"}</p><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{isAdmin ? "Incoming student questions will be ready here." : "There is no question here yet. Send your first message below."}</p></div>}
              {conversation?.messages?.map((message) => { const mine = String(message.sender) === String(user?.id || user?._id); return <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 ${mine ? "rounded-br-md bg-cyan-300 text-slate-950" : "rounded-bl-md bg-white/10 text-slate-100"}`}><p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p><p className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-slate-700" : "text-slate-500"}`}>{formatTime(message.createdAt)} {mine && <Check size={12} />}</p></div></div>; })}
              <div ref={messageEndRef} />
            </div>
            <form onSubmit={sendMessage} className="border-t border-white/10 p-4 sm:p-5"><div className="flex items-end gap-3"><textarea value={body} onChange={(event) => setBody(event.target.value)} disabled={isAdmin && !selectedId} maxLength={2000} rows={2} placeholder={isAdmin && !selectedId ? "Select a student first" : "Write your maths question..."} className="min-h-[52px] flex-1 resize-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50" /><button type="submit" disabled={sending || !body.trim() || (isAdmin && !selectedId)} title="Send message" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"><Send size={18} /></button></div><p className="mt-2 text-right text-[11px] text-slate-600">{body.length}/2000</p></form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Chat;
