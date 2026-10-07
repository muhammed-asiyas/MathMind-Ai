import {
  Award,
  BookOpen,
  BrainCircuit,
  Calculator,
  Flame,
  Hash,
  PieChart,
  Shapes,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

const iconMap = {
  ai: BrainCircuit,
  "ai-tutor": BrainCircuit,
  book: BookOpen,
  lessons: BookOpen,
  practice: Target,
  progress: TrendingUp,
  xp: Sparkles,
  level: Award,
  streak: Flame,
  goal: Target,
  algebra: Calculator,
  geometry: Shapes,
  fractions: PieChart,
  arithmetic: Hash,
  "📚": BookOpen,
  "🤖": BrainCircuit,
  "🎯": Target,
  "📈": TrendingUp,
  "🏆": Trophy,
  "⭐": Star,
  "🔥": Flame,
  "🧮": Calculator,
  "📐": Shapes,
  "🍕": PieChart,
  "🔢": Hash,
};

export default function IconGlyph({ name = "book", size = 22, className }) {
  const Icon = iconMap[name] || BookOpen;

  return (
    <Icon
      aria-hidden="true"
      focusable="false"
      size={size}
      strokeWidth={1.8}
      className={className}
    />
  );
}