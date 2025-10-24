"use server";
import { db } from "../../../prisma/db";
import { getCurrentUser } from "./userAction";

export async function getExamByCourseId(courseId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    // ✅ Find the exam for this course
    const exam = await db.exam.findFirst({
      where: { courseId },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    if (!exam) throw new Error("No exam found for this course");

    // ✅ Check if user already has a result record
    const existingResult = await db.examResult.findUnique({
      where: {
        userId_examId: {
          userId: user.id,
          examId: exam.id,
        },
      },
    });

    // ✅ If not, create a new result record
    if (!existingResult) {
      await db.examResult.create({
        data: {
          userId: user.id,
          examId: exam.id,
          score: 0, // initialize to 0 until submit
        },
      });
    }

    // ✅ Return minimal frontend data
    return {
      examId: exam.id,
      title: exam.title,
      questions: exam.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
        })),
      })),
    };
  } catch (error: any) {
    console.error("Error starting exam:", error);
    throw new Error(error.message || "Failed to start exam");
  }
}

// ✅ Fixed: no need to pass a full ExamResult object — just the score and rank
export async function submitExamAction({
  examId,
  answers,
}: {
  examId: string;
  answers: { questionId: string; selectedOptionId: string }[];
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // ✅ Get all questions for the exam, including the correct answers
  const questions = await db.examQuestion.findMany({
    where: { examId },
    select: {
      id: true,
      correctId: true,
    },
  });

  let correctCount = 0;

  // ✅ Compare submitted answers with correct answers
  for (const question of questions) {
    const userAnswer = answers.find((ans) => ans.questionId === question.id);

    if (userAnswer && userAnswer.selectedOptionId === question.correctId) {
      correctCount++;
    }
  }

  // ✅ Calculate score as a percentage
  const score = (correctCount / questions.length) * 100;

  // ✅ Update the existing exam result
  await db.examResult.update({
    where: {
      userId_examId: {
        userId: user.id,
        examId,
      },
    },
    data: {
      score,
    },
  });

  return {
    totalQuestions: questions.length,
    correctCount,
    score,
  };
}

export const checkIfAlreadyExammed = async (examId: string) => {
  try {
    // Get current logged-in user
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    // Check if exam result exists
    const result = await db.examResult.findUnique({
      where: {
        userId_examId: {
          userId: user.id,
          examId,
        },
      },
    });

    // Return a simple boolean or the full result object
    return !!result; // true = already exammed, false = not yet
  } catch (error) {
    console.error("Error checking exam status:", error);
    return false;
  }
};
