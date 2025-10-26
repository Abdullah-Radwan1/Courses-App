"use server";
import { cache } from "react";
import { db } from "../../../prisma/db";
import { getCurrentUser } from "./userAction";
import { revalidatePath } from "next/cache";
import { Type } from "@/generated/prisma";

// server action

export async function toggleLessonCompletion(lessonId: string) {
  try {
    // Check if completion already exists
    const { id } = await getCurrentUser();

    return await db.lessonCompletion.upsert({
      where: {
        userId_lessonId: { userId: id, lessonId }, // composite unique constraint
      },
      update: { completed: true }, // mark as completed
      create: {
        userId: id,
        lessonId,
        completed: true, // default value when creating
      },
    });
  } catch (error) {
    console.error("Error toggling lesson completion:", error);
    throw new Error("Failed to update lesson completion");
  }
}
