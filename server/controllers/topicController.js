const Topic = require("../models/Topic");
const Lesson = require("../models/Lesson");

const seedInitialData = async () => {
  try {
    const existingTopicsCount = await Topic.countDocuments();
    if (existingTopicsCount > 0) return;

    const topicsData = [
      {
        title: "Algebra",
        description: "Learn how variables represent unknown values and how equations describe relationships.",
        icon: "🧮",
        difficulty: "Beginner",
        order: 1,
      },
      {
        title: "Geometry",
        description: "Explore angles, shapes, area, and the formulas that help us measure the world.",
        icon: "📐",
        difficulty: "Intermediate",
        order: 2,
      },
      {
        title: "Fractions",
        description: "Build confidence comparing, adding, and multiplying fractions using visual models.",
        icon: "🍕",
        difficulty: "Beginner",
        order: 3,
      },
      {
        title: "Arithmetic",
        description: "Strengthen number sense with operations, place value, factors, and mental strategies.",
        icon: "🔢",
        difficulty: "Beginner",
        order: 4,
      },
    ];

    const createdTopics = await Topic.insertMany(topicsData);
    const topicMap = {};
    createdTopics.forEach((t) => {
      topicMap[t.title] = t._id;
    });

    const lessonsData = [
      {
        topic: topicMap["Algebra"],
        title: "Variables & Expressions",
        questionSetKey: "variables-expressions",
        description: "Understand how letters represent unknown quantities in mathematical expressions.",
        content: "A variable is a symbol, usually a letter, that stands for a number we don't know yet.",
        videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
        difficulty: "Beginner",
        order: 1,
        duration: 10,
      },
      {
        topic: topicMap["Algebra"],
        title: "One-Step Equations",
        questionSetKey: "one-step-equations",
        description: "Master solving basic equations using inverse operations to isolate variables.",
        content: "Whatever operation is done to x, do the inverse operation to both sides of the equation.",
        videoUrl: "https://www.youtube.com/embed/Qyd_v3DGzTM",
        difficulty: "Beginner",
        order: 2,
        duration: 12,
      },
      {
        topic: topicMap["Algebra"],
        title: "Two-Step & Brackets Equations",
        questionSetKey: "two-step-equations",
        description: "Solve multi-step linear equations involving coefficients, constants, and parentheses.",
        content: "First undo addition/subtraction, then undo multiplication/division.",
        videoUrl: "https://www.youtube.com/embed/9ITsXICV2u0",
        difficulty: "Intermediate",
        order: 3,
        duration: 15,
      },
      {
        topic: topicMap["Geometry"],
        title: "Angles & Parallel Lines",
        questionSetKey: "angles-lines",
        description: "Identify acute, obtuse, right, corresponding, and alternate interior angles.",
        content: "Angles on a straight line add up to 180 degrees.",
        videoUrl: "https://www.youtube.com/embed/DGKwdHMiqCg",
        difficulty: "Beginner",
        order: 1,
        duration: 10,
      },
      {
        topic: topicMap["Geometry"],
        title: "Area & Perimeter Formulae",
        questionSetKey: "area-perimeter",
        description: "Calculate the perimeter and surface area of rectangles, triangles, and parallelograms.",
        content: "Area of rectangle = length x width. Area of triangle = 1/2 x base x height.",
        videoUrl: "https://www.youtube.com/embed/xCdxURXMdFY",
        difficulty: "Intermediate",
        order: 2,
        duration: 14,
      },
      {
        topic: topicMap["Geometry"],
        title: "Circles & Pythagoras Theorem",
        questionSetKey: "circles-pythagoras",
        description: "Work with circumference, circle area, and right-angled triangle side lengths.",
        content: "a^2 + b^2 = c^2 for any right-angled triangle.",
        videoUrl: "https://www.youtube.com/embed/AA6RfgP-AHU",
        difficulty: "Advanced",
        order: 3,
        duration: 18,
      },
      {
        topic: topicMap["Fractions"],
        title: "Equivalent Fractions & Simplification",
        questionSetKey: "equivalent-simplification",
        description: "Learn how to simplify fractions to lowest terms and find equivalent fractions.",
        content: "Multiply or divide numerator and denominator by the same non-zero number.",
        videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw",
        difficulty: "Beginner",
        order: 1,
        duration: 8,
      },
      {
        topic: topicMap["Fractions"],
        title: "Adding & Subtracting Fractions",
        questionSetKey: "adding-subtracting",
        description: "Find common denominators and solve addition/subtraction problems with fractions.",
        content: "Convert fractions so they share the same denominator before adding or subtracting.",
        videoUrl: "https://www.youtube.com/embed/5juto2ze8Lg",
        difficulty: "Intermediate",
        order: 2,
        duration: 12,
      },
      {
        topic: topicMap["Fractions"],
        title: "Multiplying & Dividing Fractions",
        questionSetKey: "multiplying-dividing",
        description: "Master fraction multiplication, reciprocals, and division rules.",
        content: "To multiply: multiply numerators together, multiply denominators together.",
        videoUrl: "https://www.youtube.com/embed/qmfXyR7Z6Lk",
        difficulty: "Intermediate",
        order: 3,
        duration: 15,
      },
      {
        topic: topicMap["Arithmetic"],
        title: "Place Value & Operations",
        questionSetKey: "place-value-operations",
        description: "Understand units, tens, hundreds, thousands, and multi-digit addition and subtraction.",
        content: "Place value determines the value of a digit based on its position in a number.",
        videoUrl: "https://www.youtube.com/embed/T5Qf0qSSJFI",
        difficulty: "Beginner",
        order: 1,
        duration: 10,
      },
      {
        topic: topicMap["Arithmetic"],
        title: "Multiplication & Long Division",
        questionSetKey: "multiplication-division",
        description: "Solve multi-digit multiplication and long division calculations with ease.",
        content: "Break large multiplication into expanded place value steps.",
        videoUrl: "https://www.youtube.com/embed/T5Qf0qSSJFI",
        difficulty: "Intermediate",
        order: 2,
        duration: 14,
      },
      {
        topic: topicMap["Arithmetic"],
        title: "Factors, Multiples & GCF/LCM",
        questionSetKey: "factors-multiples-gcf-lcm",
        description: "Find Prime Factors, Greatest Common Factors (GCF), and Least Common Multiples (LCM).",
        content: "GCF is the largest common factor. LCM is the smallest common multiple.",
        videoUrl: "https://www.youtube.com/embed/jFd-6EPfnec",
        difficulty: "Advanced",
        order: 3,
        duration: 16,
      },
    ];

    await Lesson.insertMany(lessonsData);
  } catch (err) {
    console.error("SEED DATA ERROR:", err);
  }
};

const getTopics = async (req, res) => {
  try {
    await seedInitialData();

    const topics = await Topic.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    console.error("GET TOPICS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch topics",
    });
  }
};

const createTopic = async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
      difficulty,
      order,
    } = req.body;

    const topic = await Topic.create({
      title,
      description,
      icon,
      difficulty,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      topic,
    });
  } catch (error) {
    console.error("CREATE TOPIC ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create topic",
    });
  }
};

module.exports = {
  getTopics,
  createTopic,
  seedInitialData,
};