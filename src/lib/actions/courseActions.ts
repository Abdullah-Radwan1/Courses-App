import { cache } from "react";
import { db } from "../../../prisma/db";

export const getCoursesAction = cache(async () => {
  return db.course.findMany({
    select: {
      instructor: true,
      duration: true,
      language: true,
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
  });
});
