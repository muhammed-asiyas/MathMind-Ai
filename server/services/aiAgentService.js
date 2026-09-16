const { askTutor } = require("./aiService");

const detectIntent = (question) => {
  const text = question.toLowerCase();
  if (/\b(explain|why|understand|teach)\b/.test(text)) return "concept_explanation";
  if (/\b(graph|plot|coordinate|slope)\b/.test(text)) return "algebra_or_graph";
  if (/\b(area|perimeter|triangle|circle|angle|volume|geometry)\b/.test(text)) return "geometry";
  if (/\b(probability|chance|likely|odds)\b/.test(text)) return "probability";
  if (/\b(mean|median|mode|average|statistics)\b/.test(text)) return "statistics";
  if (/\b(equation|solve|calculate|find|what is)\b/.test(text) || /[=+\-*/^]/.test(text)) return "calculation";
  return "general_math";
};

const verifyAnswer = (question, result) => {
  const equation = question.match(/(-?\d+)\s*x\s*([+\-])\s*(\d+)\s*y\s*=\s*(-?\d+)/i);
  if (!equation || !result?.answer) return { checked: false, message: "Explanation returned; no local verification rule matched this question." };

  const [, xText, operator, yText, totalText] = equation;
  const x = Number(xText);
  const y = Number(yText) * (operator === "-" ? -1 : 1);
  const total = Number(totalText);
  const match = result.answer.match(/t = 0 gives \(x, y\) = \((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)/i);
  if (!match) return { checked: false, message: "The equation was identified, but no concrete example was available to verify." };

  const exampleX = Number(match[1]);
  const exampleY = Number(match[2]);
  const calculated = x * exampleX + y * exampleY;
  return calculated === total
    ? { checked: true, message: `Verified: ${x}(${exampleX}) ${operator} ${Math.abs(y)}(${exampleY}) = ${total}.` }
    : { checked: false, message: "The generated example did not pass verification." };
};

const askAgent = async (question) => {
  const intent = detectIntent(question);
  const result = await askTutor(question);
  const verification = verifyAnswer(question, result);

  return {
    ...result,
    agent: {
      intent,
      stages: ["analyze", "solve", "verify", "teach"],
      verification,
    },
  };
};

module.exports = { askAgent, detectIntent, verifyAnswer };
