import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock3, PlayCircle, Sparkles, CheckCircle2 } from "lucide-react";
import api from "../../services/api";
import VideoPlayer from "../../components/VideoPlayer";
import { useAuth } from "../../context/authContext";

const lessonGuides = {
  // Algebra Lessons
  "variables-expressions": {
    eyebrow: "Lesson 1.1 · Variables & Expressions",
    title: "Variables & Expressions",
    summary: "Learn how symbols and letters represent unknown values and how to evaluate algebraic expressions.",
    idea: "A variable is a letter standing for a number. Substitute the given number in place of the variable to calculate.",
    example: "Evaluate 3a + 2 when a = 4  ->  3(4) + 2 = 12 + 2 = 14",
    videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
    videoPool: [
      "https://www.youtube.com/embed/NybHckSEQBI",
      "https://www.youtube.com/embed/NybHckSEQBI",
      "https://www.youtube.com/embed/Qyd_v3DGzTM",
      "https://www.youtube.com/embed/3TklZi6MeJ4",
      "https://www.youtube.com/embed/52tpYl2tTqk",
    ],
    visual: "algebra",
    questions: [
      { prompt: "Evaluate 3a + 2 when a = 4", answer: "14", hint: "Replace a with 4, then multiply by 3 and add 2." },
      { prompt: "Evaluate 2x - 3 when x = 5", answer: "7", hint: "Replace x with 5, calculate 2 x 5 then subtract 3." },
      { prompt: "Calculate 4n when n = 6", answer: "24", hint: "Multiply 4 by 6." },
      { prompt: "A taxi charges $4 plus $2 per mile. What is the total cost for 6 miles?", answer: "16", hint: "Use expression 4 + 2 x 6." },
      { prompt: "If b = 7, find the value of 2b - 5", answer: "9", hint: "Replace b with 7: (2 x 7) - 5." },
      { prompt: "Find the value of 5x + 3 if x = 2", answer: "13", hint: "5 times 2 is 10, plus 3." },
      { prompt: "Evaluate 10 - 2y when y = 4", answer: "2", hint: "10 - (2 x 4) = 10 - 8." },
      { prompt: "Solve 3a + 5 if a = 3", answer: "14", hint: "3 x 3 = 9, add 5." },
      { prompt: "Calculate 6(m - 1) if m = 5", answer: "24", hint: "6 x (5 - 1) = 6 x 4." },
      { prompt: "Evaluate 2x² when x = 3", answer: "18", hint: "3 squared is 9, 2 x 9 = 18." },
      { prompt: "If p = 10, find 3p + 4", answer: "34", hint: "3 x 10 = 30, add 4." },
      { prompt: "Evaluate 20 - 4a if a = 3", answer: "8", hint: "20 - (4 x 3) = 20 - 12." },
      { prompt: "Find 7 + 2n if n = 4", answer: "15", hint: "2 x 4 = 8, add 7." },
      { prompt: "If k = 6, find 5k - 10", answer: "20", hint: "5 x 6 = 30, subtract 10." },
      { prompt: "Evaluate 1/2 of 4x if x = 6", answer: "12", hint: "Half of (4 x 6) is half of 24." },
    ],
  },
  "one-step-equations": {
    eyebrow: "Lesson 1.2 · One-Step Equations",
    title: "One-Step Equations",
    summary: "Master isolating variables using inverse operations (addition/subtraction, multiplication/division).",
    idea: "To isolate x on one side of the equal sign, perform the inverse operation to both sides.",
    example: "Solve 4n = 28  ->  divide both sides by 4  ->  n = 7",
    videoUrl: "https://www.youtube.com/embed/Qyd_v3DGzTM",
    videoPool: [
      "https://www.youtube.com/embed/Qyd_v3DGzTM",
      "https://www.youtube.com/embed/NybHckSEQBI",
      "https://www.youtube.com/embed/Qyd_v3DGzTM",
      "https://www.youtube.com/embed/9ITsXICV2u0",
      "https://www.youtube.com/embed/Qyd_v3DGzTM",
    ],
    visual: "algebra",
    questions: [
      { prompt: "Solve 4n = 28", answer: "7", hint: "Divide both sides by 4." },
      { prompt: "Solve x / 4 = 9", answer: "36", hint: "Multiply both sides by 4." },
      { prompt: "Solve y + 8 = 21", answer: "13", hint: "Subtract 8 from both sides." },
      { prompt: "Solve m - 6 = 15", answer: "21", hint: "Add 6 to both sides." },
      { prompt: "Solve 6m = 42", answer: "7", hint: "Divide both sides by 6." },
      { prompt: "Solve x + 5 = 12", answer: "7", hint: "Subtract 5 from 12." },
      { prompt: "Solve 2p = 18", answer: "9", hint: "Divide 18 by 2." },
      { prompt: "Solve k - 10 = 5", answer: "15", hint: "Add 10 to 5." },
      { prompt: "Solve a / 3 = 4", answer: "12", hint: "Multiply 4 by 3." },
      { prompt: "Solve 7 + y = 20", answer: "13", hint: "Subtract 7 from 20." },
      { prompt: "Solve 5x = 45", answer: "9", hint: "Divide 45 by 5." },
      { prompt: "Solve n - 12 = 8", answer: "20", hint: "Add 12 to 8." },
      { prompt: "Solve x / 5 = 6", answer: "30", hint: "Multiply 6 by 5." },
      { prompt: "Solve 15 + m = 25", answer: "10", hint: "Subtract 15 from 25." },
      { prompt: "Solve 9a = 81", answer: "9", hint: "Divide 81 by 9." },
    ],
  },
  "two-step-equations": {
    eyebrow: "Lesson 1.3 · Two-Step & Brackets Equations",
    title: "Two-Step & Brackets Equations",
    summary: "Solve multi-step linear equations involving coefficients, constants, and parentheses.",
    idea: "First undo addition or subtraction, then undo multiplication or division, and expand brackets.",
    example: "Solve 3(x + 2) = 21  ->  x + 2 = 7  ->  x = 5",
    videoUrl: "https://www.youtube.com/embed/9ITsXICV2u0",
    videoPool: [
      "https://www.youtube.com/embed/9ITsXICV2u0",
      "https://www.youtube.com/embed/Qyd_v3DGzTM",
      "https://www.youtube.com/embed/NybHckSEQBI",
      "https://www.youtube.com/embed/Qyd_v3DGzTM",
      "https://www.youtube.com/embed/Qyd_v3DGzTM",
    ],
    visual: "algebra",
    questions: [
      { prompt: "Solve 3(x + 2) = 21", answer: "5", hint: "Divide both sides by 3, then subtract 2." },
      { prompt: "Solve 5y - 7 = 18", answer: "5", hint: "Add 7 to both sides, then divide by 5." },
      { prompt: "Solve 2x + 6 = 16", answer: "5", hint: "First subtract 6, then divide by 2." },
      { prompt: "Solve 7p - 3 = 25", answer: "4", hint: "Add 3 to get 28, then divide by 7." },
      { prompt: "Solve 6m + 4 = 40", answer: "6", hint: "Subtract 4 to get 36, then divide by 6." },
      { prompt: "Solve 2(x + 4) = 14", answer: "3", hint: "Divide by 2, then subtract 4." },
      { prompt: "Solve 4y - 2 = 18", answer: "5", hint: "Add 2, then divide by 4." },
      { prompt: "Solve 3m + 5 = 20", answer: "5", hint: "Subtract 5, then divide by 3." },
      { prompt: "Solve 5(a - 1) = 20", answer: "5", hint: "Divide by 5, then add 1." },
      { prompt: "Solve 2x + 10 = 30", answer: "10", hint: "Subtract 10, then divide by 2." },
      { prompt: "Solve 4(p + 3) = 24", answer: "3", hint: "Divide by 4, then subtract 3." },
      { prompt: "Solve 6y - 6 = 24", answer: "5", hint: "Add 6, then divide by 6." },
      { prompt: "Solve 2n + 8 = 20", answer: "6", hint: "Subtract 8, then divide by 2." },
      { prompt: "Solve 3(k - 2) = 9", answer: "5", hint: "Divide by 3, then add 2." },
      { prompt: "Solve 7x + 2 = 30", answer: "4", hint: "Subtract 2, then divide by 7." },
    ],
  },

  // Geometry Lessons
  "angles-lines": {
    eyebrow: "Lesson 2.1 · Angles & Parallel Lines",
    title: "Angles & Parallel Lines",
    summary: "Identify acute, obtuse, right, corresponding, and alternate interior angles.",
    idea: "Angles on a straight line total 180°. Matching corresponding angles along parallel lines are equal.",
    example: "Straight line: 180° - 110° = 70°",
    videoUrl: "https://www.youtube.com/embed/DGKwdHMiqCg",
    videoPool: [
      "https://www.youtube.com/embed/DGKwdHMiqCg",
      "https://www.youtube.com/embed/DGKwdHMiqCg",
      "https://www.youtube.com/embed/XiAoUDfrar0",
      "https://www.youtube.com/embed/XiAoUDfrar0",
      "https://www.youtube.com/embed/DGKwdHMiqCg",
    ],
    visual: "geometry",
    questions: [
      { prompt: "How many degrees are in a straight angle?", answer: "180", hint: "A straight line makes half a full turn." },
      { prompt: "Two angles in a triangle are 50° and 60°. Find the third angle.", answer: "70", hint: "Angles in a triangle add to 180°." },
      { prompt: "A full turn is split into four equal angles. How large is each angle?", answer: "90", hint: "Divide 360° by 4." },
      { prompt: "A 10 cm line is split into 4 cm and x cm. Find x.", answer: "6", hint: "Subtract 4 from 10." },
      { prompt: "Two parallel lines are cut by a transversal. One angle is 55°. What is the matching corresponding angle?", answer: "55", hint: "Corresponding angles are equal." },
      { prompt: "What is an angle of 90 degrees called?", answer: "Right", hint: "It forms a perfect corner." },
      { prompt: "Angles in a quadrilateral add up to how many degrees?", answer: "360", hint: "Two triangles make a square." },
      { prompt: "If one angle on a straight line is 130°, what is the other?", answer: "50", hint: "Subtract 130 from 180." },
      { prompt: "An angle less than 90 degrees is known as what?", answer: "Acute", hint: "Think small." },
      { prompt: "What is the third angle if two in a triangle are 90° and 45°?", answer: "45", hint: "180 - 135 = 45." },
      { prompt: "Two alternate interior angles are equal. If one is 72°, what is the other?", answer: "72", hint: "They are equal." },
      { prompt: "What is a 180 degree angle called?", answer: "Straight", hint: "It is a line." },
      { prompt: "If an angle is 120°, is it acute or obtuse?", answer: "Obtuse", hint: "It is greater than 90." },
      { prompt: "A triangle has three equal angles. What are they?", answer: "60", hint: "Divide 180 by 3." },
      { prompt: "What is the complement of a 30° angle (to 90°)?", answer: "60", hint: "90 - 30 = 60." },
    ],
  },
  "area-perimeter": {
    eyebrow: "Lesson 2.2 · Area & Perimeter Formulae",
    title: "Area & Perimeter Formulae",
    summary: "Calculate the perimeter and surface area of rectangles, triangles, and parallelograms.",
    idea: "Perimeter is the distance around the outside edge; Area is the surface space inside.",
    example: "Rectangle Area = length x width = 9 x 4 = 36 square units",
    videoUrl: "https://www.youtube.com/embed/xCdxURXMdFY",
    videoPool: [
      "https://www.youtube.com/embed/xCdxURXMdFY",
      "https://www.youtube.com/embed/AAY1bsazcgM",
      "https://www.youtube.com/embed/xCdxURXMdFY",
      "https://www.youtube.com/embed/AAY1bsazcgM",
      "https://www.youtube.com/embed/Mfk_L4Nx2ZI",
    ],
    visual: "geometry",
    questions: [
      { prompt: "Find the perimeter of a 9 cm by 4 cm rectangle", answer: "26", hint: "Perimeter = 2 x (9 + 4)." },
      { prompt: "Find the area of a triangle with base 8 cm and height 5 cm", answer: "20", hint: "Area = (base x height) / 2." },
      { prompt: "A garden is 12 m long and 5 m wide. What is its area?", answer: "60", hint: "Multiply 12 by 5." },
      { prompt: "A square has side length 6 cm. What is its perimeter?", answer: "24", hint: "Multiply side by 4." },
      { prompt: "Find the area of a 11 cm by 3 cm rectangle", answer: "33", hint: "Multiply length by width." },
      { prompt: "A triangle has base 10 cm and height 4 cm. What is its area?", answer: "20", hint: "(10 x 4) / 2." },
      { prompt: "Find the perimeter of a square with side 7 cm", answer: "28", hint: "4 x 7." },
      { prompt: "What is the area of a rectangle 6m by 7m?", answer: "42", hint: "6 x 7." },
      { prompt: "Find the perimeter of a rectangle 5cm by 3cm", answer: "16", hint: "2 x (5+3)." },
      { prompt: "A triangle has base 6m and height 3m. What is the area?", answer: "9", hint: "(6 x 3) / 2." },
      { prompt: "Find the perimeter of a square with side 12cm", answer: "48", hint: "4 x 12." },
      { prompt: "Calculate the area of a 10cm by 10cm square", answer: "100", hint: "10 x 10." },
      { prompt: "Perimeter of a rectangle with length 10 and width 2?", answer: "24", hint: "2 x (10+2)." },
      { prompt: "Area of a triangle with base 12 and height 6?", answer: "36", hint: "(12 x 6) / 2." },
      { prompt: "Find the perimeter of a square with side 9", answer: "36", hint: "4 x 9." },
    ],
  },
  "circles-pythagoras": {
    eyebrow: "Lesson 2.3 · Circles & Pythagoras Theorem",
    title: "Circles & Pythagoras Theorem",
    summary: "Work with circumference, circle area, and right-angled triangle side lengths.",
    idea: "Pythagoras Theorem: a² + b² = c². Circumference = 2πr; Area = πr².",
    example: "Circle Area with r = 3 (use pi = 3) -> 3 x (3)² = 27",
    videoUrl: "https://www.youtube.com/embed/AA6RfgP-AHU",
    videoPool: [
      "https://www.youtube.com/embed/AA6RfgP-AHU",
      "https://www.youtube.com/embed/AA6RfgP-AHU",
      "https://www.youtube.com/embed/AA6RfgP-AHU",
      "https://www.youtube.com/embed/AA6RfgP-AHU",
      "https://www.youtube.com/embed/AA6RfgP-AHU",
    ],
    visual: "geometry",
    questions: [
      { prompt: "A wheel has radius 3 cm. Using pi = 3, find its circumference.", answer: "18", hint: "Circumference = 2 x pi x radius." },
      { prompt: "Using pi = 3, find the area of a circle with radius 2 cm.", answer: "12", hint: "Area = pi x radius x radius." },
      { prompt: "A right triangle has legs 3 cm and 4 cm. Find the hypotenuse length.", answer: "5", hint: "3² + 4² = 9 + 16 = 25. Square root of 25 is 5." },
      { prompt: "Find the perimeter of a square with side length 8 cm.", answer: "32", hint: "Multiply 8 by 4." },
      { prompt: "A 10 m ladder touches a wall 8 m high. How far is the base from the wall?", answer: "6", hint: "10² - 8² = 100 - 64 = 36. Square root of 36 is 6." },
      { prompt: "Radius 5cm, pi = 3. What is the area?", answer: "75", hint: "3 x 5 x 5." },
      { prompt: "Right triangle, legs 6 and 8. What is the hypotenuse?", answer: "10", hint: "36 + 64 = 100." },
      { prompt: "Radius 4cm, pi = 3. What is the circumference?", answer: "24", hint: "2 x 3 x 4." },
      { prompt: "Right triangle, legs 5 and 12. Hypotenuse?", answer: "13", hint: "25 + 144 = 169." },
      { prompt: "Radius 10cm, pi = 3. Area?", answer: "300", hint: "3 x 100." },
      { prompt: "Right triangle, legs 9 and 12. Hypotenuse?", answer: "15", hint: "81 + 144 = 225." },
      { prompt: "Circumference of a circle with radius 10, pi = 3?", answer: "60", hint: "2 x 3 x 10." },
      { prompt: "Radius 6, Area (pi=3)?", answer: "108", hint: "3 x 36." },
      { prompt: "Hypotenuse 5, leg 3. Other leg?", answer: "4", hint: "25 - 9 = 16." },
      { prompt: "Radius 1, Area (pi=3)?", answer: "3", hint: "3 x 1." },
    ],
  },

  // Fractions Lessons
  "equivalent-simplification": {
    eyebrow: "Lesson 3.1 · Equivalent Fractions & Simplification",
    title: "Equivalent Fractions & Simplification",
    summary: "Learn how to simplify fractions to lowest terms and find equivalent fractions.",
    idea: "Simplify a fraction by dividing both numerator and denominator by their greatest common factor.",
    example: "Simplify 6/8  ->  divide top & bottom by 2  ->  3/4",
    videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw",
    videoPool: [
      "https://www.youtube.com/embed/n0FZhQ_GkKw",
      "https://www.youtube.com/embed/n0FZhQ_GkKw",
      "https://www.youtube.com/embed/5Oh1XFXUoQ4",
      "https://www.youtube.com/embed/5Oh1XFXUoQ4",
      "https://www.youtube.com/embed/n0FZhQ_GkKw",
    ],
    visual: "fractions",
    questions: [
      { prompt: "Simplify 6/8 (write in simplest form)", answer: "3/4", hint: "Divide numerator and denominator by 2." },
      { prompt: "Simplify 12/18 (write in lowest terms)", answer: "2/3", hint: "Divide top and bottom by 6." },
      { prompt: "A pizza has 8 slices and you eat 3. What fraction remains?", answer: "5/8", hint: "Subtract 3 from 8." },
      { prompt: "A ribbon is 3/5 metre long. Write 3/5 as a decimal.", answer: "0.6", hint: "Divide 3 by 5." },
      { prompt: "Simplify 15/20 (write in lowest terms)", answer: "3/4", hint: "Divide top and bottom by 5." },
      { prompt: "Simplify 4/16", answer: "1/4", hint: "Divide by 4." },
      { prompt: "Simplify 10/25", answer: "2/5", hint: "Divide by 5." },
      { prompt: "Equivalent to 1/2 with denominator 10?", answer: "5/10", hint: "Multiply by 5." },
      { prompt: "Simplify 9/12", answer: "3/4", hint: "Divide by 3." },
      { prompt: "Write 1/4 as decimal", answer: "0.25", hint: "Divide 1 by 4." },
      { prompt: "Simplify 8/24", answer: "1/3", hint: "Divide by 8." },
      { prompt: "Simplify 5/15", answer: "1/3", hint: "Divide by 5." },
      { prompt: "Equivalent of 2/3 with bottom 6?", answer: "4/6", hint: "Multiply by 2." },
      { prompt: "Simplify 7/14", answer: "1/2", hint: "Divide by 7." },
      { prompt: "Simplify 20/100", answer: "1/5", hint: "Divide by 20." },
    ],
  },
  "adding-subtracting": {
    eyebrow: "Lesson 3.2 · Adding & Subtracting Fractions",
    title: "Adding & Subtracting Fractions",
    summary: "Find common denominators and solve addition and subtraction fraction problems.",
    idea: "Convert fractions so they share a common denominator before adding or subtracting numerators.",
    example: "2/3 + 1/6  ->  4/6 + 1/6 = 5/6",
    videoUrl: "https://www.youtube.com/embed/5juto2ze8Lg",
    videoPool: [
      "https://www.youtube.com/embed/5juto2ze8Lg",
      "https://www.youtube.com/embed/5fbzZEK77DQ",
      "https://www.youtube.com/embed/8ZbIrASBj54",
      "https://www.youtube.com/embed/5Oh1XFXUoQ4",
      "https://www.youtube.com/embed/52tpYl2tTqk",
    ],
    visual: "fractions",
    questions: [
      { prompt: "Calculate 2/3 + 1/6 (write as fraction)", answer: "5/6", hint: "Convert 2/3 into 4/6." },
      { prompt: "Calculate 1/4 + 2/4", answer: "3/4", hint: "Denominators match, add numerators." },
      { prompt: "Calculate 5/6 - 1/6 (in simplest form)", answer: "2/3", hint: "4/6 simplifies to 2/3." },
      { prompt: "Calculate 1/2 + 1/3", answer: "5/6", hint: "Common denominator is 6: 3/6 + 2/6 = 5/6." },
      { prompt: "Calculate 7/8 - 3/8 (in simplest form)", answer: "1/2", hint: "4/8 simplifies to 1/2." },
      { prompt: "1/5 + 2/5", answer: "3/5", hint: "Add numerators." },
      { prompt: "3/4 - 1/4", answer: "1/2", hint: "2/4 simplifies to 1/2." },
      { prompt: "1/3 + 1/6", answer: "1/2", hint: "2/6 + 1/6 = 3/6." },
      { prompt: "1/2 - 1/4", answer: "1/4", hint: "2/4 - 1/4 = 1/4." },
      { prompt: "2/5 + 1/10", answer: "1/2", hint: "4/10 + 1/10 = 5/10." },
      { prompt: "3/8 + 1/8", answer: "1/2", hint: "4/8 = 1/2." },
      { prompt: "5/6 - 1/3", answer: "1/2", hint: "5/6 - 2/6 = 3/6." },
      { prompt: "1/4 + 1/8", answer: "3/8", hint: "2/8 + 1/8." },
      { prompt: "4/5 - 2/5", answer: "2/5", hint: "Subtract numerators." },
      { prompt: "1/3 + 1/9", answer: "4/9", hint: "3/9 + 1/9." },
    ],
  },
  "multiplying-dividing": {
    eyebrow: "Lesson 3.3 · Multiplying & Dividing Fractions",
    title: "Multiplying & Dividing Fractions",
    summary: "Master fraction multiplication, finding fractions of quantities, and reciprocals.",
    idea: "To find a fraction of a number, divide by the denominator then multiply by the numerator.",
    example: "3/4 of 20  ->  (20 ÷ 4) x 3 = 5 x 3 = 15",
    videoUrl: "https://www.youtube.com/embed/qmfXyR7Z6Lk",
    videoPool: [
      "https://www.youtube.com/embed/qmfXyR7Z6Lk",
      "https://www.youtube.com/embed/sR83TDp_g2c",
      "https://www.youtube.com/embed/sR83TDp_g2c",
      "https://www.youtube.com/embed/3TklZi6MeJ4",
      "https://www.youtube.com/embed/5juto2ze8Lg",
    ],
    visual: "fractions",
    questions: [
      { prompt: "What is 3/4 of 20?", answer: "15", hint: "Divide 20 by 4 = 5, then 5 x 3 = 15." },
      { prompt: "What is 2/5 of 15?", answer: "6", hint: "Divide 15 by 5 = 3, then 3 x 2 = 6." },
      { prompt: "What is 4/5 of 25?", answer: "20", hint: "Divide 25 by 5 = 5, then 5 x 4 = 20." },
      { prompt: "A tank is 3/4 full with a capacity of 20 litres. How many litres are inside?", answer: "15", hint: "Calculate 3/4 of 20." },
      { prompt: "A class drinks 2/5 of a 10 litre container. How many litres is that?", answer: "4", hint: "Calculate 2/5 of 10." },
      { prompt: "What is 1/2 of 10?", answer: "5", hint: "Divide 10 by 2." },
      { prompt: "What is 1/3 of 12?", answer: "4", hint: "Divide 12 by 3." },
      { prompt: "Find 2/3 of 9", answer: "6", hint: "9 divided by 3 is 3, 3 times 2 is 6." },
      { prompt: "Find 3/5 of 10", answer: "6", hint: "10 divided by 5 is 2, 2 times 3 is 6." },
      { prompt: "Find 1/4 of 16", answer: "4", hint: "16 divided by 4." },
      { prompt: "Find 4/6 of 18", answer: "12", hint: "18 divided by 6 is 3, 3 times 4 is 12." },
      { prompt: "Find 1/8 of 24", answer: "3", hint: "24 divided by 8." },
      { prompt: "Find 2/7 of 21", answer: "6", hint: "21 divided by 7 is 3, 3 times 2 is 6." },
      { prompt: "Find 3/10 of 40", answer: "12", hint: "40 divided by 10 is 4, 4 times 3 is 12." },
      { prompt: "Find 5/6 of 12", answer: "10", hint: "12 divided by 6 is 2, 2 times 5 is 10." },
    ],
  },

  // Arithmetic Lessons
  "place-value-operations": {
    eyebrow: "Lesson 4.1 · Place Value & Operations",
    title: "Place Value & Operations",
    summary: "Understand units, tens, hundreds, thousands, rounding, and mental strategies.",
    idea: "Place value defines the size of each digit. Break numbers into expanded form to compute easily.",
    example: "735 + 268 = (700+200) + (30+60) + (5+8) = 1003",
    videoUrl: "https://www.youtube.com/embed/T5Qf0qSSJFI",
    videoPool: [
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
    ],
    visual: "arithmetic",
    questions: [
      { prompt: "Calculate 735 + 268", answer: "1003", hint: "Add hundreds, tens, and ones." },
      { prompt: "Calculate 900 - 457", answer: "443", hint: "Subtract carefully from hundreds." },
      { prompt: "What is 15% of 200?", answer: "30", hint: "10% is 20 and 5% is 10." },
      { prompt: "Round 3,647 to the nearest hundred.", answer: "3600", hint: "Tens digit is 4, round down." },
      { prompt: "You have $50 and spend $18. How much remains?", answer: "32", hint: "Subtract 18 from 50." },
      { prompt: "Calculate 500 + 450", answer: "950", hint: "Sum them up." },
      { prompt: "Round 129 to the nearest ten.", answer: "130", hint: "9 rounds up." },
      { prompt: "Subtract 75 from 200.", answer: "125", hint: "200 - 75." },
      { prompt: "10% of 500?", answer: "50", hint: "Divide by 10." },
      { prompt: "Round 950 to nearest hundred.", answer: "1000", hint: "5 rounds up." },
      { prompt: "Calculate 88 + 12", answer: "100", hint: "Sum them." },
      { prompt: "1000 - 300", answer: "700", hint: "Simple subtraction." },
      { prompt: "Round 44 to nearest ten.", answer: "40", hint: "4 rounds down." },
      { prompt: "10% of 80?", answer: "8", hint: "Divide by 10." },
      { prompt: "Calculate 150 + 250", answer: "400", hint: "Sum them." },
    ],
  },
  "multiplication-division": {
    eyebrow: "Lesson 4.2 · Multiplication & Long Division",
    title: "Multiplication & Long Division",
    summary: "Solve multi-digit multiplication and long division calculations with confidence.",
    idea: "Use expanded multiplication and equal group sharing for division.",
    example: "48 x 6 = (40 x 6) + (8 x 6) = 240 + 48 = 288",
    videoUrl: "https://www.youtube.com/embed/T5Qf0qSSJFI",
    videoPool: [
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
      "https://www.youtube.com/embed/T5Qf0qSSJFI",
    ],
    visual: "arithmetic",
    questions: [
      { prompt: "Calculate 48 x 6", answer: "288", hint: "40 x 6 = 240; 8 x 6 = 48." },
      { prompt: "A shop has 7 boxes with 24 pencils each. How many total pencils?", answer: "168", hint: "Multiply 24 by 7." },
      { prompt: "A bus carries 48 students in 6 equal rows. How many students per row?", answer: "8", hint: "Divide 48 by 6." },
      { prompt: "A farmer packs 96 apples equally into 8 bags. How many per bag?", answer: "12", hint: "Divide 96 by 8." },
      { prompt: "A runner completes 4 laps of 400 m each. How many total metres?", answer: "1600", hint: "Multiply 4 by 400." },
      { prompt: "Calculate 12 x 12", answer: "144", hint: "Classic times table." },
      { prompt: "Divide 100 by 5", answer: "20", hint: "100 / 5." },
      { prompt: "Multiply 15 x 4", answer: "60", hint: "15 x 2 x 2." },
      { prompt: "Divide 81 by 9", answer: "9", hint: "9 x 9 = 81." },
      { prompt: "Multiply 25 x 3", answer: "75", hint: "25 + 25 + 25." },
      { prompt: "Divide 120 by 6", answer: "20", hint: "12 / 6 = 2." },
      { prompt: "Multiply 11 x 11", answer: "121", hint: "Square of 11." },
      { prompt: "Divide 200 by 4", answer: "50", hint: "Half of 100." },
      { prompt: "Multiply 7 x 8", answer: "56", hint: "Times table." },
      { prompt: "Divide 45 by 5", answer: "9", hint: "5 x 9 = 45." },
    ],
  },
  "factors-multiples-gcf-lcm": {
    eyebrow: "Lesson 4.3 · Factors, Multiples & GCF/LCM",
    title: "Factors, Multiples & GCF/LCM",
    summary: "Master Prime Factors, Greatest Common Factor (GCF), and Least Common Multiple (LCM).",
    idea: "GCF is the largest factor two numbers share. LCM is the smallest common multiple.",
    example: "GCF of 24 and 36  ->  Factors of 24 (1,2,3,4,6,8,12,24); Factors of 36 (1,2,3,4,6,9,12,18,36) -> GCF = 12",
    videoUrl: "https://www.youtube.com/embed/jFd-6EPfnec",
    videoPool: [
      "https://www.youtube.com/embed/jFd-6EPfnec",
      "https://www.youtube.com/embed/jFd-6EPfnec",
      "https://www.youtube.com/embed/jFd-6EPfnec",
      "https://www.youtube.com/embed/jFd-6EPfnec",
      "https://www.youtube.com/embed/jFd-6EPfnec",
    ],
    visual: "arithmetic",
    questions: [
      { prompt: "Find the greatest common factor (GCF) of 24 and 36", answer: "12", hint: "List factors of 24 and 36." },
      { prompt: "What is the least common multiple (LCM) of 4 and 6?", answer: "12", hint: "Multiples of 4: 4,8,12; Multiples of 6: 6,12." },
      { prompt: "What is the next multiple of 9 after 54?", answer: "63", hint: "Add 9 to 54." },
      { prompt: "Find the GCF of 15 and 25", answer: "5", hint: "The largest number that divides both is 5." },
      { prompt: "What is the LCM of 3 and 5?", answer: "15", hint: "3 x 5 = 15." },
      { prompt: "GCF of 10 and 20?", answer: "10", hint: "10 divides both." },
      { prompt: "LCM of 2 and 3?", answer: "6", hint: "2 x 3 = 6." },
      { prompt: "Is 7 a prime number?", answer: "Yes", hint: "Only divisible by 1 and 7." },
      { prompt: "GCF of 8 and 12?", answer: "4", hint: "4 is the biggest common." },
      { prompt: "LCM of 5 and 10?", answer: "10", hint: "10 is a multiple of 5." },
      { prompt: "GCF of 14 and 21?", answer: "7", hint: "7 x 2 and 7 x 3." },
      { prompt: "LCM of 4 and 8?", answer: "8", hint: "8 is a multiple of 4." },
      { prompt: "Is 9 prime?", answer: "No", hint: "3 x 3 = 9." },
      { prompt: "GCF of 12 and 18?", answer: "6", hint: "6 divides both." },
      { prompt: "LCM of 3 and 4?", answer: "12", hint: "3 x 4 = 12." },
    ],
  },
  "statistics-data-basics": {
    eyebrow: "Statistics · Data Basics",
    title: "Statistics Data Basics",
    summary: "Read tables, charts, and data displays to understand what the numbers are saying.",
    idea: "Statistics helps us collect, organize, compare, and communicate information from data.",
    example: "Total frequency = add every category; range = largest value - smallest value",
    videoUrl: "https://www.youtube.com/embed/qBigTkBLU6g",
    videoPool: ["https://www.youtube.com/embed/qBigTkBLU6g"],
    visual: "statistics",
    questions: [
      { prompt: "Find the range of 4, 9, 12, 7, and 6.", answer: "8", hint: "Subtract the smallest value from the largest." },
    ],
  },
};

