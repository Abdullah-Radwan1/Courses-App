import CourseCurriculum from "@/components/Cirriculum";
import CommentsSection from "@/components/Comments";
import CourseMetadata from "@/components/CourseMetaData";
import VideoPlayer from "@/components/Video";
import { getCourses } from "@/lib/actions/courseActions";
import { BookOpen } from "lucide-react";

const page = async () => {
  const courses = await getCourses();
  console.log(courses);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5ff] via-white to-[#faf8ff]">
      {/* ===== Main Content ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* === Left Side: Video + Meta + Comments === */}
          <section className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(147,51,234,0.05)] border border-primary/10">
              <VideoPlayer />
            </div>
            <div className="rounded-2xl shadow-[0_4px_20px_rgba(147,51,234,0.05)] border border-primary/10 bg-white">
              <CourseMetadata course={courses[0]} />
            </div>
            <div className="rounded-2xl shadow-[0_4px_20px_rgba(147,51,234,0.05)] border border-primary/10 bg-white">
              <CommentsSection courseId="0d998d73-f549-4a63-b465-6f74bb69b227" />
            </div>
          </section>

          {/* === Right Side: Curriculum === */}
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
