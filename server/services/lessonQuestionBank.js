const questionBanks = {
  "variables-expressions": [
    ["Evaluate 3a + 2 when a = 4", "14", "Substitute 4 for a, then multiply and add."],
    ["Evaluate 5x - 1 when x = 3", "14", "Substitute 3 for x."],
    ["If n = 6, find 2n + 7", "19", "Multiply 2 by 6, then add 7."],
    ["Evaluate 4p when p = 8", "32", "Multiply 4 by 8."],
    ["Find 7 + 3m when m = 5", "22", "Multiply 3 by 5, then add 7."],
  ],
  "one-step-equations": [
    ["Solve x + 9 = 17", "8", "Subtract 9 from both sides."],
    ["Solve y - 6 = 13", "19", "Add 6 to both sides."],
    ["Solve 5m = 35", "7", "Divide both sides by 5."],
    ["Solve p / 4 = 6", "24", "Multiply both sides by 4."],
    ["Solve 3a + 0 = 27", "9", "Divide 27 by 3."],
  ],
  "two-step-equations": [
    ["Solve 2x + 5 = 17", "6", "Subtract 5, then divide by 2."],
    ["Solve 4y - 8 = 20", "7", "Add 8, then divide by 4."],
    ["Solve 3(n + 2) = 21", "5", "Divide by 3, then subtract 2."],
    ["Solve 5p - 10 = 25", "7", "Add 10, then divide by 5."],
    ["Solve 2(a - 4) = 12", "10", "Divide by 2, then add 4."],
  ],
  "angles-lines": [
    ["Find the angle on a straight line beside 65 degrees", "115", "Angles on a straight line total 180 degrees."],
    ["A triangle has angles 45 and 70 degrees. Find the third angle.", "65", "Triangle angles total 180 degrees."],
    ["What is the complement of 34 degrees?", "56", "Complementary angles total 90 degrees."],
    ["An angle of 125 degrees is acute or obtuse?", "obtuse", "Obtuse angles are greater than 90 degrees."],
    ["Corresponding angles are equal. One is 72 degrees. Find the other.", "72", "Corresponding angles are equal on parallel lines."],
  ],
  "area-perimeter": [
    ["Find the area of a rectangle 8 cm by 5 cm", "40", "Multiply length by width."],
    ["Find the perimeter of a square with side 7 cm", "28", "Multiply the side by 4."],
    ["Find the area of a triangle with base 10 cm and height 6 cm", "30", "Use base times height divided by 2."],
    ["A rectangle is 12 m long and 4 m wide. Find its perimeter.", "32", "Use 2 times length plus width."],
    ["Find the area of a parallelogram with base 9 cm and height 3 cm", "27", "Multiply base by perpendicular height."],
  ],
  "circles-pythagoras": [
    ["Using pi = 3, find the circumference of a circle with radius 4", "24", "Use 2 times pi times radius."],
    ["Using pi = 3, find the area of a circle with radius 5", "75", "Use pi times radius squared."],
    ["A right triangle has legs 6 and 8. Find the hypotenuse.", "10", "Use 6 squared plus 8 squared."],
    ["A right triangle has hypotenuse 13 and leg 5. Find the other leg.", "12", "Use 13 squared minus 5 squared."],
    ["Using pi = 3, find the area with radius 6", "108", "Multiply 3 by 6 squared."],
  ],
  "equivalent-simplification": [
    ["Simplify 18/24", "3/4", "Divide numerator and denominator by 6."],
    ["Simplify 21/28", "3/4", "Divide both parts by 7."],
    ["Write an equivalent fraction for 2/5 with denominator 20", "8/20", "Multiply both parts by 4."],
    ["Simplify 16/40", "2/5", "Divide both parts by 8."],
    ["Write 3/4 as a decimal", "0.75", "Divide 3 by 4."],
  ],
  "adding-subtracting": [
    ["Calculate 1/4 + 1/4", "1/2", "Add the numerators, then simplify."],
    ["Calculate 5/6 - 1/3", "1/2", "Convert 1/3 to 2/6 first."],
    ["Calculate 2/5 + 1/10", "1/2", "Convert 2/5 to 4/10."],
    ["Calculate 7/8 - 1/4", "5/8", "Convert 1/4 to 2/8."],
    ["Calculate 1/3 + 1/9", "4/9", "Convert 1/3 to 3/9."],
  ],
  "multiplying-dividing": [
    ["Find 2/3 of 18", "12", "Divide by 3, then multiply by 2."],
    ["Calculate 3/4 x 8", "6", "Multiply 3/4 by 8."],
    ["Find 5/6 of 24", "20", "Divide 24 by 6, then multiply by 5."],
    ["Calculate 2/5 divided by 1/5", "2", "Multiply by the reciprocal of 1/5."],
    ["Find 7/10 of 50", "35", "Divide 50 by 10, then multiply by 7."],
  ],
  "place-value-operations": [
    ["What is the value of 7 in 4,732?", "700", "The 7 is in the hundreds place."],
    ["Calculate 468 + 257", "725", "Add ones, tens, then hundreds."],
    ["Round 3,649 to the nearest hundred", "3600", "The tens digit is 4."],
    ["Calculate 900 - 376", "524", "Subtract carefully by place value."],
    ["Write 5,208 in expanded form", "5000+200+8", "Break the number into place values."],
  ],
  "multiplication-division": [
    ["Calculate 36 x 7", "252", "Multiply 36 by 7."],
    ["Calculate 864 / 8", "108", "Share 864 into 8 equal groups."],
    ["A box has 24 pencils. How many pencils are in 6 boxes?", "144", "Multiply 24 by 6."],
    ["Calculate 1,248 / 6", "208", "Divide each place value carefully."],
    ["Calculate 125 x 4", "500", "Multiply 125 by 4."],
  ],
  "factors-multiples-gcf-lcm": [
    ["Find the GCF of 18 and 30", "6", "List the common factors and choose the largest."],
    ["Find the LCM of 6 and 8", "24", "List multiples until the first match."],
    ["Is 29 prime?", "yes", "29 has only factors 1 and 29."],
    ["Find the next multiple of 7 after 42", "49", "Add 7 to 42."],
    ["Find the GCF of 28 and 42", "14", "14 is the largest number dividing both."],
  ],
};

