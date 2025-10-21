import { db } from "./db"; // adjust path if needed

async function main() {
  // 1. Create an exam
  const exam = await db.exam.create({
    data: {
      title: "Introduction to Next.js",
      course: {
        connect: { id: "9800eaa7-861b-4141-8752-dc2505826e5d" }, // replace with a real courseId
      },
    },
  });

  console.log("Exam created:", exam.id);

  // 2. Create 4 questions for the exam
  const questionsData = [
    "What is Next.js primarily used for?",
    "Which rendering methods does Next.js support?",
    "What command starts a Next.js development server?",
    "Which file is used for routing pages in Next.js?",
  ];

  const questions = [];
  for (const text of questionsData) {
    const q = await db.examQuestion.create({
      data: { text, examId: exam.id },
    });
    questions.push(q);
  }

  console.log("Questions created");

  // 3. Create options for each question
  const optionsData = [
    ["Frontend Framework", "Backend Framework", "Database", "CSS Library"],
    ["SSR", "SSG", "ISR", "CSR"],
    ["npm start", "npm run dev", "next build", "next generate"],
    ["_app.tsx", "index.tsx", "pages directory", "components directory"],
  ];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const opts = optionsData[i].map((text) => ({ text, questionId: q.id }));
    await db.examOption.createMany({ data: opts });
  }

  console.log("Options created");

  // 4. Set correct answers
  const correctAnswers = [
    "Frontend Framework",
    "SSR",
    "npm run dev",
    "pages directory",
  ];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const correctOption = await db.examOption.findFirst({
      where: { questionId: q.id, text: correctAnswers[i] },
    });
    await db.examQuestion.update({
      where: { id: q.id },
      data: { correctId: correctOption?.id },
    });
  }

  console.log("Correct answers set");
}

main()
  .then(() => {
    console.log("Seeding finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
