const buildQuestion = (key, value, level) => {
	const number = value;
	const double = number * 2;
	const triple = number * 3;

	switch (key) {
		case "integer-operations":
			if (level === 0) return [`Calculate -${number} + ${number + 8}.`, "8", `Start at -${number} on a number line and move ${number + 8} units right.`];
			if (level === 1) return [`Calculate ${number - 10} - ${number + 3}.`, "-13", "Subtracting a positive number moves left on the number line."];
			return [`Calculate -${number} × 3.`, String(-triple), "A negative multiplied by a positive is negative."];
		case "order-of-operations":
			if (level === 0) return [`Evaluate 2 + ${number} × 3.`, String(2 + triple), "Multiply before adding."];
			if (level === 1) return [`Evaluate (${number} + 4) × 2 - 3.`, String((number + 4) * 2 - 3), "Evaluate parentheses first, then multiply, then subtract."];
			return [`Evaluate 3² + ${number} × 2.`, String(9 + double), "Evaluate the exponent and multiplication before adding."];
		case "powers-square-roots":
			if (level === 0) return [`What is ${number + 1} squared?`, String((number + 1) ** 2), "Multiply the number by itself."];
			if (level === 1) return [`What is the square root of ${(number + 1) ** 2}?`, String(number + 1), "Find the positive number that multiplies by itself to make this value."];
			return [`Evaluate 2 to the power of ${number}.`, String(2 ** number), "Multiply 2 by itself the stated number of times."];
		case "ratios-equivalent":
			if (level === 0) return [`Simplify the ratio ${double}:${triple}.`, "2:3", "Divide both parts of the ratio by the same common factor."];
			if (level === 1) return [`Write an equivalent ratio to ${number}:${number + 2} with the first part doubled.`, `${double}:${2 * (number + 2)}`, "Multiply both parts by 2."];
			return [`Simplify the ratio ${triple}:${number * 6}.`, "1:2", "Divide both parts by their greatest common factor."];
		case "rates-unit-rates":
			if (level === 0) return [`${number * 3} apples are packed equally into ${number} bags. How many apples are in each bag?`, "3", "Divide the total number of apples by the number of bags."];
			if (level === 1) return [`A cyclist travels ${number * 4} kilometres in 2 hours. What is the speed in kilometres per hour?`, String(number * 2), "Divide the distance by the time."];
			return [`${number * 5} tickets cost $${number * 20}. What is the cost per ticket?`, "4", "Divide the total cost by the number of tickets."];
		case "proportions-scale":
			if (level === 0) return [`Solve x/4 = ${number}/2.`, String(double), "Multiply both sides by 4."];
			if (level === 1) return [`A map uses 1 cm for ${number * 3} km. What real distance does 4 cm represent?`, String(number * 12), "Multiply the map distance by the scale for 1 cm."];
			return [`Solve x/6 = ${number}/3.`, String(double), "Multiply both sides by 6."];
		case "percent-conversions":
			if (level === 0) return [`Write ${number * 5}% as a decimal.`, (number / 20).toFixed(2), "Divide the percentage by 100."];
			if (level === 1) return [`Write ${(number / 20).toFixed(2)} as a percentage.`, `${number * 5}%`, "Multiply the decimal by 100 and add the percent sign."];
			return [`Write ${number}/20 as a percentage.`, `${number * 5}%`, "Convert the fraction to a decimal, then multiply by 100."];
		case "percent-of-amount":
			if (level === 0) return [`Find 10% of ${number * 10}.`, String(number), "Ten percent is one tenth of the amount."];
			if (level === 1) return [`Find 25% of ${number * 4}.`, String(number), "Twenty-five percent is one quarter."];
			return [`A $${number * 5} item is discounted by 20%. What is the sale price?`, String(number * 4), "Find 20% of the original price, then subtract the discount."];
		case "financial-maths":
			if (level === 0) return [`You have $${number * 20} and spend $${number * 7}. How much money remains?`, String(number * 13), "Subtract the amount spent from the starting amount."];
			if (level === 1) return [`Two identical notebooks cost $${number * 8}. What is the price of one notebook?`, String(number * 4), "Divide the total price by 2."];
			return [`A $${number * 4} item is reduced by 25%. How many dollars are saved?`, String(number), "Twenty-five percent is one quarter of the original price."];
		case "algebraic-expressions":
			if (level === 0) return [`Evaluate 2x + 3 when x = ${number}.`, String(double + 3), "Substitute the value of x, then multiply before adding."];
			if (level === 1) return [`Simplify ${number}a + ${number * 2}a.`, `${triple}a`, "Add the coefficients of like terms."];
			return [`Expand 3(x + ${number}).`, `3x+${triple}`, "Multiply 3 by each term inside the parentheses."];
		case "patterns-coordinate-rules":
			if (level === 0) return [`A sequence starts ${number}, ${number + 3}, ${number + 6}. What is the next term?`, String(number + 9), "The sequence increases by 3 each time."];
			if (level === 1) return [`The rule is y = 2x + 1. Find y when x = ${number}.`, String(double + 1), "Substitute the input value for x."];
			return [`A pattern has rule y = 3x - 2. Find y when x = ${number}.`, String(triple - 2), "Multiply the input by 3, then subtract 2."];
		case "equations-inequalities":
			if (level === 0) return [`Solve x + ${number} = ${double}.`, String(number), "Subtract the same number from both sides."];
			if (level === 1) return [`Solve 2x - ${number} = ${number * 5}.`, String(triple), "Add the constant, then divide both sides by 2."];
			return [`Solve x - ${number} > ${number}. Give the answer as an inequality.`, `x>${double}`, "Add the same number to both sides; the inequality sign stays the same."];
		case "volume-surface-area":
			if (level === 0) return [`Find the volume of a box measuring 2 cm by 3 cm by ${number} cm.`, String(number * 6), "Multiply length, width, and height."];
			if (level === 1) return [`Find the volume of a cube with side length ${number} cm.`, String(number ** 3), "Cube the side length: side × side × side."];
			return [`Find the surface area of a box measuring 1 cm by 2 cm by ${number} cm.`, String(6 * number + 4), "Add the areas of the three pairs of matching faces."];
		case "coordinate-geometry-transformations":
			if (level === 0) return [`Reflect the point (${number}, 2) across the y-axis. Give the new coordinates.`, `(-${number},2)`, "A reflection across the y-axis changes the sign of x."];
			if (level === 1) return [`Move the point (${number}, 3) two units right. What is its new x-coordinate?`, String(number + 2), "Add 2 to the x-coordinate."];
			return [`Find the midpoint of (${number}, 2) and (${number + 4}, 6). Give the coordinates.`, `(${number + 2},4)`, "Average the x-coordinates and average the y-coordinates."];
		case "data-averages-probability":
			if (level === 0) return [`Find the range of ${number}, ${number + 3}, and ${number + 7}.`, "7", "Subtract the smallest value from the largest."];
			if (level === 1) return [`Find the mean of ${number}, ${number + 2}, and ${number + 4}.`, String(number + 2), "Add the values and divide by 3."];
			return [`A bag has ${number} red counters and ${number} blue counters. What is the probability of choosing red?`, "1/2", "Divide the number of red counters by the total number of counters."];
		default:
			return null;
	}
};

const getMiddleSchoolQuestions = (questionSetKey) => {
	const firstQuestion = buildQuestion(questionSetKey, 1, 0);
	if (!firstQuestion) return null;

	return Array.from({ length: 45 }, (_, index) => {
		const level = Math.floor(index / 15);
		const value = (index % 15) + 1;
		const [prompt, answer, hint] = buildQuestion(questionSetKey, value, level);

		return {
			questionIndex: index,
			difficulty: level === 0 ? "Beginner" : level === 1 ? "Intermediate" : "Hard",
			prompt,
			answer,
			hint,
		};
	});
};

module.exports = { getMiddleSchoolQuestions };
