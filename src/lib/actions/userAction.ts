import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";
import { db } from "../../../prisma/db";

// ✅ shared helper to get the logged-in user
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    throw new Error("You must be logged in.");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
    }, // ✅ only return safe fields
  });

  if (!user) {
    throw new Error("User not found.");
  }
  return user;
}

// ✅ check if enrolled
export async function isUserEnrolled(courseId: string) {
  const user = await getCurrentUser();

  const existing = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
  });

  return !!existing; // returns true or false
}
