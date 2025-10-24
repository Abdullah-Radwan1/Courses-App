"use server";

import { db } from "../../../prisma/db";

import { getCurrentUser, isUserEnrolled } from "./userAction";

// ✅ enroll action
export async function enrollInCourse(courseId: string) {
  const user = await getCurrentUser();
  const already = await isUserEnrolled(courseId);
  if (already) {
    return { message: "Already enrolled in this course." };
  }

  await db.enrollment.create({
    data: {
      userId: user.id,
      courseId,
    },
  });

  return { message: "Enrollment successful!" };
}
