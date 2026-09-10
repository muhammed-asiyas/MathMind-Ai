import { Film, Play, Sparkles, Volume2 } from "lucide-react";

function getYouTubeEmbedUrl(videoUrl) {
	try {
		const url = new URL(videoUrl);
		const videoId = url.hostname.includes("youtu.be")
			? url.pathname.slice(1)
			: url.searchParams.get("v");

		return videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;
	} catch {
		return videoUrl;
	}
}

function VideoPlayer({ videoUrl, title }) {
	if (!videoUrl) {
		return (
			<div className="relative isolate flex aspect-video items-center justify-center overflow-hidden bg-slate-950 px-6 text-center">
				<div className="absolute -left-12 top-8 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />
				<div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
				<div className="relative z-10">
					<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-indigo-200 shadow-2xl shadow-indigo-950/40">
						<Film size={25} />
					</div>
					<p className="mt-4 text-sm font-semibold text-slate-200">Animated video coming soon</p>
					<p className="mt-1 text-xs text-slate-500">Your teacher will add a visual lesson here.</p>
				</div>
			</div>
		);
	}

	const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
	const embedUrl = getYouTubeEmbedUrl(videoUrl);
	const iframeUrl = `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1&mute=1&loop=1&playlist=${embedUrl.split("/").pop()}`;

	return (
		<div className="group relative isolate aspect-video overflow-hidden bg-slate-950">
			<div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-slate-950/65 via-transparent to-slate-950/80" />
			<div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
				<span className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1.5 backdrop-blur-md">
					<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_10px_#86efac]" />
					Now playing
				</span>
				<span className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1.5 backdrop-blur-md sm:flex">
					<Sparkles size={12} /> Visual lesson
				</span>
			</div>
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4">
				<div className="min-w-0">
					<p className="truncate text-sm font-bold text-white drop-shadow-lg">{title || "Mathematics lesson"}</p>
					<div className="mt-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/60">
						<Volume2 size={12} /> Sound off for focus
					</div>
				</div>
				<div className="flex h-7 items-end gap-1" aria-hidden="true">
					{["h-2", "h-4", "h-6", "h-3", "h-5"].map((height, index) => <span key={height} className={`w-1 rounded-full bg-cyan-300/90 animate-pulse ${height}`} style={{ animationDelay: `${index * 140}ms` }} />)}
				</div>
			</div>
			{isYouTube ? (
				<iframe
					className="h-full w-full"
					src={iframeUrl}
					title={title || "Mathematics lesson video"}
					allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
			) : (
				<video className="h-full w-full bg-black object-cover" autoPlay muted loop playsInline controls preload="metadata">
					<source src={videoUrl} />
					Your browser does not support video playback.
				</video>
			)}
			<div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:opacity-100">
				<Play size={18} fill="currentColor" />
			</div>
		</div>
	);
}

export default VideoPlayer;
