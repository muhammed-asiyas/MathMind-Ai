import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	ArrowUp,
	BrainCircuit,
	Calculator,
	Check,
	ChevronRight,
	Copy,
	Lightbulb,
	MessageCircle,
	PanelLeft,
	RotateCcw,
	Sparkles,
	WandSparkles,
} from "lucide-react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/authContext";

const starterPrompts = [
	{ label: "Solve an equation", prompt: "Can you solve 3x + 7 = 22 and explain every step?", icon: Calculator },
	{ label: "Understand fractions", prompt: "Why is 2/3 + 1/6 equal to 5/6? Show me the reasoning.", icon: Lightbulb },
	{ label: "Try a word problem", prompt: "A rectangle is 8 cm long and 5 cm wide. What are its area and perimeter?", icon: MessageCircle },
	{ label: "Learn a concept", prompt: "Teach me the difference between mean, median, and mode with an example.", icon: BrainCircuit },
];

const openingMessage = {
	role: "assistant",
	content: "Hi! I’m your MathMind tutor. Share any maths question, a photo description, or even a half-finished attempt. I’ll guide you step by step and help you understand why the answer works.",
	steps: ["Read the problem carefully", "Choose the right idea", "Work through each step", "Check the answer"],
};

function AITutor() {
	const { user } = useAuth();
	const [messages, setMessages] = useState([openingMessage]);
	const [input, setInput] = useState("");
	const [isThinking, setIsThinking] = useState(false);
	const [copiedIndex, setCopiedIndex] = useState(null);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isThinking]);

	const askQuestion = async (question = input) => {
		const trimmedQuestion = question.trim();
		if (!trimmedQuestion || isThinking) return;

		setInput("");
		setMessages((current) => [...current, { role: "user", content: trimmedQuestion }]);
		setIsThinking(true);

		try {
			const response = await api.post("/ai/ask", { question: trimmedQuestion });
			setMessages((current) => [...current, {
				role: "assistant",
				content: response.data.answer,
				steps: response.data.steps || [],
				alternatives: response.data.alternatives || [],
			}]);
		} catch (error) {
			setMessages((current) => [...current, {
				role: "assistant",
				content: error.response?.data?.message || "I couldn’t reach the tutor right now. Please check that the server is running and try again.",
				steps: [],
				error: true,
			}]);
		} finally {
			setIsThinking(false);
		}
	};

	const copyMessage = async (content, index) => {
		await navigator.clipboard.writeText(content);
		setCopiedIndex(index);
		window.setTimeout(() => setCopiedIndex(null), 1400);
	};

	const resetChat = () => {
		setMessages([openingMessage]);
		setInput("");
	};

	return (
		<div className="min-h-screen bg-slate-950 text-white">
			<Navbar />
			<main className="mx-auto grid max-w-7xl gap-4 px-3 py-3 sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-10">
				<aside className="hidden lg:block">
					<Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white">
						<ArrowLeft size={16} /> Back to dashboard
					</Link>
					<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200"><WandSparkles size={21} /></div>
							<div><p className="text-sm font-bold">MathMind Tutor</p><p className="text-xs text-emerald-300">Ready to help</p></div>
						</div>
						<div className="mt-6 space-y-3 text-xs leading-5 text-slate-400">
							{["Ask in your own words", "Get a guided explanation", "Try a follow-up question"].map((item) => <p key={item} className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-emerald-300" />{item}</p>)}
						</div>
					</div>
					<button type="button" onClick={resetChat} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"><RotateCcw size={15} /> New conversation</button>
				</aside>

				<section className="flex min-h-[calc(100dvh-5rem)] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-indigo-950/20 sm:rounded-[2rem] lg:min-h-[calc(100vh-7rem)]">
					<header className="border-b border-white/10 px-4 py-4 sm:px-8 sm:py-5">
						<div className="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
							<div className="flex min-w-0 items-center gap-3">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 sm:h-12 sm:w-12 sm:rounded-2xl"><Sparkles size={20} className="sm:h-[23px] sm:w-[23px]" /></div>
								<div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300 sm:text-xs sm:tracking-[0.18em]">AI learning studio</p><h1 className="mt-1 text-xl font-black leading-tight tracking-tight sm:text-3xl">Ask. Understand. Solve.</h1></div>
							</div>
							<button type="button" onClick={resetChat} title="Start a new conversation" className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"><PanelLeft size={18} /></button>
						</div>
						<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-4">A patient maths tutor for equations, geometry, fractions, graphs, word problems, and the questions that make you pause.</p>
					</header>

					<div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-5 sm:px-8 sm:py-6">
						{messages.length === 1 && (
							<div className="mb-8 grid gap-3 sm:grid-cols-2">
								{starterPrompts.map(({ label, prompt, icon: Icon }) => <button key={label} type="button" onClick={() => askQuestion(prompt)} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-indigo-500/10"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300"><Icon size={17} /></span><span className="min-w-0"><span className="block text-sm font-bold text-slate-200">{label}</span><span className="mt-1 block truncate text-xs text-slate-500">{prompt}</span></span><ChevronRight size={16} className="ml-auto shrink-0 text-slate-600 transition group-hover:text-indigo-300" /></button>)}
							</div>
						)}

						<AnimatePresence initial={false}>
							{messages.map((message, index) => <motion.div key={`${index}-${message.role}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex min-w-0 gap-2 sm:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
								{message.role === "assistant" && <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300"><BrainCircuit size={16} /></div>}
								<div className={`min-w-0 max-w-2xl ${message.role === "user" ? "w-[90%] items-end sm:w-auto" : "w-[calc(100%-2.5rem)] items-start sm:w-auto"}`}>
									<div className={`rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === "user" ? "rounded-tr-md bg-indigo-500 text-white" : `rounded-tl-md border ${message.error ? "border-rose-400/30 bg-rose-400/10 text-rose-100" : "border-white/10 bg-white/[0.045] text-slate-200"}`}`}>
										{message.content}
									</div>
									{message.steps?.length > 0 && <div className="mt-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300"><Lightbulb size={14} /> Learning path</p><div className="space-y-2">{message.steps.map((step, stepIndex) => <p key={`${step}-${stepIndex}`} className="flex gap-2 text-xs leading-5 text-slate-300"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-[10px] font-bold text-emerald-200">{stepIndex + 1}</span>{step}</p>)}</div></div>}
									{message.alternatives?.map((alternative, alternativeIndex) => <div key={`${alternative.title}-${alternativeIndex}`} className="mt-3 rounded-2xl border border-sky-300/15 bg-sky-300/[0.06] p-4"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300"><Lightbulb size={14} /> {alternative.title}</p><div className="space-y-2">{alternative.steps.map((step, stepIndex) => <p key={`${step}-${stepIndex}`} className="flex gap-2 text-xs leading-5 text-slate-300"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-300/15 text-[10px] font-bold text-sky-200">{stepIndex + 1}</span>{step}</p>)}</div></div>)}
									{message.role === "assistant" && <button type="button" onClick={() => copyMessage(message.content, index)} className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300">{copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}{copiedIndex === index ? "Copied" : "Copy answer"}</button>}
								</div>
							</motion.div>)}
						</AnimatePresence>
						{isThinking && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300"><BrainCircuit size={16} /></div><div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.045] px-4 py-3"><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:120ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:240ms]" /></span></div></motion.div>}
						<div ref={messagesEndRef} />
					</div>

					<div className="border-t border-white/10 p-3 sm:p-6">
						<form onSubmit={(event) => { event.preventDefault(); askQuestion(); }} className="relative">
							<textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); askQuestion(); } }} rows={2} placeholder={`What are you working on, ${user?.firstName || "there"}?`} className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 py-4 pl-4 pr-14 text-sm leading-6 text-white placeholder:text-slate-600 focus:border-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/15" />
							<button type="submit" disabled={!input.trim() || isThinking} aria-label="Send question" className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp size={17} /></button>
						</form>
						<p className="mt-3 text-center text-[11px] text-slate-600">MathMind can make mistakes. Use the explanation to build your own confidence.</p>
					</div>
				</section>
			</main>
		</div>
	);
}

export default AITutor;
