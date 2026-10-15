const Topic = require("../models/Topic");
const Lesson = require("../models/Lesson");
const Progress = require("../models/Progress");
const middleSchoolStages = require("../data/middleSchoolCurriculum");

const curriculumStages = [
  {
    order: 1,
    stageNumber: 1,
    title: "Basic Maths & Arithmetic",
    aliasRegex: /arithmetic|basic/i,
    description: "Start here: master place value, multi-digit operations, factors, and foundational number sense.",
    icon: "arithmetic",
    difficulty: "Foundation",
    requiredCorrectToUnlock: 3,
    lessons: [
      {
        title: "Place Value & Core Operations",
        questionSetKey: "place-value-operations",
        description: "Understand units, tens, hundreds, thousands, and multi-digit addition and subtraction.",
        content: "Place value determines the value of a digit based on its position in a number.",
        videoUrl: "https://www.youtube.com/embed/T5Qf0qSSJFI",
        difficulty: "Foundation",
        duration: 10,
      },
      {
        title: "Multiplication & Long Division",
        questionSetKey: "multiplication-division",
        description: "Solve multi-digit multiplication and long division calculations with ease.",
        content: "Break large multiplication into expanded place value steps.",
        videoUrl: "https://www.youtube.com/embed/sR83TDp_g2c",
        difficulty: "Beginner",
        duration: 12,
      },
      {
        title: "Factors, Multiples & GCF/LCM",
        questionSetKey: "factors-multiples-gcf-lcm",
        description: "Find Prime Factors, Greatest Common Factors (GCF), and Least Common Multiples (LCM).",
        content: "GCF is the largest common factor. LCM is the smallest common multiple.",
        videoUrl: "https://www.youtube.com/embed/jFd-6EPfnec",
        difficulty: "Beginner",
        duration: 15,
      },
    ],
  },
  {
    order: 2,
    stageNumber: 2,
    title: "Fractions & Decimals",
    aliasRegex: /fraction/i,
    description: "Build confidence comparing, adding, subtracting, and multiplying fractions using visual models.",
    icon: "fractions",
    difficulty: "Beginner",
    requiredCorrectToUnlock: 3,
    lessons: [
      {
        title: "Equivalent Fractions & Simplification",
        questionSetKey: "equivalent-simplification",
        description: "Learn how to simplify fractions to lowest terms and find equivalent fractions.",
        content: "Multiply or divide numerator and denominator by the same non-zero number.",
        videoUrl: "https://www.youtube.com/embed/n0FZhQ_GkKw",
        difficulty: "Beginner",
        duration: 10,
      },
      {
        title: "Adding & Subtracting Fractions",
        questionSetKey: "adding-subtracting",
        description: "Find common denominators and solve addition/subtraction problems with fractions.",
        content: "Convert fractions so they share the same denominator before adding or subtracting.",
        videoUrl: "https://www.youtube.com/embed/5juto2ze8Lg",
        difficulty: "Beginner",
        duration: 12,
      },
      {
        title: "Multiplying & Dividing Fractions",
        questionSetKey: "multiplying-dividing",
        description: "Master fraction multiplication, reciprocals, and division rules.",
        content: "To multiply: multiply numerators together, multiply denominators together.",
        videoUrl: "https://www.youtube.com/embed/qmfXyR7Z6Lk",
        difficulty: "Intermediate",
        duration: 15,
      },
    ],
  },
  {
    order: 3,
    stageNumber: 3,
    title: "Pre-Algebra & Equations",
    aliasRegex: /algebra/i,
    description: "Learn how variables represent unknown values and how equations describe relationships.",
    icon: "algebra",
    difficulty: "Intermediate",
    requiredCorrectToUnlock: 3,
    lessons: [
      {
        title: "Variables & Expressions",
        questionSetKey: "variables-expressions",
        description: "Understand how letters represent unknown quantities in mathematical expressions.",
        content: "A variable is a symbol, usually a letter, that stands for a number we don't know yet.",
        videoUrl: "https://www.youtube.com/embed/NybHckSEQBI",
        difficulty: "Intermediate",
        duration: 10,
      },
      {
        title: "One-Step Linear Equations",
        questionSetKey: "one-step-equations",
        description: "Master solving basic equations using inverse operations to isolate variables.",
        content: "Whatever operation is done to x, do the inverse operation to both sides of the equation.",
        videoUrl: "https://www.youtube.com/embed/Qyd_v3DGzTM",
        difficulty: "Intermediate",
        duration: 12,
      },
      {
        title: "Two-Step & Brackets Equations",
        questionSetKey: "two-step-equations",
        description: "Solve multi-step linear equations involving coefficients, constants, and parentheses.",
        content: "First undo addition/subtraction, then undo multiplication/division.",
        videoUrl: "https://www.youtube.com/embed/9ITsXICV2u0",
        difficulty: "Intermediate",
        duration: 15,
      },
    ],
  },
  {
    order: 4,
    stageNumber: 4,
    title: "Geometry & Spatial Measurement",
    aliasRegex: /geometry/i,
    description: "Explore angles, 2D shapes, perimeter, area, circles, and right-triangle relationships.",
    icon: "geometry",
    difficulty: "Intermediate",
    requiredCorrectToUnlock: 3,
    lessons: [
      {
        title: "Angles & Parallel Lines",
        questionSetKey: "angles-lines",
        description: "Identify acute, obtuse, right, corresponding, and alternate interior angles.",
        content: "Angles on a straight line add up to 180 degrees.",
        videoUrl: "https://www.youtube.com/embed/DGKwdHMiqCg",
        difficulty: "Intermediate",
        duration: 10,
      },
      {
        title: "Area & Perimeter Formulae",
        questionSetKey: "area-perimeter",
        description: "Calculate the perimeter and surface area of rectangles, triangles, and parallelograms.",
        content: "Area of rectangle = length x width. Area of triangle = 1/2 x base x height.",
        videoUrl: "https://www.youtube.com/embed/xCdxURXMdFY",
        difficulty: "Intermediate",
        duration: 14,
      },
      {
        title: "Circles & Pythagoras Theorem",
        questionSetKey: "circles-pythagoras",
        description: "Work with circumference, circle area, and right-angled triangle side lengths.",
        content: "a^2 + b^2 = c^2 for any right-angled triangle.",
        videoUrl: "https://www.youtube.com/embed/AA6RfgP-AHU",
        difficulty: "Advanced",
        duration: 18,
      },
    ],
  },
  {
    order: 5,
    stageNumber: 5,
    title: "Statistics & Probability",
    aliasRegex: /statistic/i,
    description: "Understand data, averages, spread, probability, and charts used in real-world decisions.",
    icon: "statistics",
    difficulty: "Advanced",
    requiredCorrectToUnlock: 3,
    lessons: [
      {
        title: "Data Basics & Display Charts",
        questionSetKey: "statistics-data-basics",
        description: "Read tables, bar charts, and data displays with clarity and confidence.",
        content: "Organize data, compare values, and identify what a chart is showing.",
        videoUrl: "https://www.youtube.com/embed/qBigTkBLU6g",
        difficulty: "Intermediate",
        duration: 10,
      },
      {
        title: "Averages & Spread (Mean, Median, Range)",
        questionSetKey: "statistics-averages-spread",
        description: "Calculate and interpret mean, median, mode, and range for everyday decisions.",
        content: "Use averages and spread to summarize and compare real data sets.",
        videoUrl: "https://www.youtube.com/embed/qBigTkBLU6g",
        difficulty: "Advanced",
        duration: 14,
      },
      {
        title: "Probability & Real-World Charts",
        questionSetKey: "statistics-probability-charts",
        description: "Use probability principles and data displays to make informed predictions.",
        content: "Interpret probability, sampling, and misleading or useful charts.",
        videoUrl: "https://www.youtube.com/embed/KzfWUEJjG18",
        difficulty: "Advanced",
        duration: 18,
      },
    ],
  },
	...middleSchoolStages,
];

