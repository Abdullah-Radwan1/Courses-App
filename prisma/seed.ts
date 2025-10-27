import { Type } from "../src/generated/prisma";
import { db } from "./db";

async function main() {
  // Step 1: Course
  const course = await db.course.upsert({
    where: { id: "353b6d90-7f3f-45c6-9795-f5f7f8fd5a46" },
    update: {},
    create: {
      title: "Next.js Mastery Course",
      description: "A complete guide to mastering Next.js.",
      duration: "6 weeks",
      language: "English",
    },
  });

  // Step 2: Curriculums
  const fundamentals = await db.curriculum.upsert({
    where: { id: "fundamentals-1" },
    update: {},
    create: {
      id: "fundamentals-1",
      title: "Fundamentals",
      period: "Week 1",
      courseId: course.id,
    },
  });

  const advanced = await db.curriculum.upsert({
    where: { id: "advanced-1" },
    update: {},
    create: {
      id: "advanced-1",
      title: "Advanced Topics",
      period: "Week 2",
      courseId: course.id,
    },
  });

  // Step 3: Lessons
  const lessonsFundamentals = [
    {
      name: "Introduction to Next.js",
      period: "Day 1",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=xWkozeculPo",
    },
    {
      name: "Routing & Links",
      period: "Day 2",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=O94ESaJtHtM",
    },
    {
      name: "CSR VS SSR",
      period: "Day 3",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=S5tjBqzs31w",
    },
    {
      name: "Next.js Layout",
      period: "Day 4",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=NK-8a8EzWrU",
    },
  ];

  const lessonsAdvanced = [
    {
      name: "Caching in Next.js",
      period: "Day 1",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=JhFrgQjc1p8",
    },
    {
      name: "Server Actions",
      period: "Day 2",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=O94ESaJtHtM",
    },
    { name: "Final Exam", period: "Day 3", type: Type.EXAM, url: "" },
    { name: "Course Overview", period: "Day 4", type: Type.PDF, url: "" },
  ];

  // Step 4: Replace lessons deterministically
  await replaceLessonsForCurriculum(
    fundamentals.id,
    course.id,
    lessonsFundamentals
  );
  await replaceLessonsForCurriculum(advanced.id, course.id, lessonsAdvanced);

  console.log("✅ Seeding completed successfully!");
}

// Helper: Reset and insert lessons in stable order
async function replaceLessonsForCurriculum(
  curriculumId: string,
  courseId: string,
  lessons: any[]
) {
  await db.lesson.deleteMany({ where: { curriculumId } }); // 🔥 Clear old lessons

  await db.$transaction(
    lessons.map((lesson, index) =>
      db.lesson.create({
        data: {
          ...lesson,
          order: index + 1, // ✅ Deterministic order
          courseId,
          curriculumId,
        },
      })
    )
  );
}

main()
  .catch((err) => {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
