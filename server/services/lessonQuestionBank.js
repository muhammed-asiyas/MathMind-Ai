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
  "statistics-data-basics": [
    ["A class records 12, 15, 9, and 14 books read. What is the total?", "50", "Add all the data values."],
    ["Which value is greatest in 8, 13, 6, 11, 9?", "13", "Compare the data values."],
    ["A chart shows Monday 18 visitors and Tuesday 25 visitors. How many more visited Tuesday?", "7", "Subtract Monday from Tuesday."],
    ["Find the range of 4, 9, 12, 7, and 6.", "8", "Subtract the smallest value from the largest."],
    ["A table has 6 red, 9 blue, and 5 green counters. How many counters are there?", "20", "Add the category frequencies."],
  ],
  "statistics-averages-spread": [
    ["Find the mean of 6, 8, 10, and 12.", "9", "Add the values and divide by 4."],
    ["Find the median of 3, 8, 5, 10, and 7.", "7", "Order the values and choose the middle one."],
    ["Find the mode of 4, 6, 4, 8, 9, 4.", "4", "The mode appears most often."],
    ["Find the range of 18, 12, 25, 20, and 14.", "13", "Subtract 12 from 25."],
    ["The mean of 5 numbers is 12. What is their total?", "60", "Multiply the mean by the number of values."],
  ],
  "statistics-probability-charts": [
    ["A bag has 3 red and 7 blue counters. What is the probability of red?", "3/10", "Favourable outcomes divided by total outcomes."],
    ["A fair coin is tossed once. What is the probability of heads?", "1/2", "There are two equally likely outcomes."],
    ["A spinner has 4 equal sections numbered 1 to 4. Probability of landing on 3?", "1/4", "One favourable section out of four."],
    ["A survey asks 20 students and 15 choose football. What fraction choose football?", "3/4", "Write 15/20 in simplest form."],
    ["A chart has frequencies 5, 8, 4, and 3. What is the total sample size?", "20", "Add the frequencies."],
  ],
};

