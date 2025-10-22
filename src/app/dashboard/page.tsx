import CourseCurriculum from "@/app/dashboard/components/Cirriculum";
import CommentsSection from "@/app/dashboard/components/Comments";
import CourseMetadata from "@/app/dashboard/components/CourseMetaData";
import VideoPlayer from "@/components/Video";
import { getCoursesAction } from "@/lib/actions/courseActions";
import AllTabs from "@/app/dashboard/components/AllTabs";

const page = async () => {
  const course = await getCoursesAction();
  return (
    <div className="bg-background min-h-screen py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side: Video + Meta + Comments */}
          <section className="lg:col-span-2 space-y-8">
            <VideoPlayer />
            <AllTabs />

            <CourseMetadata course={course[0]} />

            {/* comments  */}

            <CommentsSection />
          </section>

          {/* Right Side: Curriculum */}
          <aside id="cirriculm" className="lg:col-span-1">
            <div className="sticky top-28">
              <CourseCurriculum />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default page;
