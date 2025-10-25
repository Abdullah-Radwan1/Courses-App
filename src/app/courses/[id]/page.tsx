// page.tsx
import CourseCurriculum from "@/app/courses/components/Curriculum";
import CommentsSection from "@/app/courses/components/comments/Comments";
import CourseMetadata from "@/app/courses/components/CourseMetaData";
import VideoPlayer from "@/components/Video";
import {
  getCoursesAction,
  getCourseCurriculum,
  getCourseProgress,
} from "@/lib/actions/courseActions";
import AllTabs from "@/app/courses/components/AllTabs";
import { getCommentsByCourseAction } from "@/lib/actions/commentsAction";
import { getExamByCourseId } from "@/lib/actions/examActions";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const course = await getCoursesAction(id);
  const commentsData = await getCommentsByCourseAction({
    courseId: id,
    page: 1,
    take: 3,
  });
  // ✅ fetch curriculum here on the server
  const courseData = await getCourseCurriculum(id);
  const progress = await getCourseProgress(id);
  const ExamData = await getExamByCourseId(id);
  console.log(ExamData);
  if (!course) {
    return <p>Course not found</p>; // أو صفحة خطأ مناسبة
  }
  return (
    <div className="bg-background min-h-screen py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side: Video + Meta + Comments */}
          <section className="lg:col-span-2 space-y-8">
            <VideoPlayer />
            <AllTabs courseId={id} />
            <CourseMetadata course={course} />
            <CommentsSection
              courseId={id}
              initialComments={commentsData.comments}
              initialHasMore={commentsData.hasMore}
            />
          </section>

          {/* Right Side: Curriculum */}
          <aside id="curriculum" className="lg:col-span-1">
            <div className="sticky top-28">
              <CourseCurriculum
                ExamData={ExamData}
                progress={progress}
                curriculum={courseData?.curriculums || []}
              />{" "}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default page;
