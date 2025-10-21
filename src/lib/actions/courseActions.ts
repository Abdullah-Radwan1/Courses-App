import { cache } from "react";
import { db } from "../../../prisma/db";

export const getCoursesAction = cache(async () => {
  return db.course.findMany({
    include: {
      lessons: true,
      comments: true,
      progress: true,
      _count: { select: { enrollments: true } },
    },
  });
});
