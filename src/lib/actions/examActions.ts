"use server";

import { db } from "../../../prisma/db";
import { getCurrentUser } from "./userAction";

export async function startExamAction(courseId: string) {
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
export async function createExamResult({
  examId,
  score,
  rank,
}: {
  examId: string;
  score: number;
  rank?: number;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const updated = await db.examResult.update({
    where: {
      userId_examId: {
        userId: user.id,
        examId,
      },
    },
    data: {
      score,
      rank: rank ?? null,
    },
  });

  return {
    ExamScore: updated.score,
    Rank: updated.rank,
  };
}
