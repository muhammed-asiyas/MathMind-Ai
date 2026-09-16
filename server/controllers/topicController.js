const Topic = require("../models/Topic");
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");

const topicLessonBlueprints = {
  Algebra: [
    ["Algebra Core Concepts", "variables-expressions", "Learn variables, expressions, and the language of algebra.", "Beginner"],
    ["Algebra Guided Practice", "one-step-equations", "Build confidence solving equations with guided inverse-operation practice.", "Beginner"],
    ["Algebra Advanced Problems", "two-step-equations", "Apply algebra to multi-step equations and bracket problems.", "Intermediate"],
  ],
  Geometry: [
    ["Geometry Core Concepts", "angles-lines", "Understand angles, lines, and essential geometric relationships.", "Beginner"],
    ["Geometry Guided Practice", "area-perimeter", "Practice area and perimeter with step-by-step shape problems.", "Intermediate"],
    ["Geometry Advanced Problems", "circles-pythagoras", "Solve circle and right-triangle problems using key formulae.", "Advanced"],
  ],
  Fractions: [
    ["Fractions Core Concepts", "equivalent-simplification", "Build fraction fluency by simplifying and finding equivalent forms.", "Beginner"],
    ["Fractions Guided Practice", "adding-subtracting", "Practice adding and subtracting fractions with common denominators.", "Intermediate"],
    ["Fractions Advanced Problems", "multiplying-dividing", "Apply multiplication, division, and fraction-of-quantity strategies.", "Intermediate"],
  ],
  Arithmetic: [
    ["Arithmetic Core Concepts", "place-value-operations", "Strengthen place value, rounding, and essential number operations.", "Beginner"],
    ["Arithmetic Guided Practice", "multiplication-division", "Practice multiplication and division through useful real-world calculations.", "Intermediate"],
    ["Arithmetic Advanced Problems", "factors-multiples-gcf-lcm", "Solve challenging factor, multiple, GCF, and LCM problems.", "Advanced"],
  ],
  Statistics: [
    ["Statistics Data Basics", "statistics-data-basics", "Read tables, charts, and data displays with confidence.", "Beginner"],
    ["Statistics Averages & Spread", "statistics-averages-spread", "Calculate and interpret mean, median, mode, and range.", "Intermediate"],
    ["Statistics Probability & Charts", "statistics-probability-charts", "Use probability and data displays to make informed decisions.", "Advanced"],
  ],
};

const lessonVideoUrls = {
  "variables-expressions": "https://www.youtube.com/embed/NybHckSEQBI",
  "one-step-equations": "https://www.youtube.com/embed/Qyd_v3DGzTM",
  "two-step-equations": "https://www.youtube.com/embed/9ITsXICV2u0",
  "angles-lines": "https://www.youtube.com/embed/DGKwdHMiqCg",
  "area-perimeter": "https://www.youtube.com/embed/xCdxURXMdFY",
  "circles-pythagoras": "https://www.youtube.com/embed/AA6RfgP-AHU",
  "equivalent-simplification": "https://www.youtube.com/embed/n0FZhQ_GkKw",
  "adding-subtracting": "https://www.youtube.com/embed/5juto2ze8Lg",
  "multiplying-dividing": "https://www.youtube.com/embed/qmfXyR7Z6Lk",
  "place-value-operations": "https://www.youtube.com/embed/T5Qf0qSSJFI",
  "multiplication-division": "https://www.youtube.com/embed/sR83TDp_g2c",
  "factors-multiples-gcf-lcm": "https://www.youtube.com/embed/jFd-6EPfnec",
  "statistics-data-basics": "https://www.youtube.com/embed/qBigTkBLU6g",
  "statistics-averages-spread": "https://www.youtube.com/embed/qBigTkBLU6g",
  "statistics-probability-charts": "https://www.youtube.com/embed/KzfWUEJjG18",
};

const ensureTopicLessons = async (topics) => {
  for (const topic of topics) {
    const blueprints = topicLessonBlueprints[topic.title];
    if (!blueprints) continue;

    for (const [index, [title, questionSetKey, description, difficulty]] of blueprints.entries()) {
      await Lesson.updateOne(
        { topic: topic._id, order: index + 1 },
        {
          $set: {
            title,
            questionSetKey,
            videoUrl: lessonVideoUrls[questionSetKey],
            description,
            content: description,
            difficulty,
            duration: 10 + index * 3,
          },
          $setOnInsert: { topic: topic._id, order: index + 1 },
        },
        { upsert: true }
      );
    }
  }
};

const seedInitialData = async () => {
  try {
    const existingTopicsCount = await Topic.countDocuments();
    if (existingTopicsCount > 0) {
      const existingTopics = await Topic.find({ title: { $in: Object.keys(topicLessonBlueprints) } });
      const statisticsTopic = await Topic.findOneAndUpdate(
        { title: "Statistics" },
        {
          $setOnInsert: {
            title: "Statistics",
            description: "Understand data, averages, spread, probability, and charts used in real decisions.",
            icon: "📊",
            difficulty: "Intermediate",
            order: 5,
          },
        },
        { upsert: true, new: true }
      );
      existingTopics.push(statisticsTopic);
      await ensureTopicLessons(existingTopics);
      return;
    }

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
      {
        title: "Statistics",
        description: "Understand data, averages, spread, probability, and charts used in real decisions.",
        icon: "📊",
        difficulty: "Intermediate",
        order: 5,
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
      {
        topic: topicMap["Statistics"],
        title: "Statistics Data Basics",
        questionSetKey: "statistics-data-basics",
        description: "Read tables, charts, and data displays with confidence.",
        content: "Organize data, compare values, and identify what a chart is showing.",
        videoUrl: lessonVideoUrls["statistics-data-basics"],
        difficulty: "Beginner",
        order: 1,
        duration: 10,
      },
      {
        topic: topicMap["Statistics"],
        title: "Statistics Averages & Spread",
        questionSetKey: "statistics-averages-spread",
        description: "Calculate and interpret mean, median, mode, and range.",
        content: "Use averages and spread to summarize and compare real data sets.",
        videoUrl: lessonVideoUrls["statistics-averages-spread"],
        difficulty: "Intermediate",
        order: 2,
        duration: 14,
      },
      {
        topic: topicMap["Statistics"],
        title: "Statistics Probability & Charts",
        questionSetKey: "statistics-probability-charts",
        description: "Use probability and data displays to make informed decisions.",
        content: "Interpret probability, sampling, and misleading or useful charts.",
        videoUrl: lessonVideoUrls["statistics-probability-charts"],
        difficulty: "Advanced",
        order: 3,
        duration: 18,
      },
    ];

    await Lesson.insertMany(lessonsData);
    await ensureTopicLessons(createdTopics);
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

const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found." });
    }

    // Cascade: delete all lessons belonging to this topic
    await Lesson.deleteMany({ topic: id });
    // Cascade: delete all student progress tied to this topic
    await Progress.deleteMany({ topic: id });
    await Topic.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Topic and its lessons removed successfully." });
  } catch (error) {
    console.error("DELETE TOPIC ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to delete topic." });
  }
};

module.exports = {
  getTopics,
  createTopic,
  deleteTopic,
  seedInitialData,
};