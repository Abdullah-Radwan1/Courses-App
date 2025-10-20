import { Clock, BookOpen, Users, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getCourses } from "@/lib/actions/courseActions";
import { Course } from "@/generated/prisma";

const CourseMetadata = ({ course }: { course: any }) => {
  // Fetch all courses
  const { duration, language, lessons, _count } = course;

  // 🧩 Destructure dynamic metadata

  const metadata = [
    { icon: Clock, label: "Duration", value: duration },
    { icon: BookOpen, label: "Lessons", value: `${lessons.length} lessons` },
    { icon: Users, label: "Students", value: `${_count.enrollments}` },
    { icon: Globe, label: "Language", value: language },
  ];

  return (
    <Card className="p-6 border border-border bg-card text-card-foreground rounded-xl shadow-sm">
      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold mb-4">
        Course Material
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metadata.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted hover:bg-accent/40 transition-all duration-200"
          >
            {/* Icon Circle */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-primary/10 to-accent/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>

            {/* Label + Value */}
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CourseMetadata;
