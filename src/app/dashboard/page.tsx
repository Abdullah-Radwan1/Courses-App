import CourseCurriculum from "@/components/Cirriculum";
import CommentsSection from "@/components/Comments";
import CourseMetadata from "@/components/CourseMetaData";
import VideoPlayer from "@/components/Video";
import { getCoursesAction } from "@/lib/actions/courseActions";
import { Card, CardContent } from "@/components/ui/card";

const page = async () => {
  const courses = await getCoursesAction();

  return (
    <div className="bg-background min-h-screen py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side: Video + Meta + Comments */}
          <section className="lg:col-span-2 space-y-8">
            <VideoPlayer />

            <Card>
              <CardContent className="p-6">
                <CourseMetadata course={courses[0]} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                {/* hardcoded */}
                <CommentsSection />
              </CardContent>
            </Card>
          </section>

          {/* Right Side: Curriculum */}
          <aside className="lg:col-span-1">
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
