"use server";

import { db } from "../../../prisma/db";

import { getCurrentUser, isUserEnrolled } from "./userAction";

// ✅ enroll action
export async function enrollInCourse(courseId: string) {
  const user = await getCurrentUser();
  //hard coded
  const already = await isUserEnrolled("9800eaa7-861b-4141-8752-dc2505826e5d");
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
