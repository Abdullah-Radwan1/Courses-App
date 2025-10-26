import { Type } from "@/generated/prisma";
import { db } from "./db";

async function main() {
  // ✅ Step 1: Create or find the course
  const course = await db.course.upsert({
    where: { id: "353b6d90-7f3f-45c6-9795-f5f7f8fd5a46" },
    update: {},
    create: {
      title: "Next.js Mastery Course",
      description:
        "A complete guide to mastering Next.js from fundamentals to advanced topics.",
      duration: "6 weeks",
      language: "English",
    },
  });

  // ✅ Step 2: Create or find the curriculums
  const fundamentals = await db.curriculum.upsert({
    where: { id: "fundamentals-1" }, // use a fake ID for deterministic seeding
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

  // ✅ Step 3: Define lesson data
  const lessonsFundamentals = [
    {
      name: "Introduction to Next.js",
      period: "Day 1",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=1",
      curriculumId: fundamentals.id,
    },
    {
      name: "Setting up the environment",
      period: "Day 2",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=2",
      curriculumId: fundamentals.id,
    },
    {
      name: "Your first Next.js page",
      period: "Day 3",
      type: Type.PDF,
      url: "/pdfs/lesson1.pdf",
      curriculumId: fundamentals.id,
    },
  ];

  const lessonsAdvanced = [
    {
      name: "API Routes Deep Dive",
      period: "Day 1",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=3",
      curriculumId: advanced.id,
    },
    {
      name: "Server Components in Next.js",
      period: "Day 2",
      type: Type.VIDEO,
      url: "https://www.youtube.com/watch?v=4",
      curriculumId: advanced.id,
    },
    {
      name: "Final Exam",
      period: "Day 3",
      type: Type.EXAM,
      url: "/exam/final",
      curriculumId: advanced.id,
    },
  ];

  // ✅ Step 4: Upsert lessons concurrently
  await Promise.all([
    ...lessonsFundamentals.map((lesson) =>
      upsertLessonByAttrs({ ...lesson, courseId: course.id })
    ),
    ...lessonsAdvanced.map((lesson) =>
      upsertLessonByAttrs({ ...lesson, courseId: course.id })
    ),
  ]);

  console.log("✅ Seeding completed successfully!");
}

// ✅ Helper function: Find or create lesson
async function upsertLessonByAttrs({
  name,
  period,
  type,
  url,
  courseId,
  curriculumId,
}: {
  name: string;
  period: string;
  type: Type;
  url: string;
  courseId: string;
  curriculumId: string;
}) {
  const existing = await db.lesson.findFirst({
    where: { name, period, courseId, curriculumId },
  });

  if (existing) {
    return db.lesson.update({
      where: { id: existing.id },
      data: { name, period, type, url },
    });
  }

  return db.lesson.create({
    data: { name, period, type, url, courseId, curriculumId },
  });
}

main()
  .catch((err) => {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