const topicGuideKeys = {
  algebra: ["variables-expressions", "one-step-equations", "two-step-equations"],
  geometry: ["angles-lines", "area-perimeter", "circles-pythagoras"],
  fraction: ["equivalent-simplification", "adding-subtracting", "multiplying-dividing"],
  arithmetic: ["place-value-operations", "multiplication-division", "factors-multiples-gcf-lcm"],
  statistics: ["statistics-data-basics", "statistics-averages-spread", "statistics-probability-charts"],
};

function getLessonGuide(topicTitle = "", lessonTitle = "", lessonOrder = 1) {
  const normTitle = String(lessonTitle || "").toLowerCase();
  const normTopic = String(topicTitle || "").toLowerCase();

  // ── Match by lesson title keywords ──────────────────────────────────────────
  if (normTitle.includes("variable") || normTitle.includes("expression")) return lessonGuides["variables-expressions"];
  if (normTitle.includes("one-step") || normTitle.includes("one step")) return lessonGuides["one-step-equations"];
  if (normTitle.includes("two-step") || normTitle.includes("two step") || normTitle.includes("bracket")) return lessonGuides["two-step-equations"];
  if (normTitle.includes("angle") || normTitle.includes("parallel")) return lessonGuides["angles-lines"];
  if (normTitle.includes("area") || normTitle.includes("perimeter")) return lessonGuides["area-perimeter"];
  if (normTitle.includes("circle") || normTitle.includes("pythagora")) return lessonGuides["circles-pythagoras"];
  if (normTitle.includes("equivalent") || normTitle.includes("simplif")) return lessonGuides["equivalent-simplification"];
  if (normTitle.includes("adding") || normTitle.includes("subtracting")) return lessonGuides["adding-subtracting"];
  // "Multiplication & Long Division" must come before the generic "multipl" check
  if (normTitle.includes("long division")) return lessonGuides["multiplication-division"];
  if (normTitle.includes("multipl") && normTitle.includes("divis")) return lessonGuides["multiplication-division"];
  if (normTitle.includes("multipl") || normTitle.includes("divid") || normTitle.includes("reciprocal")) return lessonGuides["multiplying-dividing"];
  if (normTitle.includes("place value") || normTitle.includes("operation")) return lessonGuides["place-value-operations"];
  if (normTitle.includes("factor") || normTitle.includes("multiple") || normTitle.includes("gcf") || normTitle.includes("lcm")) return lessonGuides["factors-multiples-gcf-lcm"];
  if (normTitle.includes("data") || normTitle.includes("average") || normTitle.includes("spread") || normTitle.includes("probability") || normTitle.includes("chart")) {
    return lessonGuides["statistics-data-basics"];
  }

  // ── Direct slug key fallback ─────────────────────────────────────────────────
  if (lessonGuides[normTitle]) return lessonGuides[normTitle];

  // Generic database lesson names use their position in the roadmap stage.
  const topicKey = Object.keys(topicGuideKeys).find((key) => normTopic.includes(key));
  const guideKeys = topicGuideKeys[topicKey];
  const guideIndex = Math.max(Number(lessonOrder || 1) - 1, 0);
  if (guideKeys?.[guideIndex]) return lessonGuides[guideKeys[guideIndex]];

  // ── Topic-level fallback (when no specific lesson is selected) ──────────────
  if (normTopic.includes("algebra")) return lessonGuides["variables-expressions"];
  if (normTopic.includes("geometry")) return lessonGuides["angles-lines"];
  if (normTopic.includes("fraction")) return lessonGuides["equivalent-simplification"];
  if (normTopic.includes("arithmetic")) return lessonGuides["place-value-operations"];
  if (normTopic.includes("statistic")) return lessonGuides["statistics-data-basics"];

  return lessonGuides["variables-expressions"];
}

