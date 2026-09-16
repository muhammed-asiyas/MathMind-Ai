const LEVELS = [
  { level: 1, name: "Foundation", minXp: 0, application: "Use number sense to compare prices, count change, and estimate everyday quantities." },
  { level: 2, name: "Explorer", minXp: 100, application: "Use fractions, percentages, and basic equations while following recipes and shopping discounts." },
  { level: 3, name: "Practitioner", minXp: 250, application: "Use algebra and geometry to plan budgets, compare mobile plans, and measure rooms." },
  { level: 4, name: "Problem Solver", minXp: 450, application: "Use formulas, graphs, and rates to analyze travel time, fitness data, and household energy use." },
  { level: 5, name: "Real-World Thinker", minXp: 700, application: "Model multi-step decisions with data, probability, optimization, and financial reasoning." },
  { level: 6, name: "Math Mentor", minXp: 1000, application: "Build and explain mathematical models for real projects, experiments, and business decisions." },
];

const TOPIC_APPLICATIONS = {
  Algebra: [
    "Create a monthly budget using variables for income, savings, and expenses.",
    "Compare two phone plans by writing an equation for their total cost.",
    "Scale a recipe or project materials using algebraic expressions.",
  ],
  Geometry: [
    "Measure a room and calculate paint, flooring, or furniture space.",
    "Use angles and distance to plan a ramp, garden, or simple structure.",
    "Estimate material cost from area, perimeter, and volume.",
  ],
  Fractions: [
    "Adjust recipe portions and convert between fractions, decimals, and percentages.",
    "Compare sale discounts and decide which product offers better value.",
    "Split time, money, or resources fairly across a group.",
  ],
  Arithmetic: [
    "Calculate shopping totals, tax, change, and unit prices.",
    "Track daily habits by adding, averaging, and comparing measurements.",
    "Plan quantities and costs for a trip, event, or household task.",
  ],
};

const getLevelForXp = (xp = 0) => LEVELS.reduce(
  (current, level) => (xp >= level.minXp ? level : current),
  LEVELS[0]
);

const getLearningProfile = (xp = 0, preferredTopic = "Algebra") => {
  const safeXp = Math.max(0, Number(xp) || 0);
  const current = getLevelForXp(safeXp);
  const next = LEVELS.find((level) => level.minXp > safeXp);
  const topicApplications = TOPIC_APPLICATIONS[preferredTopic] || TOPIC_APPLICATIONS.Algebra;
  const progressXp = next ? safeXp - current.minXp : 0;
  const requiredXp = next ? next.minXp - current.minXp : 1;

  return {
    level: current.level,
    title: current.name,
    xp: safeXp,
    nextLevel: next ? { level: next.level, title: next.name, requiredXp: next.minXp } : null,
    progressPercent: next ? Math.min(Math.round((progressXp / requiredXp) * 100), 100) : 100,
    realWorldApplication: topicApplications[(current.level - 1) % topicApplications.length] || current.application,
    levelApplication: current.application,
    recommendedTopic: preferredTopic,
  };
};

module.exports = { LEVELS, getLevelForXp, getLearningProfile };
