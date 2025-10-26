// page.tsx
import CourseCurriculum from "@/app/courses/components/curriculum/Curriculum";
import CommentsSection from "@/app/courses/components/comments/Comments";
import CourseMetadata from "@/app/courses/components/CourseMetaData";
import Video from "@/app/courses/components/Video";

import { getUserSpecificData } from "@/lib/actions/fullcoursedata";
import { getStaticCourseData } from "@/lib/actions/statcidata";
import { ScrollButton } from "../components/tabs/ScrollButton";
import LeaderboardPage from "../components/tabs/LeaderboardTab";
import { QuestionModal } from "../components/tabs/QuestionTab";
import { BookOpenCheck, MessageCircleMore } from "lucide-react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // ✅ Fetch cached static data (course, curriculum, exam)
  const { examData, course, curriculum, questionsData, comments, leaderboard } =
    await getStaticCourseData(id);

  // ✅ Fetch user-specific data (progress, lesson completion, comments, exam status)
  const { alreadyExamed, completedLessons } = await getUserSpecificData(
    id,
    examData.examId
  );
  const completedLessonIds = completedLessons.map((l) => l.lessonId);
  return (
    <div className="bg-background min-h-screen py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side: Video, Tabs, Metadata, Comments */}
          <section className="lg:col-span-2 space-y-8">
            <Video />
            {/* Tabs Buttons  */}
            <section>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Scroll buttons as client components */}
                <ScrollButton targetId="curriculum" icon={<BookOpenCheck />} />
                <LeaderboardPage leaderboard={leaderboard.leaderboard} />
                <QuestionModal
                  initialQuestions={questionsData.questionWithUser}
                  initialHasMore={questionsData.hasMore}
                  courseId={id}
                />
                <ScrollButton
                  targetId="comments"
                  icon={<MessageCircleMore />}
                />
              </div>
            </section>
            <CourseMetadata course={course} />
            <CommentsSection
              courseId={id}
              initialComments={comments.commentsWithUser}
              initialHasMore={comments.hasMore}
            />
          </section>
          {/* End Tabs Buttons */}
          {/* Right Side: Curriculum */}
          <aside id="curriculum" className="lg:col-span-1">
            <div className="sticky top-28">
              <CourseCurriculum
                alreadyExamed={alreadyExamed}
                ExamData={examData}
                curriculum={curriculum}
                completedLessonIds={completedLessonIds}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default page;
