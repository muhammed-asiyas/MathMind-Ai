const formatNumber = (value) => Number.isInteger(value) ? String(value) : value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");

const solvePercentage = (text) => {
  const match = text.match(/what(?:\s+is|'s)?\s+(\d+(?:\.\d+)?)\s*%\s+of\s+(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const percentage = Number(match[1]);
  const value = Number(match[2]);
  const result = percentage * value / 100;
  return {
    answer: `${percentage}% of ${value} is ${formatNumber(result)}.`,
    steps: [`Convert ${percentage}% to a decimal: ${percentage} / 100 = ${formatNumber(percentage / 100)}`, `Multiply by ${value}`, `${formatNumber(percentage / 100)} x ${value} = ${formatNumber(result)}`, `Check the result by converting ${formatNumber(result)} / ${value} back to a percentage`],
    alternatives: [{ title: "Fraction method", steps: [`Write ${percentage}% as ${percentage}/100`, `Multiply: (${percentage}/100) x ${value}`, `Simplify the result to ${formatNumber(result)}`] }],
  };
};

const solvePythagorean = (text) => {
  const match = text.match(/(?:right triangle|hypotenuse).*?(\d+(?:\.\d+)?)\s*(?:and|,)\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const first = Number(match[1]);
  const second = Number(match[2]);
  const result = Math.sqrt(first ** 2 + second ** 2);
  return {
    answer: `The hypotenuse is ${formatNumber(result)} units.`,
    steps: [`Use the Pythagorean theorem: c^2 = a^2 + b^2`, `Substitute the legs: c^2 = ${first}^2 + ${second}^2`, `Calculate c^2 = ${formatNumber(first ** 2 + second ** 2)}`, `Take the square root: c = ${formatNumber(result)}`],
  };
};

const solveQuadratic = (text) => {
  const match = text.match(/(-?\d+(?:\.\d+)?)?\s*x\s*\^?\s*2\s*([+\-])\s*(\d+(?:\.\d+)?)\s*x\s*([+\-])\s*(\d+(?:\.\d+)?)\s*=\s*0/i);
  if (!match) return null;
  const [, aText, firstOperator, bText, secondOperator, cText] = match;
  const a = aText ? Number(aText) : 1;
  const b = Number(bText) * (firstOperator === "-" ? -1 : 1);
  const c = Number(cText) * (secondOperator === "-" ? -1 : 1);
  const discriminant = b ** 2 - 4 * a * c;
  if (discriminant < 0) return { answer: "This quadratic has no real solutions because its discriminant is negative.", steps: [`Identify a = ${a}, b = ${b}, c = ${c}`, `Calculate the discriminant: b^2 - 4ac = ${formatNumber(discriminant)}`, "A negative discriminant means there are no real roots", "The solutions are complex numbers"] };
  const firstRoot = (-b + Math.sqrt(discriminant)) / (2 * a);
  const secondRoot = (-b - Math.sqrt(discriminant)) / (2 * a);
  return {
    answer: `The solutions are x = ${formatNumber(firstRoot)} and x = ${formatNumber(secondRoot)}.`,
    steps: [`Identify a = ${a}, b = ${b}, c = ${c}`, `Calculate the discriminant: b^2 - 4ac = ${formatNumber(discriminant)}`, `Use x = (-b +/- sqrt(discriminant)) / (2a)`, `Substitute the values to get x = ${formatNumber(firstRoot)} or x = ${formatNumber(secondRoot)}`],
    alternatives: [{ title: "Factoring method", steps: [`Rewrite the quadratic as a product of two linear factors`, `For this example: (x - ${formatNumber(firstRoot)})(x - ${formatNumber(secondRoot)}) = 0`, `Set each factor equal to zero`, `Therefore x = ${formatNumber(firstRoot)} or x = ${formatNumber(secondRoot)}`] }],
  };
};

const solveExpression = (text) => {
  const expressionMatch = text.match(/(?:what\s+is|calculate|solve)\s+([\d\s()+\-*/^%.]+)\??$/i) || text.match(/^\s*([\d\s()+\-*/^%.]+)\s*\??$/);
  if (!expressionMatch) return null;
  const expression = expressionMatch[1].replace(/%/g, "/100").replace(/\^/g, "**").trim();
  if (!expression || !/^[\d\s()+\-*/%.]+$/.test(expression.replace(/\*\*/g, ""))) return null;
  try {
    const result = Function(`"use strict"; return (${expression})`)();
    if (!Number.isFinite(result)) return null;
    return {
      answer: `The answer is ${formatNumber(result)}.`,
      steps: [`Write the expression: ${expressionMatch[1].trim()}`, "Follow order of operations: parentheses, exponents, multiplication/division, then addition/subtraction", `Calculate the expression = ${formatNumber(result)}`, "Check the result by evaluating the operations again"],
    };
  } catch {
    return null;
  }
};

const gcd = (first, second) => {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

const solveFractionAddition = (text) => {
  const match = text.match(/(\d+)\s*\/\s*(\d+)\s*([+\-])\s*(\d+)\s*\/\s*(\d+)/);
  if (!match) return null;

  const [, firstNumeratorText, firstDenominatorText, operator, secondNumeratorText, secondDenominatorText] = match;
  const firstNumerator = Number(firstNumeratorText);
  const firstDenominator = Number(firstDenominatorText);
  const secondNumerator = Number(secondNumeratorText);
  const secondDenominator = Number(secondDenominatorText);
  const commonDenominator = firstDenominator * secondDenominator;
  const numerator = firstNumerator * secondDenominator + (operator === "+" ? 1 : -1) * secondNumerator * firstDenominator;
  const divisor = gcd(numerator, commonDenominator);
  const simplifiedNumerator = numerator / divisor;
  const simplifiedDenominator = commonDenominator / divisor;

  return {
    answer: `The answer is ${simplifiedNumerator}/${simplifiedDenominator}.`,
    steps: [
      `Find a common denominator: ${firstDenominator} x ${secondDenominator} = ${commonDenominator}`,
      `Convert the numerators: ${firstNumerator}/${firstDenominator} ${operator} ${secondNumerator}/${secondDenominator} = ${firstNumerator * secondDenominator}/${commonDenominator} ${operator} ${secondNumerator * firstDenominator}/${commonDenominator}`,
      `Combine the numerators: ${numerator}/${commonDenominator}`,
      `Simplify by ${divisor}: ${simplifiedNumerator}/${simplifiedDenominator}`,
    ],
    alternatives: [{ title: "Decimal method", steps: [`Convert ${firstNumerator}/${firstDenominator} to ${formatNumber(firstNumerator / firstDenominator)}`, `Convert ${secondNumerator}/${secondDenominator} to ${formatNumber(secondNumerator / secondDenominator)}`, `Add the decimals to get ${formatNumber(firstNumerator / firstDenominator + (operator === "+" ? 1 : -1) * secondNumerator / secondDenominator)}`, `Convert the decimal back to the simplified fraction`] }],
  };
};

const solveRectangle = (text) => {
  const match = text.match(/rectangle.*?(\d+(?:\.\d+)?)\s*(?:cm|m)?\s*(?:long|length).*?(\d+(?:\.\d+)?)\s*(?:cm|m)?\s*(?:wide|width)/i);
  if (!match) return null;
  const length = Number(match[1]);
  const width = Number(match[2]);
  return {
    answer: `The area is ${formatNumber(length * width)} square units and the perimeter is ${formatNumber(2 * (length + width))} units.`,
    steps: [`Identify length = ${length} and width = ${width}`, `Use area = length x width`, `Area = ${length} x ${width} = ${formatNumber(length * width)}`, `Perimeter = 2 x (${length} + ${width}) = ${formatNumber(2 * (length + width))}`],
    alternatives: [{ title: "Unit-square method", steps: [`Imagine ${length} rows of ${width} unit squares`, `Count the squares: ${length} x ${width}`, `The total is ${formatNumber(length * width)} square units`, `Walk around all four sides to confirm the perimeter`] }],
  };
};

const solveMean = (text) => {
  const match = text.match(/(?:mean|average).*?((?:-?\d+(?:\.\d+)?\s*,?\s*){2,})/i);
  if (!match) return null;
  const numbers = match[1].match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
  if (numbers.length < 2) return null;
  const total = numbers.reduce((sum, number) => sum + number, 0);
  return {
    answer: `The mean is ${formatNumber(total / numbers.length)}.`,
    steps: [`List the numbers: ${numbers.join(", ")}`, `Add them: ${numbers.join(" + ")} = ${formatNumber(total)}`, `Count the numbers: ${numbers.length}`, `Divide: ${formatNumber(total)} / ${numbers.length} = ${formatNumber(total / numbers.length)}`],
  };
};

const solveTwoVariableEquation = (text) => {
  const match = text.match(/(-?\d+)\s*x\s*([+\-])\s*(\d+)\s*y\s*=\s*(-?\d+)/i);
  if (!match) return null;

  const [, xCoefficientText, operator, yCoefficientText, resultText] = match;
  const xCoefficient = Number(xCoefficientText);
  const yCoefficient = Number(yCoefficientText) * (operator === "-" ? -1 : 1);
  const result = Number(resultText);
  const coefficientGcd = gcd(xCoefficient, yCoefficient);

  if (result % coefficientGcd !== 0) {
    return {
      answer: `There are no integer solutions because the greatest common divisor of the coefficients does not divide ${result}.`,
      steps: [`Find gcd(${xCoefficient}, ${yCoefficient}) = ${coefficientGcd}`, `Check whether ${coefficientGcd} divides ${result}`, "It does not divide evenly", "Therefore, no integer pair (x, y) satisfies the equation"],
    };
  }

  let xParticular = 0;
  while ((result - xCoefficient * xParticular) % yCoefficient !== 0 && xParticular < Math.abs(yCoefficient)) xParticular += 1;
  const yParticular = (result - xCoefficient * xParticular) / yCoefficient;
  const xStep = Math.abs(yCoefficient) / coefficientGcd;
  const yStep = -xCoefficient / coefficientGcd;

  return {
    answer: `There are infinitely many real solutions: choose any real x = t, then y = (${result} - ${xCoefficient}t) / ${yCoefficient}. If integer values are required, x = ${xParticular} + ${xStep}t and y = ${yParticular} ${yStep < 0 ? "-" : "+"} ${Math.abs(yStep)}t, where t is any integer. For example, t = 0 gives (x, y) = (${xParticular}, ${yParticular}).`,
    steps: [
      `Rearrange for y: ${yCoefficient}y = ${result} - ${xCoefficient}x`,
      `Choose x = ${xParticular}; then y = (${result} - ${xCoefficient}(${xParticular})) / ${yCoefficient} = ${yParticular}`,
      `The integer step pattern is x increases by ${xStep} while y changes by ${yStep}`,
      `Check: ${xCoefficient}(${xParticular}) + ${yCoefficient}(${yParticular}) = ${xCoefficient * xParticular + yCoefficient * yParticular} = ${result}`,
    ],
    alternatives: [{ title: "Choose a different value", steps: [`Choose x = ${xParticular + xStep} instead of x = ${xParticular}`, `Calculate y = (${result} - ${xCoefficient}(${xParticular + xStep})) / ${yCoefficient} = ${yParticular + yStep}`, `This gives another solution: (${xParticular + xStep}, ${yParticular + yStep})`, `Check: ${xCoefficient}(${xParticular + xStep}) + ${yCoefficient}(${yParticular + yStep}) = ${result}`] }],
  };
};

const solveMathQuestion = (question) => {
  const text = String(question || "").trim();
  const percentageAnswer = solvePercentage(text);
  if (percentageAnswer) return percentageAnswer;

  const pythagoreanAnswer = solvePythagorean(text);
  if (pythagoreanAnswer) return pythagoreanAnswer;

  const quadraticAnswer = solveQuadratic(text);
  if (quadraticAnswer) return quadraticAnswer;

  const fractionAnswer = solveFractionAddition(text);
  if (fractionAnswer) return fractionAnswer;

  const rectangleAnswer = solveRectangle(text);
  if (rectangleAnswer) return rectangleAnswer;

  const meanAnswer = solveMean(text);
  if (meanAnswer) return meanAnswer;

  const expressionAnswer = solveExpression(text);
  if (expressionAnswer) return expressionAnswer;

  const twoVariableAnswer = solveTwoVariableEquation(text);
  if (twoVariableAnswer) return twoVariableAnswer;

  const linearEquation = text.match(/(-?\d*(?:\.\d+)?)\s*x\s*([+\-])\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)/i);

  if (linearEquation) {
    const [, coefficientText, operator, constantText, rightText] = linearEquation;
    const coefficient = coefficientText === "" || coefficientText === "-" ? (coefficientText === "-" ? -1 : 1) : Number(coefficientText);
    const constant = Number(constantText) * (operator === "-" ? -1 : 1);
    const right = Number(rightText);
    const result = (right - constant) / coefficient;

    if (Number.isFinite(result) && coefficient !== 0) {
      return {
        answer: `The solution is x = ${formatNumber(result)}.`,
        steps: [
          `Move the constant term: ${formatNumber(coefficient)}x = ${formatNumber(right - constant)}`,
          `Divide both sides by ${formatNumber(coefficient)}`,
          `Calculate x = ${formatNumber(right - constant)} / ${formatNumber(coefficient)} = ${formatNumber(result)}`,
          `Check: substitute x = ${formatNumber(result)} into the original equation`,
        ],
        alternatives: [{ title: "Balance method", steps: [`Subtract ${formatNumber(constant)} from both sides`, `This leaves ${formatNumber(coefficient)}x = ${formatNumber(right - constant)}`, `Divide both sides by ${formatNumber(coefficient)}`, `The balanced result is x = ${formatNumber(result)}`] }],
      };
    }
  }

  const arithmetic = text.match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);

  if (arithmetic) {
    const [, left, operator, right] = arithmetic;
    const first = Number(left);
    const second = Number(right);
    const result = operator === "+" ? first + second : operator === "-" ? first - second : operator === "*" ? first * second : second === 0 ? null : first / second;
    if (result !== null) {
      return {
        answer: `The result is ${formatNumber(result)}.`,
        steps: [`Identify ${first} and ${second}`, `Use the ${operator === "*" ? "multiplication" : operator === "/" ? "division" : operator === "+" ? "addition" : "subtraction"} operation`, `Calculate ${first} ${operator} ${second} = ${formatNumber(result)}`, "Check the result in the original question"],
      };
    }
  }

  return {
    answer: "I could not identify the mathematical expression yet. Please include the numbers, variables, or formula in the question, for example: `solve x^2 - 5x + 6 = 0` or `what is 15% of 240`.",
    steps: ["Read the question and identify the known values", "Write the equation or formula", "Apply the appropriate mathematical rule", "Calculate and check the result"],
  };
};

const askWithProvider = async (question) => {
  const response = await fetch(process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are MathMind, a patient maths tutor. Explain any school-level maths problem accurately and simply. Return only JSON with an answer string, a steps array containing exactly 4 short strings, and an alternatives array containing one or two different valid methods. Each alternative must have a title and a steps array. Guide the student instead of only giving an answer." },
        { role: "user", content: question },
      ],
    }),
  });

  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI provider returned an empty answer");
  const parsedContent = content.replace(/^```(?:json)?\s*|\s*```$/gi, "").trim();
  const result = JSON.parse(parsedContent);
  if (!result.answer) throw new Error("AI provider returned an invalid answer");
  return { answer: String(result.answer), steps: Array.isArray(result.steps) ? result.steps.slice(0, 4).map(String) : [], alternatives: Array.isArray(result.alternatives) ? result.alternatives.slice(0, 2).map((alternative) => ({ title: String(alternative.title || "Another method"), steps: Array.isArray(alternative.steps) ? alternative.steps.slice(0, 4).map(String) : [] })) : [] };
};

