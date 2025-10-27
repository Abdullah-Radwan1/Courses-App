import { Comment, Question, Type, User } from "@/generated/prisma";

export type LeaderboardResult = {
  score: number;
  rank: number | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type CommentWithUser = Comment & {
  user: Pick<User, "name">; // or include whatever user fields you need
};

export type QuestionWithUser = Question & {
  user: Pick<User, "name">; // or include whatever user fields you need
};
export type QuestionModalProps = {
  initialQuestions: QuestionWithUser[];
  initialHasMore: boolean;
  courseId: string;
};

export type LessonWithCompletion = {
  LessonCompletion?: { completed: boolean }[]; // optional now
  type: Type;
  name: string;
  id: string;
  period: string;
  url: string;
  completed?: boolean;
};

export interface CurriculumWithLessons {
  id: string;
  title: string;
  period: string;
  Lessons: LessonWithCompletion[];
}

export interface Props {
  curriculum: CurriculumWithLessons[];
  alreadyExamed: boolean;
  completedLessonIds: string[];
  courseId: string;
}
