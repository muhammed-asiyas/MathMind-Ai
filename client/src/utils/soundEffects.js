// Web Audio API synthesized sound engine for MathMind AI
// Provides instant, zero-latency, cross-browser UI sound effects without external audio file dependencies.

let audioCtx = null;
const STORAGE_KEY = "mathmind_sound_enabled";

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Auto-unlock audio context on first user interaction
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
}

export const isSoundEnabled = () => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
};

export const setSoundEnabled = (enabled) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
  window.dispatchEvent(new CustomEvent("mathmind:sound-toggle", { detail: { enabled } }));
};

export const toggleSound = () => {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  if (next) {
    playNotificationChime();
  }
  return next;
};

/**
 * Message Received Notification Chime:
 * A warm, luxurious multi-tonal bell chime (F5 -> A5 -> D6 harmonic progression)
 * with a soft resonant tail.
 */
export const playMessageReceived = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [
    { freq: 698.46, delay: 0, duration: 0.55, gain: 0.22 },     // F5
    { freq: 880.00, delay: 0.08, duration: 0.65, gain: 0.25 },   // A5
    { freq: 1174.66, delay: 0.16, duration: 0.85, gain: 0.28 },  // D6
  ];

  notes.forEach(({ freq, delay, duration, gain: targetGain }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + delay);

    // Warm overtone for marimba/bell resonance
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = "triangle";
    overtone.frequency.setValueAtTime(freq * 2, now + delay);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, now + delay);
    filter.frequency.exponentialRampToValueAtTime(800, now + delay + duration);

    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(targetGain, now + delay + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);

    overtoneGain.gain.setValueAtTime(0.0001, now + delay);
    overtoneGain.gain.exponentialRampToValueAtTime(targetGain * 0.25, now + delay + 0.015);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration * 0.5);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(filter);
    gain.connect(filter);
    filter.connect(ctx.destination);

    osc.start(now + delay);
    overtone.start(now + delay);
    osc.stop(now + delay + duration + 0.05);
    overtone.stop(now + delay + duration + 0.05);
  });
};

/**
 * Message Sent Bubble/Pop:
 * Subtle, warm ascending pitch pop confirming the user's message was sent.
 */
export const playMessageSent = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(360, now);
  osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.14);
};

/**
 * AI Tutor Response Sparkle:
 * A celestial, intelligent 3-note harmonic sparkle when AI finishes an answer.
 */
export const playAiResponse = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [783.99, 987.77, 1318.51]; // G5, B5, E6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.06 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.5);
  });
};

/**
 * Success / Correct Answer Triad:
 * Celebratory uplifting chime.
 */
export const playSuccess = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);

    gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.05 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.05);
    osc.stop(now + idx * 0.05 + 0.6);
  });
};

/**
 * Quick preview / test chime.
 */
export const playNotificationChime = () => {
  playMessageReceived();
};