const generatePracticeQuestions = async ({ lesson, difficulty }) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith("your_")) {
    const error = new Error("AI practice generation is not configured.");
    error.statusCode = 503;
    error.clientMessage = "AI practice is unavailable until an AI provider key is configured. Your regular lesson questions are still available.";
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You create accurate middle-school mathematics practice. Return only JSON with a questions array containing exactly 5 objects. Each object must contain prompt, answer, hint, and explanation strings. Make all 5 questions distinct, self-contained, solvable, and directly about the supplied lesson. Match the requested difficulty: Beginner uses one familiar step, Intermediate combines two ideas or steps, Hard uses multi-step or real-world reasoning appropriate to middle school. Calculate and independently check every answer before returning it. Answers must be short plain values suitable for exact numeric or text checking, without working. Hints should guide without giving away the answer. Explanations should show a concise, correct solution. Do not use LaTeX, Markdown, or questions requiring a diagram.",
          },
          {
            role: "user",
            content: JSON.stringify({
              subject: "middle-school mathematics",
              topic: lesson.topicTitle,
              lesson: lesson.title,
              lessonDescription: lesson.description,
              lessonContent: lesson.content,
              difficulty,
              instruction: "Create new question contexts and values; do not copy a worked example verbatim.",
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = new Error(`AI practice provider returned HTTP ${response.status}`);
      error.statusCode = response.status === 429 ? 503 : 502;
      error.clientMessage = response.status === 429
        ? "AI practice is temporarily rate-limited. Please wait a moment and try again."
        : "AI practice could not be generated right now. Please try again.";
      throw error;
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("AI practice provider returned an empty response");
    }

    const parsedContent = content.replace(/^```(?:json)?\s*|\s*```$/gi, "").trim();
    const result = JSON.parse(parsedContent);
    if (!Array.isArray(result.questions) || result.questions.length !== 5) {
      throw new Error("AI practice provider returned an invalid question set");
    }

    const questions = result.questions.map((question) => {
      const cleanText = (value, field) => {
        if (typeof value !== "string" || !value.trim() || value.length > 600) {
          throw new Error(`AI practice provider returned an invalid ${field}`);
        }
        return value.trim();
      };

      return {
        prompt: cleanText(question.prompt, "question"),
        answer: cleanText(question.answer, "answer"),
        hint: cleanText(question.hint, "hint"),
        explanation: cleanText(question.explanation, "explanation"),
      };
    });
    const uniquePrompts = new Set(questions.map((question) => question.prompt.toLowerCase().replace(/[^a-z0-9]/g, "")));
    if (uniquePrompts.size !== questions.length) {
      throw new Error("AI practice provider returned repeated questions");
    }

    return questions;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("AI practice generation timed out");
      timeoutError.statusCode = 504;
      timeoutError.clientMessage = "AI practice took too long to generate. Please try again.";
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const recognizeHandwriting = async (imageDataUrl) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith("your_")) {
    const error = new Error("Handwriting recognition is not configured. Add OPENAI_API_KEY to the server environment and restart the server.");
    error.statusCode = 503;
    error.clientMessage = error.message;
    throw error;
  }

  const response = await fetch(process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_VISION_MODEL || "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "Transcribe the student's handwritten math from the image. Return only JSON with a recognizedText string. If the work shows steps, return only the student's clearly marked final answer; otherwise transcribe the visible math exactly. Do not solve or guess. Use an empty string if no answer can be read.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Read the handwritten final answer in this image." },
            { type: "image_url", image_url: { url: imageDataUrl, detail: "high" } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const providerError = await response.json().catch(() => ({}));
    const providerMessage = providerError.error?.message || "";
    const error = new Error(`Handwriting recognition provider returned HTTP ${response.status}${providerMessage ? `: ${providerMessage}` : ""}`);
    error.statusCode = 502;
    error.clientMessage = response.status === 401 || response.status === 403
      ? "Handwriting recognition was rejected by the AI provider. Check the server API key and account permissions."
      : response.status === 404
        ? "The handwriting AI model or API endpoint was not found. Check AI_VISION_MODEL and AI_API_URL."
        : response.status === 400
          ? "The handwriting AI request was rejected. Set AI_VISION_MODEL to a vision-capable model supported by AI_API_URL."
          : response.status === 429
            ? "The handwriting AI provider is rate-limited or out of quota. Check your provider account."
            : "Handwriting recognition is temporarily unavailable. Please try again.";
    throw error;
  }
  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) throw new Error("AI provider returned an empty handwriting transcription");
  const parsedContent = content.replace(/^```(?:json)?\s*|\s*```$/gi, "").trim();
  const result = JSON.parse(parsedContent);
  if (typeof result.recognizedText !== "string") {
    const error = new Error("AI provider returned an invalid handwriting transcription");
    error.clientMessage = "The handwriting AI returned an unreadable response. Please try writing the answer again.";
    throw error;
  }
  return { recognizedText: result.recognizedText.trim().slice(0, 200) };
};

const askTutor = async (question) => {
  if (process.env.OPENAI_API_KEY) {
    try {
      return await askWithProvider(question);
    } catch (error) {
      console.error("AI PROVIDER ERROR, USING LOCAL SOLVER:", error.message);
    }
  }
  return solveMathQuestion(question);
};

module.exports = { askTutor, generatePracticeQuestions, recognizeHandwriting };