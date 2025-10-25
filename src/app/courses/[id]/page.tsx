// page.tsx
import CourseCurriculum from "@/app/courses/components/Curriculum";
import CommentsSection from "@/app/courses/components/comments/Comments";
import CourseMetadata from "@/app/courses/components/CourseMetaData";
import VideoPlayer from "@/components/Video";
import AllTabs from "@/app/courses/components/tabs/AllTabs";

import { getUserSpecificData } from "@/lib/actions/fullcoursedata";
import { getStaticCourseData } from "@/lib/actions/statcidata";
import { getCommentsByCourseAction } from "@/lib/actions/commentsAction";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // ✅ Get current user

  // ✅ Fetch cached static data (course, curriculum, exam)
  const { examData, course, curriculum } = await getStaticCourseData(id);

  // ✅ Fetch user-specific data (progress, lesson completion, comments, exam status)
  const { alreadyExamed, completedLessons, progress } =
    await getUserSpecificData(id, examData.examId);

  const completedLessonIds = completedLessons.map((l) => l.lessonId);
  const take = 3;
  const page = 1;
  const { comments, hasMore } = await getCommentsByCourseAction({
    courseId: id,
    page,
    take,
  });
  return (
    <div className="bg-background min-h-screen py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side: Video, Tabs, Metadata, Comments */}
          <section className="lg:col-span-2 space-y-8">
            <VideoPlayer />
            <AllTabs courseId={id} />
            <CourseMetadata course={course} />
            <CommentsSection
              courseId={id}
              initialComments={comments}
              initialHasMore={hasMore}
            />
          </section>

          {/* Right Side: Curriculum */}
          <aside id="curriculum" className="lg:col-span-1">
            <div className="sticky top-28">
              <CourseCurriculum
                alreadyExamed={alreadyExamed}
                ExamData={examData}
                progress={progress}
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