function getLessonQuestions(questionSetKey) {
  return (questionBanks[questionSetKey] || []).map(([prompt, answer, hint], questionIndex) => ({
    questionIndex,
    prompt,
    answer,
    hint,
  }));
}

function resolveQuestionSetKey(title = "", topicTitle = "", order = 1) {
  const text = `${topicTitle} ${title}`.toLowerCase().replace(/[-/&]/g, " ");
  const titleMatches = [
    "variables-expressions", "one-step-equations", "two-step-equations",
    "angles-lines", "area-perimeter", "circles-pythagoras",
    "equivalent-simplification", "adding-subtracting", "multiplying-dividing",
    "place-value-operations", "multiplication-division", "factors-multiples-gcf-lcm",
  ];
  const match = titleMatches.find((key) => key.replace(/-/g, " ").split(" ").every((part) => text.includes(part)));
  if (match) return match;

  const groups = [
    ["algebra", ["variables-expressions", "one-step-equations", "two-step-equations"]],
    ["geometry", ["angles-lines", "area-perimeter", "circles-pythagoras"]],
    ["fraction", ["equivalent-simplification", "adding-subtracting", "multiplying-dividing"]],
    ["arithmetic", ["place-value-operations", "multiplication-division", "factors-multiples-gcf-lcm"]],
  ];
  const group = groups.find(([key]) => text.includes(key));
  const index = Math.max(Number(order || 1) - 1, 0);
  return group?.[1][index] || "";
}

module.exports = { getLessonQuestions, resolveQuestionSetKey };