const learningPathOrder = [
  "Basic Maths & Arithmetic",
  "Fractions & Decimals",
  "Integers, Powers & Order of Operations",
  "Ratios, Rates & Proportions",
  "Percentages & Financial Maths",
  "Pre-Algebra & Equations",
  "Algebra, Patterns & Inequalities",
  "Geometry & Spatial Measurement",
  "Geometry, Measurement & Data",
  "Statistics & Probability",
];
const learningPathRank = new Map(learningPathOrder.map((title, index) => [title, index]));
curriculumStages.sort((first, second) => learningPathRank.get(first.title) - learningPathRank.get(second.title));
curriculumStages.forEach((stage, index) => {
  stage.order = index + 1;
  stage.stageNumber = index + 1;
});

const seedInitialData = async () => {
  try {
    for (const stage of curriculumStages) {
      // Find existing topic by title or alias regex to preserve existing IDs and student progress
      let topic = await Topic.findOne({
        $or: [
          { title: stage.title },
          ...(stage.aliasRegex ? [{ title: { $regex: stage.aliasRegex } }] : []),
        ],
      });

      if (topic) {
        // Update to new roadmap ordering and details
        topic.title = stage.title;
        topic.order = stage.order;
        topic.stageNumber = stage.stageNumber;
        topic.description = stage.description;
        topic.icon = stage.icon;
        topic.difficulty = stage.difficulty;
        topic.requiredCorrectToUnlock = stage.requiredCorrectToUnlock;
        await topic.save();
      } else {
        topic = await Topic.create({
          title: stage.title,
          description: stage.description,
          icon: stage.icon,
          difficulty: stage.difficulty,
          order: stage.order,
          stageNumber: stage.stageNumber,
          requiredCorrectToUnlock: stage.requiredCorrectToUnlock,
        });
      }

      // Upsert lessons for this topic
      for (const [lessonIndex, lessonData] of stage.lessons.entries()) {
        const order = lessonIndex + 1;
        await Lesson.findOneAndUpdate(
          {
            $or: [
              { topic: topic._id, order },
              { questionSetKey: lessonData.questionSetKey },
            ],
          },
          {
            $set: {
              topic: topic._id,
              title: lessonData.title,
              questionSetKey: lessonData.questionSetKey,
              videoUrl: lessonData.videoUrl,
              description: lessonData.description,
              content: lessonData.content,
              difficulty: lessonData.difficulty,
              duration: lessonData.duration,
              order,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }
  } catch (err) {
    console.error("SEED/MIGRATE CURRICULUM ERROR:", err);
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
      stageNumber,
      requiredCorrectToUnlock,
    } = req.body;

    const topic = await Topic.create({
      title,
      description,
      icon,
      difficulty,
      order: order || 0,
      stageNumber: stageNumber || order || 1,
      requiredCorrectToUnlock: requiredCorrectToUnlock || 3,
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
  curriculumStages,
};