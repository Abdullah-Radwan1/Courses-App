import { db } from "./db";
import { Type } from "../src/generated/prisma";

async function findOrCreateCourse() {
  const title = "Fullstack Next.js Course";
  let course = await db.course.findFirst({ where: { title } });

  if (!course) {
    course = await db.course.create({
      data: {
        title,
        description: "Learn fullstack development using Next.js and Prisma",
        duration: "10 hours",
        language: "English",
      },
    });
  }

  return course;
}

async function findOrCreateCurriculum(title: string, period: string) {
  let curriculum = await db.curriculum.findFirst({ where: { title } });

  if (!curriculum) {
    curriculum = await db.curriculum.create({
      data: { title, period },
    });
  } else if (curriculum.period !== period) {
    curriculum = await db.curriculum.update({
      where: { id: curriculum.id },
      data: { period },
    });
  }

  return curriculum;
}

async function upsertLessonByAttrs({
  name,
  period,
  type,
  courseId,
  curriculumId,
}: {
  name: string;
  period: string;
  type: Type;
  courseId: string;
  curriculumId: string;
}) {
  // Because Lesson has no unique index on name/period, we use findFirst and update/create
  const existing = await db.lesson.findFirst({
    where: { name, period, courseId, curriculumId },
  });

  if (existing) {
    return db.lesson.update({
      where: { id: existing.id },
      data: { type, name, period },
    });
  }

  return db.lesson.create({
    data: { name, period, type, courseId, curriculumId },
  });
}

async function createOrReplaceExamWithQuestions(courseId: string) {
  const examTitle = "Next.js Fundamentals Exam";

  // find or create exam
  let exam = await db.exam.findFirst({ where: { title: examTitle, courseId } });

  if (!exam) {
    exam = await db.exam.create({
      data: {
        title: examTitle,
        course: { connect: { id: courseId } },
      },
    });
  }

  // Remove previous questions/options for this exam to avoid duplication
  const oldQuestions = await db.examQuestion.findMany({
    where: { examId: exam.id },
  });
  if (oldQuestions.length > 0) {
    const oldQuestionIds = oldQuestions.map((q) => q.id);
    await db.examOption.deleteMany({
      where: { questionId: { in: oldQuestionIds } },
    });
    await db.examQuestion.deleteMany({ where: { id: { in: oldQuestionIds } } });
  }

  // Questions + options data
  const questionsData = [
    {
      text: "What is the purpose of getServerSideProps in Next.js?",
      options: [
        "Client-side data fetching",
        "Server-side rendering at request time",
        "Static site generation",
        "Database operations",
      ],
      correct: "Server-side rendering at request time",
    },
    {
      text: "Which hook is used for routing in Next.js?",
      options: ["useRouter", "useRoute", "useNavigation", "useLink"],
      correct: "useRouter",
    },
    {
      text: "What is the main advantage of using Next.js Image component?",
      options: [
        "Automatic image optimization",
        "Faster loading",
        "Smaller file size",
        "Better colors",
      ],
      correct: "Automatic image optimization",
    },
    {
      text: "How do you create API routes in Next.js?",
      options: [
        "pages/api directory",
        "components/api directory",
        "utils/api.js",
        "public/api folder",
      ],
      correct: "pages/api directory",
    },
  ];

  const createdQuestions = [];

  for (const q of questionsData) {
    const createdQ = await db.examQuestion.create({
      data: { text: q.text, examId: exam.id },
    });

    const optionsToCreate = q.options.map((text) => ({
      text,
      questionId: createdQ.id,
    }));
    await db.examOption.createMany({ data: optionsToCreate });

    // find the correct option id and set correctId on question
    const correctOption = await db.examOption.findFirst({
      where: { questionId: createdQ.id, text: q.correct },
    });

    if (correctOption) {
      await db.examQuestion.update({
        where: { id: createdQ.id },
        data: { correctId: correctOption.id },
      });
    }

    createdQuestions.push(createdQ);
  }

  return exam;
}

async function main() {
  console.log("🌱 Starting idempotent seed...");

  // 1. Ensure course exists
  const course = await findOrCreateCourse();
  console.log("✅ Course ready:", course.id);

  // 2. Create or ensure two curriculums
  const fundamentals = await findOrCreateCurriculum(
    "Next.js Fundamentals",
    "Week 1"
  );
  const advanced = await findOrCreateCurriculum(
    "Advanced Next.js Concepts",
    "Week 2"
  );
  console.log("✅ Curriculums ready:", fundamentals.id, advanced.id);

  // 3. Lessons for each curriculum: VIDEO, VIDEO, EXAM, PDF (last = PDF overview, previous = EXAM)
  const lessonsFundamentals = [
    {
      name: "Intro to Next.js",
      period: "Week 1 - Day 1",
      type: Type.VIDEO,
      curriculumId: fundamentals.id,
    },
    {
      name: "Routing & Links",
      period: "Week 1 - Day 2",
      type: Type.VIDEO,
      curriculumId: fundamentals.id,
    },
    {
      name: "Fundamentals Exam",
      period: "Week 1 - Day 3",
      type: Type.EXAM,
      curriculumId: fundamentals.id,
    },
    {
      name: "Overview PDF",
      period: "Week 1 - Day 4",
      type: Type.PDF,
      curriculumId: fundamentals.id,
    },
  ];

  const lessonsAdvanced = [
    {
      name: "Server Actions",
      period: "Week 2 - Day 1",
      type: Type.VIDEO,
      curriculumId: advanced.id,
    },
    {
      name: "Caching & ISR",
      period: "Week 2 - Day 2",
      type: Type.VIDEO,
      curriculumId: advanced.id,
    },
    {
      name: "Advanced Exam",
      period: "Week 2 - Day 3",
      type: Type.EXAM,
      curriculumId: advanced.id,
    },
    {
      name: "Advanced Overview PDF",
      period: "Week 2 - Day 4",
      type: Type.PDF,
      curriculumId: advanced.id,
    },
  ];

  // Upsert lessons via findFirst -> update/create (safe for re-run)
  for (const l of lessonsFundamentals) {
    await upsertLessonByAttrs({ ...l, courseId: course.id });
  }
  for (const l of lessonsAdvanced) {
    await upsertLessonByAttrs({ ...l, courseId: course.id });
  }

  console.log("✅ Lessons ensured");

  // 4. Create or replace exam and its questions/options
  const exam = await createOrReplaceExamWithQuestions(course.id);
  console.log("✅ Exam created/updated:", exam.id);

  console.log("🌟 Idempotent seeding finished!");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