function MathVisual({ type }) {
  if (type === "geometry") {
    return (
      <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-sky-500/10">
        <motion.div
          className="h-32 w-44 border-4 border-sky-300 bg-sky-300/10"
          animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="absolute bottom-5 rounded-full bg-sky-300/15 px-3 py-1 text-xs font-semibold text-sky-200">length x width</span>
      </div>
    );
  }

  if (type === "fractions") {
    return (
      <div className="flex h-52 items-center justify-center rounded-2xl bg-amber-400/10">
        <div className="grid w-56 grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((part) => (
            <motion.div
              key={part}
              className={`h-20 rounded-lg border-2 border-amber-200/60 ${part < 3 ? "bg-amber-300" : "bg-amber-300/10"}`}
              animate={{ opacity: part < 3 ? [0.55, 1, 0.55] : 0.4 }}
              transition={{ duration: 2, delay: part * 0.15, repeat: Infinity }}
            />
          ))}
          <p className="col-span-4 text-center text-sm font-semibold text-amber-100">3 of 4 parts = 3/4</p>
        </div>
      </div>
    );
  }

  if (type === "statistics") {
    return (
      <div className="flex h-52 items-end justify-center gap-3 rounded-2xl bg-cyan-500/10 px-10 pb-8">
        {[40, 70, 55, 90, 62].map((height, index) => (
          <motion.div
            key={index}
            className="w-8 rounded-t-lg bg-cyan-300/80"
            initial={{ height: 0 }}
            animate={{ height: `${height}px` }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-52 items-center justify-center rounded-2xl bg-emerald-500/10">
      <motion.div
        className="grid grid-cols-3 gap-3"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {[8, 4, 8, 2, 6, 4].map((number, index) => <span key={index} className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-300/20 text-sm font-bold text-emerald-100">{number}</span>)}
      </motion.div>
    </div>
  );
}

function ExplanationVisual({ question, topicType, step }) {
  const visualCopy = {
    algebra: ["Read the equation", "Name the unknown", "Undo the constant", "Undo the multiplier", `Answer: ${question.answer}`],
    geometry: ["Identify the shape", "List the measurements", "Choose the formula", "Substitute the values", `Answer: ${question.answer} units`],
    fractions: ["Name the whole", "Split into equal parts", "Find a common denominator", "Combine matching parts", `Answer: ${question.answer}`],
    arithmetic: ["Read the numbers", "Break them into parts", "Calculate each part", "Combine the parts", `Answer: ${question.answer}`],
  }[topicType] || ["Read the problem", "Name what you know", "Choose a useful rule", "Work step by step", `Answer: ${question.answer}`];

  return (
    <div className="relative flex min-h-52 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 p-4">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        <span className="flex items-center gap-2"><motion.span className="h-1.5 w-1.5 rounded-full bg-emerald-300" animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.2, repeat: Infinity }} /> Playing explanation</span>
        <span>Step {step + 1} / {visualCopy.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${topicType}-${step}`} className="flex flex-1 flex-col items-center justify-center text-center" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14, scale: 0.96 }} transition={{ duration: 0.35 }}>
          {topicType === "fractions" && (
            <div className="mb-4 flex w-52 gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((part) => <motion.span key={part} className={`h-9 flex-1 rounded-md border ${part <= step + 2 ? "border-amber-200/70 bg-amber-300" : "border-amber-200/20 bg-amber-300/10"}`} animate={{ opacity: part <= step + 2 ? [0.65, 1, 0.65] : 0.45 }} transition={{ duration: 1.5, repeat: Infinity, delay: part * 0.08 }} />)}
            </div>
          )}
          {topicType === "geometry" && <motion.div className="mb-4 h-20 w-36 border-4 border-sky-300 bg-sky-300/10" animate={{ rotate: step === 1 ? [0, 3, 0] : 0, scale: step === 2 ? [1, 1.08, 1] : 1 }} transition={{ duration: 0.8 }} />}
          {topicType === "arithmetic" && <div className="mb-4 flex items-center gap-2 text-xl font-black text-emerald-200"><motion.span animate={{ x: step === 0 ? [-4, 4, 0] : 0 }}>48</motion.span><span className="text-emerald-400">x</span><span>6</span></div>}
          {topicType === "algebra" && <motion.div className="mb-4 max-w-full truncate font-mono text-lg font-bold text-indigo-100" animate={{ y: step === 1 ? [3, -3, 0] : 0 }}>{question.prompt}</motion.div>}
          <p className="text-sm font-bold text-white">{visualCopy[step]}</p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">{step === 0 ? question.prompt : step === visualCopy.length - 1 ? `Correct answer: ${question.answer}` : question.hint}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-1.5" aria-hidden="true">
        {visualCopy.map((_, dot) => <span key={dot} className={`h-1.5 rounded-full transition-all ${dot === step ? "w-6 bg-emerald-300" : "w-1.5 bg-white/20"}`} />)}
      </div>
    </div>
  );
}

function QuestionAnimation({ question, questionIndex, topicType }) {
  const [showSolution, setShowSolution] = useState(false);
  const [visualStep, setVisualStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setVisualStep((step) => (step + 1) % 5), 2200);
    return () => clearInterval(timer);
  }, [questionIndex]);

  const visualStyles = {
    algebra: { label: "Balance both sides", visualClass: "border-indigo-300/70 bg-indigo-300/15", steps: ["Read the equation", "Name the unknown", "Undo the constant", "Undo the multiplier", "Check your result"] },
    geometry: { label: "Measure the shape", visualClass: "border-sky-300/70 bg-sky-300/15", steps: ["Identify the shape", "List the measurements", "Choose the formula", "Substitute the values", "Check the units"] },
    fractions: { label: "Make equal parts", visualClass: "border-amber-300/70 bg-amber-300/15", steps: ["Name the whole", "Split into equal parts", "Find a common denominator", "Combine matching parts", "Simplify your result"] },
    arithmetic: { label: "Break numbers apart", visualClass: "border-emerald-300/70 bg-emerald-300/15", steps: ["Read the numbers", "Break them into parts", "Calculate each part", "Combine the parts", "Estimate to check"] },
  }[topicType] || { label: "Think in steps", visualClass: "border-indigo-300/70 bg-indigo-300/15", steps: ["Read the problem", "Name what you know", "Choose a useful rule", "Work step by step", "Check your result"] };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <motion.span className="h-2 w-2 rounded-full bg-rose-400" animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
          Animated hint class
        </div>
        <span className="text-xs text-slate-500">Question {questionIndex + 1}</span>
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={questionIndex}
          className="grid gap-5 p-5 md:grid-cols-[0.9fr_1.1fr] md:items-center"
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <ExplanationVisual question={question} topicType={topicType} step={visualStep} />

          <div>
            <p className="text-sm leading-6 text-slate-300">{question.prompt}</p>
            <div className="mt-4 space-y-2">
              {visualStyles.steps.map((step, index) => (
                <motion.div key={step} className="flex items-center gap-3 text-xs text-slate-400" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + index * 0.2, duration: 0.35 }}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-bold text-slate-200">{index + 1}</span>
                  {step}
                </motion.div>
              ))}
            </div>
            <button type="button" onClick={() => setShowSolution((visible) => !visible)} className="mt-5 rounded-lg border border-emerald-300/30 px-3 py-2 text-xs font-bold text-emerald-200 transition hover:bg-emerald-300/10">
              {showSolution ? "Hide solution hint" : "Show solution hint"}
            </button>
            {showSolution && <motion.p className="mt-3 rounded-lg bg-emerald-300/10 p-3 text-xs leading-5 text-emerald-100" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>{question.hint} Answer: {question.answer}</motion.p>}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TopicDetails() {
  const { topicId, lessonId: routeLessonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLessonId = routeLessonId || searchParams.get("lessonId") || "";

  const { updateUser } = useAuth();
  const [topic, setTopic] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonQuestions, setLessonQuestions] = useState([]);
  const [lessonQuestionLessonId, setLessonQuestionLessonId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [practiceLevel, setPracticeLevel] = useState("Beginner");
  const [answer, setAnswer] = useState("");
  const [answerState, setAnswerState] = useState("");
  const [showVisualExplanation, setShowVisualExplanation] = useState(false);
  const [topicAttempts, setTopicAttempts] = useState([]);
  const [topicCorrect, setTopicCorrect] = useState([]);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const [topicsResponse, lessonsResponse, topicProgressResponse] = await Promise.all([
          api.get("/topics"),
          api.get(`/lessons?topicId=${topicId}`).catch(() => ({ data: { lessons: [] } })),
          api.get(`/progress/${topicId}`).catch(() => ({ data: { progress: {} } })),
        ]);
        const selectedTopic = (topicsResponse.data.topics || []).find(
          (item) => item._id === topicId || item.title.toLowerCase().includes(topicId.toLowerCase())
        ) || { _id: topicId, title: topicId, icon: "📚", description: "Mathematics practice and interactive lessons." };

        setTopic(selectedTopic);
        setLessons(lessonsResponse.data.lessons || []);

        const progress = topicProgressResponse.data.progress || {};
        setTopicAttempts(progress.attemptedQuestions || []);
        setTopicCorrect(progress.correctQuestions || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load this topic.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [topicId]);

  const currentTopicLessons = useMemo(() => {
    const currentTopicId = String(topicId || "");

    return lessons.filter((lesson) => {
      const lessonTopicId = typeof lesson.topic === "string" ? lesson.topic : lesson.topic?._id;
      return !currentTopicId || String(lessonTopicId || "") === currentTopicId || String(lesson.topic?._id || lesson.topic || "") === currentTopicId;
    });
  }, [lessons, topicId]);

  // Find the active lesson object by its ID, then resolve the guide by title
  const activeLessonObject = useMemo(
    () => currentTopicLessons.find((l) => (l._id || l.id) === activeLessonId) || currentTopicLessons[0] || null,
    [currentTopicLessons, activeLessonId]
  );

  const activeLessonOrder = useMemo(() => {
    const lessonIndex = currentTopicLessons.findIndex(
      (lesson) => (lesson._id || lesson.id) === (activeLessonObject?._id || activeLessonObject?.id)
    );
    return activeLessonObject?.order > 0 ? activeLessonObject.order : lessonIndex + 1;
  }, [currentTopicLessons, activeLessonObject]);

  useEffect(() => {
    const lessonId = activeLessonObject?._id || activeLessonObject?.id;
    if (!lessonId || String(lessonId).startsWith("temp-")) return undefined;

    let cancelled = false;
    api.get(`/quizzes/lessons/${lessonId}/questions`)
      .then((response) => {
        if (!cancelled) {
          setLessonQuestions(response.data.questions || []);
          setLessonQuestionLessonId(String(lessonId));
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [activeLessonObject]);

  // Resolve current active lesson guide & questions using lesson title (not MongoDB ID)
  const guide = useMemo(
    () => getLessonGuide(topic?.title, activeLessonObject?.title || "", activeLessonOrder),
    [topic?.title, activeLessonObject?.title, activeLessonOrder]
  );

  const lessonVideoUrl = activeLessonObject?.videoUrl || guide.videoUrl;

  const activeLessonKey = String(activeLessonObject?._id || activeLessonObject?.id || "");
  const allQuestionBank = lessonQuestionLessonId === activeLessonKey && lessonQuestions.length > 0
    ? lessonQuestions
    : guide.questions.map((question, index) => ({
      ...question,
      questionIndex: index,
      difficulty: index < 15 ? "Beginner" : index < 30 ? "Intermediate" : "Hard",
    }));
  const questionBank = allQuestionBank.filter((question) => (question.difficulty || "Beginner") === practiceLevel);
  const currentQuestion = questionBank[questionIndex] || questionBank[0];
  const levelQuestionIndexes = new Set(questionBank.map((question) => question.questionIndex));
  const levelAttempts = topicAttempts.filter((index) => levelQuestionIndexes.has(index));
  const levelCorrect = topicCorrect.filter((index) => levelQuestionIndexes.has(index));

  const progressPercentage = questionBank.length > 0
    ? Math.round((levelCorrect.length / questionBank.length) * 100)
    : 0;

  const questionLearningPath = [
    `Read question ${questionIndex + 1}: identify what it asks`,
    `Use the hint: ${currentQuestion.hint}`,
    "Work through the calculation step by step",
    "Check your answer against the question",
  ];

  const checkAnswer = async () => {
    const normalise = (value) => value.trim().toLowerCase().replace(/\s+/g, "");
    const isCorrect = normalise(answer) === normalise(currentQuestion.answer);
    setSavingProgress(true);
    setAnswerState("saving");

    try {
      const response = await api.post(`/progress/${topicId}/questions`, {
        questionIndex: currentQuestion.questionIndex,
        isCorrect,
      });
      if (response.data.user) {
        updateUser(response.data.user);
      }
      const progress = response.data.progress || {};
      setTopicAttempts(progress.attemptedQuestions || []);
      setTopicCorrect(progress.correctQuestions || []);
      setAnswerState(response.data.alreadyAttempted ? "already-attempted" : isCorrect ? "correct" : "try-again");
    } catch (requestError) {
      console.error("SAVE PROGRESS ERROR:", requestError);
      setAnswerState("save-error");
    } finally {
      setSavingProgress(false);
    }
  };

  const nextQuestion = () => {
    setQuestionIndex((index) => (index + 1) % questionBank.length);
    setAnswer("");
    setAnswerState("");
    setShowVisualExplanation(false);
  };

  const previousQuestion = () => {
    setQuestionIndex((index) => Math.max(index - 1, 0));
    setAnswer("");
    setAnswerState("");
    setShowVisualExplanation(false);
  };

  const changePracticeLevel = (level) => {
    setPracticeLevel(level);
    setQuestionIndex(0);
    setAnswer("");
    setAnswerState("");
    setShowVisualExplanation(false);
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Loading your lesson...</div>;
  if (error || !topic) return <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-red-300">{error || "Topic not found."}</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <Link to="/dashboard" className="shrink-0 text-xl font-black sm:text-2xl">MathMind<span className="text-indigo-400"> AI</span></Link>
          <div className="flex items-center gap-3">
            <Link to="/lessons" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10">
              <BookOpen size={15} /> All Route Lessons
            </Link>
            <Link to="/dashboard" className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs transition hover:bg-white/10 sm:px-4 sm:text-sm">
              <ArrowLeft size={16} /> <span className="hidden xs:inline sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <Sparkles size={14} />
            {guide.eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">{topic.icon} {guide.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-400">{guide.summary}</p>
        </header>

        {/* Lesson Selector Switcher */}
        {currentTopicLessons.length > 0 && (
          <div className="reveal-on-scroll mt-6 flex flex-wrap items-center gap-2 border-b border-white/10 pb-5 sm:mt-8">
            <span className="mr-2 w-full text-xs font-bold uppercase tracking-wider text-slate-400 sm:w-auto">
              Select Lesson Practice:
            </span>
            {currentTopicLessons.map((l, idx) => {
              const lessonKey = l._id || l.id;
              const isSelected = activeLessonId === lessonKey || (!activeLessonId && idx === 0);

              return (
                <button
                  key={lessonKey}
                  type="button"
                  onClick={() => {
                    setSearchParams({ lessonId: lessonKey });
                    setQuestionIndex(0);
                    setAnswer("");
                    setAnswerState("");
                  }}
                    className={`motion-button min-w-0 flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-center text-xs font-semibold transition sm:flex-none sm:px-4 sm:text-sm ${
                    isSelected
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40"
                      : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <CheckCircle2 size={14} className={isSelected ? "text-white" : "text-slate-500"} />
                  <span className="truncate">Lesson {idx + 1}: {l.title}</span>
                </button>
              );
            })}
          </div>
        )}

        <section className={`reveal-on-scroll mt-6 sm:mt-8 ${guide.visual === "algebra" ? "hidden" : ""}`}>
          {guide.visual !== "algebra" && <MathVisual type={guide.visual} />}
        </section>

        <section className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-300">Understand first</p>
            <h2 className="mt-2 text-2xl font-black">Targeted Lesson Strategy</h2>
            <p className="mt-4 leading-7 text-slate-300">This question asks: {currentQuestion.prompt}</p>
            <div className="mt-5 rounded-2xl border border-indigo-400/15 bg-indigo-400/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Remember</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{currentQuestion.hint}</p>
            </div>
            <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-slate-500">Lesson step-by-step path</h3>
            <div className="mt-6 space-y-4">{questionLearningPath.map((stepItem, index) => <div key={stepItem} className="flex items-center gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-bold text-indigo-300">{index + 1}</span><span className="text-slate-200">{stepItem}</span></div>)}</div>
          </div>
          <div className="motion-surface reveal-on-scroll rounded-3xl border border-amber-300/15 bg-amber-300/5 p-4 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-bold uppercase tracking-wider text-amber-300">Lesson Practice</p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-indigo-300/15 px-3 py-1.5 text-indigo-200">Progress: {progressPercentage}%</span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-slate-300">Attempted: {levelAttempts.length}/{questionBank.length}</span>
                <span className="rounded-full bg-emerald-300/15 px-3 py-1.5 text-emerald-200">Correct: {levelCorrect.length}/{questionBank.length}</span>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Choose your practice level</p>
                  <p className="mt-1 text-xs text-slate-500">Recommended: start with Beginner, then progress to real-world challenges.</p>
                </div>
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-200">{questionBank.length} questions</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[{
                  key: "Beginner",
                  description: "Build the core skill",
                  classes: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
                }, {
                  key: "Intermediate",
                  description: "Apply it in guided problems",
                  classes: "border-sky-300/30 bg-sky-300/10 text-sky-200",
                }, {
                  key: "Hard",
                  description: "Stretch with real decisions",
                  classes: "border-rose-300/30 bg-rose-300/10 text-rose-200",
                }].map((level) => (
                  <button
                    key={level.key}
                    type="button"
                    onClick={() => changePracticeLevel(level.key)}
                    className={`motion-button rounded-xl border px-3 py-3 text-left transition ${level.classes} ${practiceLevel === level.key ? "ring-2 ring-white/60" : "opacity-65 hover:opacity-100"}`}
                  >
                    <span className="block text-sm font-bold">{level.key}</span>
                    <span className="mt-1 block text-xs opacity-80">{level.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-black">{guide.title} Practice Box</h2>
            <p className="mt-4 text-sm font-bold uppercase tracking-wider text-amber-300">Question {questionIndex + 1} of {questionBank.length}</p>
            <p className="mt-4 min-h-14 leading-7 text-slate-200">{currentQuestion.prompt}</p>
            <label className="mt-5 block text-sm font-semibold text-slate-300" htmlFor="practice-answer">Your answer</label>
            <input id="practice-answer" value={answer} disabled={savingProgress} onChange={(event) => { setAnswer(event.target.value); setAnswerState(""); }} onKeyDown={(event) => event.key === "Enter" && checkAnswer()} placeholder="Type your answer" className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-300/70 disabled:cursor-wait disabled:opacity-60" />
            {answerState === "saving" && <p className="mt-3 text-sm font-semibold text-sky-200">Saving your answer...</p>}
            {answerState === "correct" && <p className="mt-3 text-sm font-semibold text-emerald-300">Correct! Your progress is saved.</p>}
            {answerState === "try-again" && <p className="mt-3 text-sm font-semibold text-amber-200">Not quite. Your attempt is saved. Hint: {currentQuestion.hint}</p>}
            {answerState === "already-attempted" && <p className="mt-3 text-sm font-semibold text-sky-200">This question was already counted. Repeating it does not change XP or daily progress.</p>}
            {answerState === "save-error" && <p className="mt-3 text-sm font-semibold text-red-300">Could not save this answer. Please try again.</p>}
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap"><button type="button" disabled={savingProgress} onClick={checkAnswer} className="motion-button w-full rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-wait disabled:opacity-60 sm:w-auto">{savingProgress ? "Saving..." : "Check answer"}</button><button type="button" disabled={questionIndex === 0 || savingProgress} onClick={previousQuestion} className="motion-button w-full rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">Previous question</button><button type="button" disabled={savingProgress} onClick={nextQuestion} className="motion-button w-full rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">Next question</button></div>
          </div>
        </section>

        <section className="reveal-on-scroll mt-8">
          {/* Section header */}
          <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Watch and learn</p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">Lesson Video</h2>
              <p className="mt-1 text-xs text-slate-500">
                Topic lesson video · {activeLessonObject?.title || guide.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowVisualExplanation((visible) => !visible)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-indigo-300/25 bg-indigo-300/10 px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:border-indigo-300/50 hover:bg-indigo-300/20 sm:w-auto sm:px-4 sm:text-sm"
            >
              <PlayCircle size={16} /> {showVisualExplanation ? "Hide explanation" : "Visual explanation"}
            </button>
          </div>

          {/* Video player — swaps on question group change */}
          <AnimatePresence mode="wait">
            <motion.article
              key={`video-${activeLessonKey}`}
              className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Video number pill */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {guide.title}
                  </span>
                </div>
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                  Topic lesson video
                </span>
              </div>

              <VideoPlayer
                videoUrl={lessonVideoUrl}
                title={`${activeLessonObject?.title || guide.title} lesson`}
              />

              <div className="p-5">
                <h3 className="text-lg font-bold">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{guide.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock3 size={14} /> 10-15 min lesson
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          {showVisualExplanation && (
            <div className="mt-6">
              <QuestionAnimation
                key={`lesson-${topicId}-${activeLessonId}-${questionIndex}`}
                question={currentQuestion}
                questionIndex={questionIndex}
                topicType={guide.visual}
              />
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default TopicDetails;