const hardQuestionBanks = {
  "variables-expressions": [
    ["A phone plan costs 18 dollars plus 7 dollars per gigabyte. What is the cost for 6 gigabytes after a 10 dollar discount?", "50", "Calculate 18 + (7 x 6) - 10."],
    ["The perimeter of a rectangle is 54 cm. Its length is 3 cm more than twice its width. Find the width.", "8", "Use 2(2w + 3 + w) = 54."],
    ["A school buys x calculators at 12 dollars each and pays a 35 dollar delivery fee. The total is 227 dollars. Find x.", "16", "Solve 12x + 35 = 227."],
    ["A number is doubled, then 9 is subtracted. The result is 31. What was the number?", "20", "Translate the situation into 2x - 9 = 31."],
    ["A recipe uses 3/4 cup of flour per batch plus 1/2 cup extra. How much flour is needed for 8 batches?", "6.5", "Calculate 8 x 3/4 + 1/2."],
    ["A savings account starts with 40 dollars and grows by 15 dollars each week. After how many weeks will it reach 250 dollars?", "14", "Solve 40 + 15w = 250."],
    ["The expression 5n - 12 represents a score. What is the score when n = 9, and what value of n gives a score of 48?", "33;12", "Evaluate first, then solve 5n - 12 = 48."],
    ["A rectangular garden has length x + 4 and width x. If its area is 60 square metres, find x.", "6", "Solve x(x + 4) = 60."],
    ["A class has y students. Three groups of 8 visitors join, making 42 people. Find y.", "18", "Solve y + 3 x 8 = 42."],
    ["A worker earns 16 dollars per hour and a 25 dollar bonus. How many hours are needed to earn 185 dollars?", "10", "Solve 16h + 25 = 185."],
    ["A tank contains 5 litres and fills at 2.5 litres per minute. How much is in the tank after 7 minutes?", "22.5", "Calculate 5 + 2.5 x 7."],
    ["A number divided by 4, then increased by 6, equals 15. Find the number.", "36", "Solve x/4 + 6 = 15."],
    ["A jacket is reduced by 20 dollars, then a 5 dollar fee is added. The final cost is 65 dollars. Find the original price.", "80", "Solve p - 20 + 5 = 65."],
    ["Three equal notebooks and a 4 dollar pen cost 31 dollars. What is the cost of one notebook?", "9", "Solve 3n + 4 = 31."],
    ["A number is multiplied by 4 and then reduced by 18 to give 46. Find the number.", "16", "Solve 4x - 18 = 46."],
  ],
  "one-step-equations": [
    ["A bill is split equally among 6 people. Each person pays 18 dollars. What was the total bill?", "108", "Solve b/6 = 18."],
    ["A temperature is 12 degrees below its normal value of 23 degrees. What is the temperature?", "11", "Solve t + 12 = 23."],
    ["A farmer puts the same number of apples into 9 boxes. There are 117 apples. How many per box?", "13", "Solve 9a = 117."],
    ["A train journey is 45 minutes shorter than a 2 hour planned journey. How long is it?", "75", "Convert 2 hours to 120 minutes, then subtract 45."],
    ["A bank balance becomes 64 dollars after a 15 dollar withdrawal. What was the starting balance?", "79", "Solve b - 15 = 64."],
    ["A rope is cut into 8 equal pieces of 2.75 metres. What was its original length?", "22", "Solve r/8 = 2.75."],
    ["A recipe needs 2/3 cup per serving. How many cups are needed for 9 servings?", "6", "Multiply 2/3 by 9."],
    ["After a 30 percent reduction, a price is 70 dollars. What was the original price?", "100", "70 percent of the original equals 70."],
    ["A cyclist travels 84 km in 4 equal hours. What is the average speed?", "21", "Solve 4s = 84."],
    ["A quiz score is 7 points below a target of 50. What is the score?", "43", "Solve s + 7 = 50."],
    ["A lift descends 18 floors from floor 5. Which floor does it reach?", "-13", "Solve f + 18 = 5."],
    ["A charity receives equal donations from 12 people totalling 396 dollars. What is each donation?", "33", "Divide 396 by 12."],
    ["A number multiplied by 7 is 154. Find the number.", "22", "Divide 154 by 7."],
    ["A water tank loses 28 litres and has 95 litres left. How much did it contain first?", "123", "Add the lost amount to the remaining amount."],
    ["A score is increased by 14 to become 63. What was the original score?", "49", "Subtract 14 from 63."],
  ],
  "two-step-equations": [
    ["A gym charges 24 dollars to join and 9 dollars per visit. After how many visits is the total 105 dollars?", "9", "Solve 24 + 9v = 105."],
    ["The perimeter of a rectangle is 70 cm. Its length is 5 cm more than its width. Find the width.", "15", "Use 2(w + 5 + w) = 70."],
    ["A taxi charges 6 dollars plus 2.5 dollars per kilometre. How far can you travel for 31 dollars?", "10", "Solve 6 + 2.5k = 31."],
    ["Three times a number plus 11 equals  fifty-six. Find the number.", "15", "Solve 3x + 11 = 56."],
    ["A book costs 4 dollars more than twice a notebook. Together they cost 34 dollars. Find the notebook price.", "10", "Solve n + (2n + 4) = 34."],
    ["A rectangle has area 96 square metres and width 8 metres. Find its length, then its perimeter.", "32", "Length is 96/8; perimeter is 2(12 + 8)."],
    ["A savings plan starts at 75 dollars and adds 12 dollars weekly. When will it pass 200 dollars?", "11", "Solve 75 + 12w > 200."],
    ["A number is divided by 3, then 7 is added to give 19. Find the number.", "36", "Solve x/3 + 7 = 19."],
    ["A school orders 5 packs of pens and pays 8 dollars delivery. The total is 63 dollars. What is each pack?", "11", "Solve 5p + 8 = 63."],
    ["The sum of two consecutive numbers is 57. Find the larger number.", "29", "Let the numbers be n and n + 1."],
    ["A number is four times another number. Their difference is 27. Find the smaller number.", "9", "Use 4x - x = 27."],
    ["A 20 percent discount and a 6 dollar delivery fee make a 46 dollar total price. What was the original 50 dollar item price?", "50", "Calculate 0.8 x 50 + 6."],
    ["A tank is 12 litres full and fills at 3 litres per minute. How long until it contains 57 litres?", "15", "Solve 12 + 3m = 57."],
    ["A rectangle is twice as long as it is wide and has perimeter 72 cm. Find its area.", "288", "Width is 12, length is 24, then multiply."],
    ["A number plus half of itself equals 48. Find the number.", "32", "Solve x + x/2 = 48."],
  ],
  "angles-lines": [
    ["A triangle has angles x, 2x, and 3x. Find the largest angle.", "90", "Six equal parts total 180 degrees."],
    ["The exterior angle of a triangle is 132 degrees. One opposite interior angle is 57 degrees. Find the other.", "75", "An exterior angle equals the two opposite interior angles."],
    ["Two parallel lines are cut by a transversal. Alternate interior angles are 3x + 10 and 5x - 30. Find x.", "20", "Set the equal angles equal."],
    ["A regular pentagon has five equal interior angles. Find each angle.", "108", "Interior angle sum is 540 degrees."],
    ["A quadrilateral has angles 85, 110, 75, and x. Find x.", "90", "Quadrilateral angles total 360 degrees."],
    ["Two angles on a straight line are in the ratio 2:7. Find the larger angle.", "140", "The ratio has 9 total parts making 180 degrees."],
    ["A triangle has angles x + 10, 2x, and 3x - 10. Find x.", "30", "Set their sum equal to 180 degrees."],
    ["A right angle is split into angles 2x + 5 and x + 10. Find the larger angle.", "65", "The two parts total 90 degrees."],
    ["Corresponding angles are 4x - 8 and 2x + 32. Find the angle size.", "72", "Corresponding angles are equal."],
    ["The angles of a triangle are in the ratio 2:3:4. Find the smallest angle.", "40", "The ratio has 9 total parts."],
    ["A regular hexagon has six equal interior angles. Find each angle.", "120", "Interior angle sum is 720 degrees."],
    ["An isosceles triangle has a vertex angle of 46 degrees. Find each base angle.", "67", "The two base angles are equal."],
    ["A full turn is split into angles 2x, 3x, 4x, and x. Find the largest angle.", "160", "The parts total 360 degrees."],
    ["A line crosses parallel lines. One acute angle is 68 degrees. Find the adjacent obtuse angle.", "112", "Adjacent angles on a line total 180 degrees."],
    ["A quadrilateral has angles x, x + 20, 2x, and 2x + 40. Find the largest angle.", "140", "The four angles total 360 degrees."],
  ],
  "area-perimeter": [
    ["A 12 m by 8 m garden has a 1 m path around the outside. Find the total area including the path.", "140", "The outer dimensions are 14 m by 10 m."],
    ["A rectangular room is 9 m by 6 m. Tiles cover 1.5 square metres each. How many tiles are needed?", "36", "Find the area, then divide by tile area."],
    ["A triangular sign has base 18 cm and area 126 square cm. Find its height.", "14", "Use area = base times height divided by 2."],
    ["A square field has area 225 square metres. Find its perimeter.", "60", "Find the side using the square root, then multiply by 4."],
    ["A parallelogram has area 154 square cm and base 14 cm. Find its height.", "11", "Height equals area divided by base."],
    ["A 20 m by 14 m rectangle has a 6 m by 4 m corner removed. Find the remaining area.", "256", "Subtract the missing rectangle area from the original."],
    ["A rectangular picture is 4 cm wider than it is high. Its perimeter is 44 cm. Find its area.", "120", "Solve 2(h + h + 4) = 44."],
    ["A path is built around a 10 m by 5 m pool, making the outside 14 m by 9 m. Find the path area.", "76", "Subtract the pool area from the outside area."],
    ["A triangle and rectangle have the same base of 12 cm. Their heights are 9 cm and 6 cm. Find the difference in areas.", "18", "Calculate both areas and subtract."],
    ["A square perimeter is equal to a rectangle with sides 12 m and 6 m. Find the square's area.", "81", "Find the shared perimeter, then the square side."],
    ["A circular garden is approximated by a rectangle 16 m by 10 m for fencing. How much fencing is needed?", "52", "Use the rectangle perimeter."],
    ["A floor is 7.5 m by 4 m. Each box covers 3 square metres. How many boxes are needed?", "10", "Divide total area by coverage and round up."],
    ["A trapezium has parallel sides 8 cm and 14 cm and height 6 cm. Find its area.", "66", "Use half the sum of parallel sides times height."],
    ["A 30 cm wire is bent into a rectangle with length twice its width. Find the area.", "50", "Solve 2(2w + w) = 30."],
    ["A playground is 18 m by 12 m. A 2 m wide strip is removed along one long side. Find the new area.", "180", "Subtract 18 x 2 from the original area."],
  ],
  "circles-pythagoras": [
    ["A 13 m ladder reaches 12 m up a wall. How far is its base from the wall?", "5", "Use 13 squared minus 12 squared."],
    ["A circular table has radius 7 m. Using pi = 3, find its area and circumference.", "147;42", "Use 3r squared for area and 6r for circumference."],
    ["A rectangle has diagonal 17 cm and width 8 cm. Find its length.", "15", "Use the Pythagorean theorem."],
    ["A 10 m by 24 m rectangular field is crossed diagonally. How far is the diagonal?", "26", "Use 10 squared plus 24 squared."],
    ["A wheel with radius 5 cm makes 12 complete turns. Using pi = 3, how far does it travel?", "360", "One turn is circumference 30 cm."],
    ["A circular pond has area 192 square metres using pi = 3. Find its radius.", "8", "Solve 3r squared = 192."],
    ["A right triangle has hypotenuse 25 and one leg 7. Find its area if the other leg is the height.", "84", "Find the missing leg, then use half base times height."],
    ["A square has diagonal 10 cm. Find its area to the nearest whole number.", "50", "The area of a square is half its diagonal squared."],
    ["A circular track has radius 10 m. Using pi = 3, how far is 4 laps?", "240", "One lap is 60 m."],
    ["A right triangle has legs x and x + 7, with hypotenuse 13. Find x.", "5", "Test the Pythagorean relationship or solve the equation."],
    ["A 15 m cable is anchored 9 m from a pole. How high up the pole does it reach?", "12", "Use 15 squared minus 9 squared."],
    ["A circular logo has diameter 12 cm. Using pi = 3, find its area.", "108", "Radius is 6 cm; use pi times radius squared."],
    ["A rectangle has sides 9 cm and 40 cm. Find its diagonal.", "41", "Use the Pythagorean theorem."],
    ["A circle's circumference is 72 cm using pi = 3. Find its radius.", "12", "Solve 6r = 72."],
    ["A triangular ramp has base 12 m and height 5 m. Find its sloping length.", "13", "Use the Pythagorean theorem."],
  ],
  "equivalent-simplification": [
    ["A recipe uses 18/24 kg of flour. Simplify the amount and convert it to a decimal.", "3/4;0.75", "Divide both terms by 6, then divide 3 by 4."],
    ["A class completes 42 of 56 tasks. What fraction is complete in simplest form?", "3/4", "Divide numerator and denominator by 14."],
    ["Write 7/12 as an equivalent fraction with denominator 60.", "35/60", "Multiply both terms by 5."],
    ["A tank is 24/36 full. Simplify the fraction and state the percentage.", "2/3;66.67%", "Simplify by 12, then convert to a percentage."],
    ["Which is larger: 5/8 or 7/12? Give the larger fraction.", "5/8", "Use a common denominator of 24."],
    ["Simplify 84/126.", "2/3", "Divide both terms by their greatest common factor, 42."],
    ["A discount is 15/20 of the original price. Express it in simplest form.", "3/4", "Divide numerator and denominator by 5."],
    ["Write 0.625 as a fraction in simplest form.", "5/8", "Write it over 1000, then simplify."],
    ["A runner completes 9/15 of a route. What fraction remains?", "2/5", "Subtract from 1, then simplify."],
    ["Find an equivalent fraction for 11/15 with denominator 90.", "66/90", "Multiply both terms by 6."],
    ["Simplify 45/75 and explain the common factor used.", "3/5", "Divide both by 15."],
    ["A score of 18/25 is what percentage?", "72%", "Convert the fraction to a percentage."],
    ["Order 2/3, 5/8, and 7/10 from smallest to largest. Give the first fraction.", "5/8", "Compare using a common denominator or decimals."],
    ["A 2.4 kg parcel is 3/5 of a full load. Find the full load.", "4", "Solve 3/5 of the load equals 2.4."],
    ["Simplify 96/144.", "2/3", "Divide by the greatest common factor, 48."],
  ],
  "adding-subtracting": [
    ["A tank is 3/4 full. After using 2/5 of the tank, what fraction remains?", "7/20", "Calculate 3/4 - 2/5 using denominator 20."],
    ["A recipe needs 2/3 cup and 5/8 cup of two ingredients. How much is that altogether?", "31/24", "Use denominator 24, then write as 1 7/24."],
    ["A runner completes 5/6 of a route on day one and 1/4 on day two of another route. What is the total fraction?", "13/12", "Use denominator 12."],
    ["A budget spends 7/10 on housing and 1/6 on food. What fraction remains?", "2/15", "Subtract the sum from 1."],
    ["Calculate 11/15 - 2/9.", "23/45", "Use the lowest common denominator 45."],
    ["A class reads 3/8 of a book Monday and 5/12 Tuesday. What fraction has been read?", "19/24", "Use denominator 24."],
    ["Calculate 7/9 - 5/12.", "13/36", "Use denominator 36 and simplify."],
    ["A baker has 5/6 kg flour and uses 3/10 kg. How much remains?", "8/15", "Use denominator 30."],
    ["Calculate 4/7 + 5/14 - 1/2.", "9/14", "Convert all terms to denominator 14."],
    ["A project is 2/5 complete, then another 3/8 is completed. What fraction remains?", "9/40", "Add completed parts and subtract from 1."],
    ["Calculate 13/16 - 5/24.", "29/48", "Use denominator 48."],
    ["A journey takes 3/5 hour plus 7/12 hour. How many hours is that?", "67/60", "Use denominator 60."],
    ["Calculate 5/6 - 7/18 + 1/9.", "5/9", "Use denominator 18 and simplify."],
    ["A water bottle is 7/8 full and 1/3 is poured out. What remains?", "13/24", "Subtract using denominator 24."],
    ["Calculate 9/10 + 7/15 - 1/6.", "6/5", "Use denominator 30 and simplify."],
  ],
  "multiplying-dividing": [
    ["A 3/4 full tank holds 240 litres. How many litres are inside?", "180", "Multiply 240 by 3/4."],
    ["A recipe for 4 people uses 2/3 kg rice. How much is needed for 15 people?", "2.5", "Multiply 2/3 by 15/4."],
    ["A 5/6 m ribbon is cut into pieces of 1/12 m. How many pieces are made?", "10", "Divide 5/6 by 1/12."],
    ["A shop sells 2/5 of its 350 items in the morning and 1/7 in the afternoon. How many remain?", "150", "Subtract both portions from 350."],
    ["Calculate 7/8 divided by 14/15.", "15/16", "Multiply by the reciprocal and simplify."],
    ["A cyclist completes 3/5 of a 45 km route. How far remains?", "18", "Find 3/5 of 45, then subtract from 45."],
    ["A 2/3 litre bottle is poured equally into 4 cups. How much is in each cup?", "1/6", "Divide 2/3 by 4."],
    ["Calculate 5/9 x 27/10.", "3/2", "Cancel common factors before multiplying."],
    ["A farmer harvests 4/7 of a field each day for 3 days. What fraction is harvested?", "12/7", "Multiply 4/7 by 3."],
    ["A 6 metre board is cut into pieces of 3/8 metre. How many pieces are possible?", "16", "Divide 6 by 3/8."],
    ["Calculate 11/12 divided by 22/9.", "3/8", "Multiply by the reciprocal and simplify."],
    ["A class uses 2/5 of 60 sheets, then recycles 1/3 of those used sheets. How many are recycled?", "8", "Find 2/5 of 60, then find 1/3 of that."],
    ["A 7/8 kg mixture is divided into bags of 1/16 kg. How many bags?", "14", "Divide 7/8 by 1/16."],
    ["Calculate 3/4 x 8/9 divided by 2/3.", "1", "Multiply and then divide by multiplying by the reciprocal."],
    ["A family spends 5/8 of a 480 dollar budget. They use 1/3 of that spending on travel. How much is travel?", "100", "Calculate 1/3 of 5/8 of 480."],
  ],
  "place-value-operations": [
    ["A town has 48,735 people. It grows by 7,865 and then loses 2,940. What is the new population?", "53660", "Add the growth, then subtract the loss."],
    ["Round 48,649 to the nearest thousand, then subtract 1,275.", "47725", "Round first, then calculate 49,000 - 1,275."],
    ["A shop has 5,000 dollars, spends 1,875, then receives 2,450. What is the balance?", "5575", "Subtract the spending and add the receipt."],
    ["What is the value of the 6 in 3,604,218?", "600000", "The 6 is in the hundred-thousands place."],
    ["A delivery travels 2,450 m, 3,875 m, and 1,925 m. Find the total distance.", "8250", "Add the three distances."],
    ["Estimate 6,784 + 2,349 by rounding each number to the nearest hundred.", "9100", "Round to 6,800 and 2,300."],
    ["A factory makes 12,000 items and rejects 8% of them. How many good items remain?", "11040", "Find 8% of 12,000 and subtract it."],
    ["Write 405,070 in expanded form.", "400000+5000+70", "Include only the non-zero place values."],
    ["A 9,000 dollar budget is split into 3,450, 2,875, and the remainder. Find the remainder.", "2675", "Subtract the two known amounts from 9,000."],
    ["Round 74,950 to the nearest thousand.", "75000", "The hundreds digit is 9, so round up."],
    ["A school has 1,248 students. It adds 3 classes of 28 students and 2 classes of 24 students. Find the total.", "1380", "Add 3 x 28 and 2 x 24 to 1,248."],
    ["Find the difference between 100,000 and 37,586.", "62414", "Subtract using place value."],
    ["A number has 7 in the ten-thousands place, 3 in the hundreds, and 9 in the ones. Write the smallest such number.", "70309", "Put zero in unspecified places."],
    ["Calculate 8,004 - 2,789 + 1,996.", "7211", "Work left to right carefully."],
    ["A charity target is 25,000 dollars. It has raised 8,750, 6,480, and 4,925. How much is still needed?", "4845", "Add the amounts raised and subtract from the target."],
  ],
  "multiplication-division": [
    ["A warehouse packs 36 boxes with 24 items each, then ships 180 items. How many remain?", "684", "Calculate 36 x 24 - 180."],
    ["A school buys 18 packs of 25 notebooks and shares them equally among 15 classes. How many per class?", "30", "Calculate (18 x 25) / 15."],
    ["A bus makes 7 trips carrying 48 passengers each. How many passengers are carried?", "336", "Multiply trips by passengers per trip."],
    ["A factory makes 1,728 parts over 12 hours. How many parts per hour?", "144", "Divide 1,728 by 12."],
    ["A farmer has 28 rows with 35 plants each. If 96 fail, how many survive?", "884", "Calculate 28 x 35 - 96."],
    ["A hotel has 16 floors with 24 rooms each. 58 rooms are closed. How many are available?", "326", "Calculate 16 x 24 - 58."],
    ["A charity packs 2,400 meals into boxes of 16, then sends 25 boxes away. How many boxes remain?", "125", "Calculate 2,400/16 - 25."],
    ["A printer produces 125 pages per minute for 18 minutes. How many pages?", "2250", "Multiply 125 by 18."],
    ["A runner completes 12 laps of 425 m. Express the distance in kilometres.", "5.1", "Multiply, then divide metres by 1,000."],
    ["A shop receives 2,760 products and puts 23 on each shelf. How many full shelves?", "120", "Divide 2,760 by 23."],
    ["A theatre sells 18 rows of 32 seats. If 47 seats are empty, how many are occupied?", "529", "Calculate 18 x 32 - 47."],
    ["A factory makes 4,500 bolts and packs 75 per crate. How many crates?", "60", "Divide 4,500 by 75."],
    ["A delivery van makes 9 journeys of 68 km and then 2 journeys of 45 km. Find the total distance.", "702", "Calculate 9 x 68 + 2 x 45."],
    ["A school orders 42 boxes of 18 pencils and gives 96 away. How many remain?", "660", "Calculate 42 x 18 - 96."],
    ["A 3,600 litre tank is emptied equally over 24 hours. How many litres per hour?", "150", "Divide 3,600 by 24."],
  ],
  "factors-multiples-gcf-lcm": [
    ["Two buses arrive every 18 and 24 minutes. If they arrive together now, when next together?", "72", "Find the LCM of 18 and 24."],
    ["A teacher has 84 red and 126 blue counters. What is the greatest number of equal groups possible?", "42", "Find the GCF of 84 and 126."],
    ["A light flashes every 15 seconds and another every 20 seconds. When do they flash together?", "60", "Find the LCM."],
    ["Can 221 be written as a product of two prime numbers? Give the product.", "13x17", "Test prime factors; 221 = 13 x 17."],
    ["Find the smallest number divisible by 8, 12, and 18.", "72", "Find the LCM of all three numbers."],
    ["A 96 cm by 144 cm sheet is cut into the largest equal squares. What is the side length?", "48", "The side is the GCF of 96 and 144."],
    ["Find the least number that leaves remainder 1 when divided by 3, 4, and 5.", "61", "Find the LCM, then add 1."],
    ["A club has 72 adults and 108 children. What is the largest equal group size with no one left over?", "36", "Find the GCF."],
    ["Find the prime factorization of 360.", "2x2x2x3x3x5", "Divide repeatedly by the smallest prime factors."],
    ["Three alarms ring every 8, 12, and 15 minutes. How many minutes until all ring together?", "120", "Find the LCM."],
    ["What is the smallest number greater than 50 that is both a multiple of 9 and a multiple of 12?", "72", "Find the LCM, then choose the first value above 50."],
    ["Find the GCF of 135 and 180, then state how many groups it creates.", "45", "Use common factors or prime factorization."],
    ["A number has exactly the factors 1, 2, 4, 8, 16. What is the number?", "16", "The largest factor is the number itself."],
    ["Find the smallest four-digit number divisible by both 18 and 25.", "1350", "Find the LCM and its first four-digit multiple."],
    ["Two runners complete laps in 42 and 56 seconds. When will they next finish together?", "168", "Find the LCM of 42 and 56."],
  ],
  "statistics-data-basics": [
    ["A shop's weekly sales are 42, 58, 51, 64, and 75. What is the total and range?", "290;33", "Add the values and subtract the smallest from the largest."],
    ["A survey has 240 responses. 35% choose option A. How many choose A?", "84", "Calculate 0.35 x 240."],
    ["A graph rises from 120 users to 174 users. What is the percentage increase?", "45%", "The increase is 54; compare it with 120."],
    ["A table shows 18, 24, 31, and 27 orders. What percentage were placed in the first two periods?", "60%", "Add the first two, divide by the total, then multiply by 100."],
    ["A data set has five values with total 86. Four values are 12, 17, 21, and 19. Find the missing value.", "17", "Subtract the known total from 86."],
    ["A chart uses 1 cm for 20 people. A bar is 4.5 cm high. How many people does it represent?", "90", "Multiply the scale by the bar height."],
    ["A sample of 80 batteries has 6 faulty batteries. Estimate faulty batteries in 2,000 batteries.", "150", "Use the same sample proportion."],
    ["A survey's results are 40%, 25%, and 18% for three choices. What percentage chose the remaining option?", "17%", "Subtract the known percentages from 100%."],
    ["A data table has frequencies 4, 7, 9, and 5. What is the frequency of the first two categories as a fraction of all data?", "11/25", "Add the first two frequencies and divide by the total."],
    ["A misleading graph starts its vertical axis at 90 instead of 0. Why can this exaggerate a difference?", "short scale", "A shortened axis makes small differences look visually larger."],
    ["A school records 68% attendance on Monday and 82% on Friday. How many percentage points higher is Friday?", "14", "Subtract the two percentages."],
    ["A survey of 500 people has a 4% margin of error. What is the error range in people?", "20", "Calculate 4% of 500."],
    ["A data set's maximum is 96 and its range is 28. Find the minimum.", "68", "Minimum equals maximum minus range."],
    ["A frequency table has 3, 5, 8, and 4 in four groups. What is the relative frequency of the third group as a percentage?", "40%", "The third group is 8 out of 20."],
    ["A company surveys every 10th customer entering a store. What sampling method is this?", "systematic", "Selecting every fixed interval is systematic sampling."],
  ],
  "statistics-averages-spread": [
    ["The mean of 6 delivery times is 18 minutes. Five times total 82 minutes. Find the sixth time.", "26", "Total time is 108; subtract 82."],
    ["Which is more consistent: Set A range 8 or Set B range 21?", "A", "The smaller range has less spread."],
    ["A data set has mean 24. If every value increases by 5, what is the new mean?", "29", "Adding a constant increases the mean by that constant."],
    ["The median of 7 ordered values is 18. What position contains the median?", "4", "For seven values, the middle position is (7+1)/2."],
    ["Find the mean of 14, 19, 23, 28, and 31.", "23", "Add and divide by five."],
    ["A data set has mode 7 and median 10. What does this tell you about the most frequent value?", "7", "The mode is the value appearing most often."],
    ["A runner's times have mean 52 seconds and range 9 seconds. If the fastest is 48, find the slowest.", "57", "Slowest equals fastest plus range."],
    ["The mean of four numbers is 15. Three are 9, 12, and 20. Find the fourth.", "19", "Total is 60; subtract the known values."],
    ["A data set has median 14. If 20 is added as a new largest value, what happens to the median?", "cannot determine", "The new median depends on the original number of values and ordering."],
    ["Set A has mean 30 and range 4. Set B has mean 30 and range 18. Which set is more reliable for a typical value?", "A", "A smaller range means values are more tightly grouped."],
    ["A five-number data set has mean 16. Four values are 8, 12, 18, and 25. Find the fifth.", "17", "Total is 80."],
    ["The range changes from 24 to 36 after one extreme value changes. By how much did the range increase?", "12", "Subtract the old range from the new range."],
    ["The mean of 8 scores is 72. A score of 80 is removed. What is the new mean if the remaining total is used?", "70.86", "Original total is 576; subtract 80 and divide by 7."],
    ["A data set has values 3, 3, 5, 8, 11, 14. Find the median and range.", "6.5;11", "Average the two middle values and subtract extremes."],
    ["A mean of 11 is incorrectly calculated for 5, 8, 12, 15, and 20. What is the correct mean?", "12", "Add all five values and divide by five."],
  ],
  "statistics-probability-charts": [
    ["A bag has 4 red, 5 blue, and 3 green counters. What is the probability of not choosing blue?", "7/12", "Non-blue counters are 7 out of 12."],
    ["A fair die is rolled twice. What is the probability of getting two sixes?", "1/36", "Multiply 1/6 by 1/6."],
    ["A weather forecast gives a 30% chance of rain each day. Over 10 similar days, how many rainy days would you expect?", "3", "Calculate 30% of 10."],
    ["A spinner has 8 equal sections, 3 red and 2 yellow. What is the probability of landing on neither red nor yellow?", "3/8", "There are 3 remaining sections."],
    ["A survey predicts 64% approval from 750 people. How many approvals is that?", "480", "Calculate 0.64 x 750."],
    ["A fair coin is tossed three times. Probability of exactly three heads?", "1/8", "There is one HHH outcome out of eight."],
    ["A chart shows 45% online, 30% in-store, and the rest by phone. What percentage is by phone?", "25%", "Subtract the known percentages from 100%."],
    ["A sample has 18 successes in 60 trials. Use it to estimate successes in 500 trials.", "150", "The sample proportion is 30%."],
    ["A bag has 6 red and 4 blue counters. Two counters are drawn with replacement. Probability both are red?", "9/25", "With replacement, multiply 6/10 by 6/10."],
    ["A chart's vertical scale jumps by 5, but labels show every second mark. What interval is between adjacent labels?", "10", "Two intervals of 5 make 10."],
    ["A fair die is rolled. Probability of an even number or a 5?", "2/3", "Outcomes are 2, 4, 5, and 6: four of six."],
    ["A poll of 400 people has 236 supporting a proposal. What is the support percentage?", "59%", "Calculate 236/400 x 100."],
    ["A spinner has probabilities 0.2, 0.35, and 0.15 for three outcomes. Find the remaining probability.", "0.3", "All probabilities total 1."],
    ["A class chart shows 12, 18, 15, and 5 students in four clubs. What percentage are in the second club?", "36%", "18 out of 50 is 36%."],
    ["A game pays 10 points with probability 1/4 and 0 otherwise. What is the expected score per play?", "2.5", "Multiply each outcome by its probability and add."],
  ],
};

