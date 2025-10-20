"use server";

import { db } from "../../../prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";

// ✅ shared helper to get the logged-in user
async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("You must be logged in.");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

// ✅ check if enrolled
export async function isUserEnrolled() {
  const user = await getCurrentUser();
  //hard coded
  const existing = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: "9800eaa7-861b-4141-8752-dc2505826e5d",
      },
    },
  });

  return !!existing; // returns true or false
}

// ✅ enroll action
export async function enrollInCourse() {
  const user = await getCurrentUser();

  const already = await isUserEnrolled();
  if (already) {
    return { message: "Already enrolled in this course." };
  }
  //hard coded
  await db.enrollment.create({
    data: {
      userId: user.id,
      courseId: "9800eaa7-861b-4141-8752-dc2505826e5d",
    },
  });

  return { message: "Enrollment successful!" };
}