const getAdditionalQuestions = (questionSetKey) => {
  const questions = [];
  const add = (prompt, answer, hint) => questions.push([prompt, String(answer), hint]);

  if (questionSetKey === "variables-expressions") {
    for (let value = 1; value <= 15; value += 1) {
      add(`Evaluate ${value + 2}x + ${value} when x = ${value + 1}`, (value + 2) * (value + 1) + value, "Substitute the value, multiply, then add.");
      add(`A notebook costs ${value + 1} dollars. Write the cost of ${value + 2} notebooks plus a ${value} dollar fee.`, (value + 2) * (value + 1) + value, "Multiply the price by the quantity, then add the fixed fee.");
    }
  } else if (questionSetKey === "one-step-equations") {
    for (let value = 1; value <= 15; value += 1) {
      add(`Solve x + ${value + 10} = ${value + 25}`, 15, "Subtract the constant from both sides.");
      add(`A taxi fare is ${value} dollars plus x dollars per extra item. The total is ${value + 15}. Find x.`, 15, "Subtract the fixed fare from the total.");
    }
  } else if (questionSetKey === "two-step-equations") {
    for (let value = 1; value <= 15; value += 1) {
      const multiplier = (value % 5) + 2;
      const constant = value + 1;
      const answer = value + 3;
      add(`Solve ${multiplier}x + ${constant} = ${multiplier * answer + constant}`, answer, "Subtract the constant, then divide by the coefficient.");
      add(`A service charges ${constant} dollars plus ${multiplier} dollars per unit. The bill is ${multiplier * answer + constant}. How many units?`, answer, "Subtract the fixed charge, then divide by the unit price.");
    }
  } else if (questionSetKey === "angles-lines") {
    for (let value = 1; value <= 10; value += 1) {
      const angle = 35 + value * 3;
      add(`Find the angle supplementary to ${angle} degrees.`, 180 - angle, "Supplementary angles total 180 degrees.");
      add(`A triangle has angles ${30 + value} and ${50 + value}. Find the third angle.`, 100 - 2 * value, "Triangle angles total 180 degrees.");
      add(`Find the complement of ${20 + value} degrees.`, 70 - value, "Complementary angles total 90 degrees.");
    }
  } else if (questionSetKey === "area-perimeter") {
    for (let value = 1; value <= 10; value += 1) {
      const length = value + 6;
      const width = value + 3;
      add(`A room is ${length} m by ${width} m. Find its area.`, length * width, "Rectangle area is length times width.");
      add(`A garden is ${length} m by ${width} m. Find its perimeter.`, 2 * (length + width), "Add all four sides, or use 2 times length plus width.");
      add(`Find the area of a triangle with base ${value + 8} cm and height ${value + 4} cm.`, ((value + 8) * (value + 4)) / 2, "Triangle area is base times height divided by 2.");
    }
  } else if (questionSetKey === "circles-pythagoras") {
    for (let value = 1; value <= 10; value += 1) {
      const radius = value + 3;
      add(`Using pi = 3, find the circumference of a circle with radius ${radius}.`, 6 * radius, "Circumference is 2 times pi times radius.");
      add(`Using pi = 3, find the area of a circle with radius ${radius}.`, 3 * radius * radius, "Area is pi times radius squared.");
      const leg = value + 3;
      const otherLeg = value + 4;
      add(`A right triangle has legs ${leg} and ${otherLeg}. Find the hypotenuse to the nearest whole number.`, Math.round(Math.sqrt(leg * leg + otherLeg * otherLeg)), "Use the Pythagorean theorem, then take the square root.");
    }
  } else if (questionSetKey === "equivalent-simplification") {
    for (let value = 1; value <= 10; value += 1) {
      const denominator = value + 2;
      add(`Simplify ${denominator * 2}/${denominator * 3}.`, "2/3", "Divide the numerator and denominator by their common factor.");
      add(`Write ${value}/${value + 1} as an equivalent fraction with denominator ${(value + 1) * 2}.`, `${value * 2}/${(value + 1) * 2}`, "Multiply numerator and denominator by 2.");
      add(`Write ${value}/${value + 4} as a decimal to two decimal places.`, (value / (value + 4)).toFixed(2), "Divide the numerator by the denominator.");
    }
  } else if (questionSetKey === "adding-subtracting") {
    for (let value = 1; value <= 10; value += 1) {
      add(`Calculate ${value}/12 + ${value + 1}/12.`, `${2 * value + 1}/12`, "Keep the denominator and add the numerators, then simplify if possible.");
      add(`Calculate ${value + 6}/12 - ${value}/12.`, "1/2", "Subtract the numerators, then simplify the fraction.");
      add(`Calculate ${value}/(${value + 2}) + 1/(${value + 2}).`, `${value + 1}/${value + 2}`, "The denominators match, so add the numerators.");
    }
  } else if (questionSetKey === "multiplying-dividing") {
    for (let value = 1; value <= 10; value += 1) {
      const denominator = value + 2;
      add(`Find ${value}/${denominator} of ${denominator * 3}.`, value * 3, "Divide by the denominator, then multiply by the numerator.");
      add(`Calculate ${value}/${denominator} x ${denominator * 2}.`, value * 2, "Multiply the fraction by the whole number.");
      add(`Calculate ${value}/${denominator} divided by 1/${denominator}.`, value, "Multiply by the reciprocal of the second fraction.");
    }
  } else if (questionSetKey === "place-value-operations") {
    for (let value = 1; value <= 10; value += 1) {
      const number = `${value + 3},${value}42`;
      add(`What is the value of the ${value} in ${number}?`, value * 100, "Identify the place occupied by the digit.");
      add(`Calculate ${400 + value * 11} + ${200 + value * 7}.`, 600 + value * 18, "Add ones, tens, and hundreds by place value.");
      const rounded = 3200 + value * 100;
      add(`Round ${rounded + 49} to the nearest hundred.`, rounded, "Look at the tens digit to decide whether to round up.");
    }
  } else if (questionSetKey === "multiplication-division") {
    for (let value = 1; value <= 10; value += 1) {
      add(`Calculate ${value + 20} x ${value + 3}.`, (value + 20) * (value + 3), "Multiply using place value or a written method.");
      add(`Calculate ${(value + 4) * 12} / ${value + 4}.`, 12, "Ask which number multiplied by the divisor gives the dividend.");
      add(`A shop packs ${value + 5} items in each box. How many items are in ${value + 4} boxes?`, (value + 5) * (value + 4), "Multiply items per box by the number of boxes.");
    }
  } else if (questionSetKey === "factors-multiples-gcf-lcm") {
    for (let value = 1; value <= 10; value += 1) {
      add(`Find the GCF of ${value * 6} and ${value * 9}.`, value * 3, "Find the largest factor shared by both numbers.");
      add(`Find the LCM of ${value + 2} and ${(value + 2) * 2}.`, (value + 2) * 2, "The larger number is already a multiple of the smaller one.");
      add(`What is the next multiple of ${value + 3} after ${(value + 3) * 5}?`, (value + 3) * 6, "Add one more group of the number.");
    }
  } else if (questionSetKey === "statistics-data-basics") {
    for (let value = 1; value <= 10; value += 1) {
      const first = value + 4;
      const second = value + 8;
      const third = value + 11;
      add(`A shop records ${first}, ${second}, and ${third} customers over three hours. How many customers total?`, first + second + third, "Add the three frequencies.");
      add(`Find the range of ${value + 3}, ${value + 12}, ${value + 7}, and ${value + 5}.`, 9, "Subtract the smallest value from the largest.");
      add(`A survey records ${value + 6} positive and ${value + 4} negative responses. How many responses were recorded?`, 2 * value + 10, "Add the two categories.");
    }
  } else if (questionSetKey === "statistics-averages-spread") {
    for (let value = 1; value <= 10; value += 1) {
      const values = [value + 2, value + 4, value + 6, value + 8];
      add(`Find the mean of ${values.join(", ")}.`, value + 5, "Add the values and divide by four.");
      add(`Find the range of ${value + 5}, ${value + 14}, ${value + 8}, and ${value + 11}.`, 9, "Subtract the smallest from the largest.");
      add(`The mean of ${value + 2} test scores is ${value + 8}. What is the total score?`, (value + 2) * (value + 8), "Multiply the number of scores by the mean.");
    }
  } else if (questionSetKey === "statistics-probability-charts") {
    for (let value = 1; value <= 10; value += 1) {
      const favourable = value + 1;
      const total = value + 5;
      add(`A box has ${favourable} green counters and ${total - favourable} yellow counters. Probability of green?`, `${favourable}/${total}`, "Use favourable outcomes over total outcomes.");
      add(`A survey records ${value + 4} votes for option A out of ${value + 10} votes. How many votes were not for A?`, 6, "Subtract the votes for A from the total.");
      add(`A spinner has ${value + 3} equal sections and ${value + 1} are shaded. Probability of shaded?`, `${value + 1}/${value + 3}`, "Shaded sections divided by all sections.");
    }
  }

  return questions;
};

function getLessonQuestions(questionSetKey) {
  const questions = questionBanks[questionSetKey] || [];
  const extraQuestions = {
    "variables-expressions": [
      ["Evaluate 6r + 1 when r = 4", "25", "Substitute 4 for r."], ["Find 9 + 2q when q = 6", "21", "Multiply 2 by 6, then add 9."], ["Evaluate 7c - 4 when c = 5", "31", "Multiply 7 by 5, then subtract 4."], ["Calculate 3d + 8 when d = 9", "35", "Multiply 3 by 9, then add 8."], ["If z = 2, find 8z + 5", "21", "Substitute 2 for z."], ["Evaluate 12 - 3w when w = 2", "6", "Multiply 3 by 2, then subtract from 12."], ["Find 4b + 9 when b = 7", "37", "Multiply 4 by 7, then add 9."], ["Evaluate 5t - 6 when t = 8", "34", "Multiply 5 by 8, then subtract 6."], ["Calculate 2(s + 3) when s = 5", "16", "Add 3 to 5, then multiply by 2."], ["Find 10 + 4v when v = 3", "22", "Multiply 4 by 3, then add 10."],
    ],
    "one-step-equations": [
      ["Solve x + 14 = 31", "17", "Subtract 14 from both sides."], ["Solve y - 11 = 9", "20", "Add 11 to both sides."], ["Solve 8m = 56", "7", "Divide both sides by 8."], ["Solve p / 7 = 5", "35", "Multiply both sides by 7."], ["Solve a + 16 = 40", "24", "Subtract 16 from both sides."], ["Solve k - 9 = 18", "27", "Add 9 to both sides."], ["Solve 4b = 36", "9", "Divide both sides by 4."], ["Solve c / 6 = 8", "48", "Multiply both sides by 6."], ["Solve r + 7 = 29", "22", "Subtract 7 from both sides."], ["Solve 9t = 72", "8", "Divide both sides by 9."],
    ],
    "two-step-equations": [
      ["Solve 4x + 3 = 19", "4", "Subtract 3, then divide by 4."], ["Solve 5y - 9 = 16", "5", "Add 9, then divide by 5."], ["Solve 7n + 1 = 29", "4", "Subtract 1, then divide by 7."], ["Solve 3p - 12 = 15", "9", "Add 12, then divide by 3."], ["Solve 4(a + 2) = 28", "5", "Divide by 4, then subtract 2."], ["Solve 6m - 6 = 30", "6", "Add 6, then divide by 6."], ["Solve 2(k + 7) = 22", "4", "Divide by 2, then subtract 7."], ["Solve 8r + 4 = 36", "4", "Subtract 4, then divide by 8."], ["Solve 5(c - 2) = 35", "9", "Divide by 5, then add 2."], ["Solve 9t - 9 = 36", "5", "Add 9, then divide by 9."],
    ],
    "angles-lines": [
      ["Find the angle beside 48 degrees on a straight line", "132", "Subtract 48 from 180."], ["A triangle has angles 35 and 85 degrees. Find the third.", "60", "Subtract both from 180."], ["Find the complement of 27 degrees", "63", "Complements total 90."], ["Is 40 degrees acute or obtuse?", "acute", "It is less than 90 degrees."], ["An angle vertically opposite 118 degrees is what?", "118", "Vertically opposite angles are equal."], ["Angles in a pentagon total how many degrees?", "540", "Use (5 - 2) x 180."], ["Find the third angle of a triangle with 72 and 38 degrees", "70", "Triangle angles total 180."], ["Find the supplement of 64 degrees", "116", "Supplements total 180."], ["What type of angle is 90 degrees?", "right", "A right angle is exactly 90 degrees."], ["Corresponding angle to 83 degrees is what?", "83", "Corresponding angles are equal."],
    ],
    "area-perimeter": [
      ["Find the area of a rectangle 7 cm by 6 cm", "42", "Multiply length by width."], ["Find the perimeter of a 10 cm by 3 cm rectangle", "26", "Add all four sides."], ["Find the area of a triangle with base 14 and height 5", "35", "Multiply base and height, then divide by 2."], ["Find the perimeter of a square with side 11", "44", "Multiply the side by 4."], ["A rectangle is 15 m by 2 m. Find its area.", "30", "Multiply 15 by 2."], ["Find the area of a parallelogram with base 8 and height 7", "56", "Base times perpendicular height."], ["Find the area of a triangle with base 9 and height 8", "36", "Use base times height divided by 2."], ["Find the perimeter of a square with side 13", "52", "Multiply 13 by 4."], ["A garden is 20 m by 4 m. Find its perimeter.", "48", "Use 2 x (length + width)."], ["Find the area of a rectangle 16 by 5", "80", "Multiply length by width."],
    ],
    "circles-pythagoras": [
      ["Using pi = 3, find circumference with radius 7", "42", "Use 2 x pi x radius."], ["Using pi = 3, find area with radius 4", "48", "Use pi x radius squared."], ["A right triangle has legs 5 and 12. Find the hypotenuse.", "13", "Use a squared plus b squared."], ["A right triangle has hypotenuse 10 and leg 6. Find the other leg.", "8", "Use the difference of the squares."], ["Using pi = 3, find circumference with radius 9", "54", "Use 2 x pi x radius."], ["Using pi = 3, find area with radius 8", "192", "Use pi x radius squared."], ["A right triangle has legs 8 and 15. Find the hypotenuse.", "17", "Use the Pythagorean theorem."], ["A right triangle has hypotenuse 25 and leg 7. Find the other leg.", "24", "Use 25 squared minus 7 squared."], ["Using pi = 3, find area with radius 3", "27", "Use pi x 3 squared."], ["Using pi = 3, find circumference with radius 10", "60", "Use 2 x pi x radius."],
    ],
    "equivalent-simplification": [
      ["Simplify 20/30", "2/3", "Divide both by 10."], ["Simplify 24/36", "2/3", "Divide both by 12."], ["Write 3/7 with denominator 35", "15/35", "Multiply both parts by 5."], ["Simplify 27/45", "3/5", "Divide both by 9."], ["Write 4/5 as a decimal", "0.8", "Divide 4 by 5."], ["Simplify 32/40", "4/5", "Divide both by 8."], ["Write 5/8 with denominator 40", "25/40", "Multiply both parts by 5."], ["Simplify 35/49", "5/7", "Divide both by 7."], ["Write 1/4 as a decimal", "0.25", "Divide 1 by 4."], ["Simplify 42/56", "3/4", "Divide both by 14."],
    ],
    "adding-subtracting": [
      ["Calculate 1/5 + 1/5", "2/5", "Add the numerators."], ["Calculate 7/10 - 1/5", "1/2", "Convert 1/5 to 2/10."], ["Calculate 3/8 + 1/4", "5/8", "Convert 1/4 to 2/8."], ["Calculate 5/9 - 2/9", "1/3", "Subtract and simplify."], ["Calculate 2/7 + 3/7", "5/7", "Add numerators with the same denominator."], ["Calculate 3/4 - 1/8", "5/8", "Convert 3/4 to 6/8."], ["Calculate 1/6 + 1/3", "1/2", "Convert 1/3 to 2/6."], ["Calculate 7/12 - 1/6", "5/12", "Convert 1/6 to 2/12."], ["Calculate 2/3 + 1/9", "7/9", "Convert 2/3 to 6/9."], ["Calculate 5/8 - 1/4", "3/8", "Convert 1/4 to 2/8."],
    ],
    "multiplying-dividing": [
      ["Find 3/5 of 20", "12", "Divide by 5, then multiply by 3."], ["Calculate 2/3 x 9", "6", "Multiply the fraction by 9."], ["Find 7/8 of 32", "28", "Divide by 8, then multiply by 7."], ["Calculate 4/5 divided by 2/5", "2", "Multiply by the reciprocal."], ["Find 3/10 of 70", "21", "Divide by 10, then multiply by 3."], ["Calculate 5/6 x 12", "10", "Multiply 12 by 5/6."], ["Find 4/7 of 35", "20", "Divide by 7, then multiply by 4."], ["Calculate 3/4 divided by 1/4", "3", "Multiply by the reciprocal."], ["Find 9/10 of 40", "36", "Divide by 10, then multiply by 9."], ["Calculate 2/9 x 27", "6", "Multiply 27 by 2/9."],
    ],
    "place-value-operations": [
      ["What is the value of 6 in 6,421?", "6000", "The 6 is in the thousands place."], ["Calculate 573 + 189", "762", "Add by place value."], ["Round 4,251 to the nearest hundred", "4300", "The tens digit is 5."], ["Calculate 800 - 457", "343", "Subtract by place value."], ["Write 7,306 in expanded form", "7000+300+6", "Break it into place values."], ["What is the value of 9 in 9,104?", "9000", "The 9 is in the thousands place."], ["Calculate 684 + 216", "900", "Add ones, tens, and hundreds."], ["Round 2,749 to the nearest hundred", "2700", "The tens digit is 4."], ["Calculate 1,000 - 628", "372", "Subtract carefully by place value."], ["Write 8,052 in expanded form", "8000+50+2", "Break it into place values."],
    ],
    "multiplication-division": [
      ["Calculate 42 x 6", "252", "Multiply 42 by 6."], ["Calculate 945 / 9", "105", "Divide into 9 equal groups."], ["A box has 18 pencils. How many are in 7 boxes?", "126", "Multiply 18 by 7."], ["Calculate 1,440 / 8", "180", "Divide each place value carefully."], ["Calculate 225 x 4", "900", "Multiply 225 by 4."], ["Calculate 64 x 5", "320", "Multiply 64 by 5."], ["Calculate 1,008 / 7", "144", "Divide 1,008 by 7."], ["A pack has 15 cards. How many cards are in 8 packs?", "120", "Multiply 15 by 8."], ["Calculate 2,400 / 6", "400", "Divide 2,400 by 6."], ["Calculate 312 x 3", "936", "Multiply 312 by 3."],
    ],
    "factors-multiples-gcf-lcm": [
      ["Find the GCF of 24 and 36", "12", "List common factors."], ["Find the LCM of 4 and 10", "20", "List multiples until they match."], ["Is 31 prime?", "yes", "It has only factors 1 and 31."], ["Find the next multiple of 9 after 45", "54", "Add 9 to 45."], ["Find the GCF of 32 and 48", "16", "16 is the largest common factor."], ["Find the LCM of 5 and 12", "60", "List multiples of both numbers."], ["Is 39 prime?", "no", "39 has factors 3 and 13."], ["Find the next multiple of 8 after 56", "64", "Add 8 to 56."], ["Find the GCF of 45 and 60", "15", "List common factors and choose the largest."], ["Find the LCM of 7 and 9", "63", "The first common multiple is 63."],
    ],
  }[questionSetKey] || [];

  const additionalQuestions = getAdditionalQuestions(questionSetKey);
  const hardQuestions = hardQuestionBanks[questionSetKey] || additionalQuestions.slice(15);
  const foundationalQuestions = [...questions, ...extraQuestions, ...additionalQuestions].slice(0, 30);
  return [...foundationalQuestions, ...hardQuestions].slice(0, 45).map(([prompt, answer, hint], questionIndex) => ({
    questionIndex,
    difficulty: questionIndex < 15 ? "Beginner" : questionIndex < 30 ? "Intermediate" : "Hard",
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
