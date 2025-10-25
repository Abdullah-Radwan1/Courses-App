import { Clock, BookOpen, Users, Globe, UserStar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Prisma } from "@/generated/prisma";
import { cn } from "@/lib/utils";

// ✅ Define CourseWithCounts type — ensure optional fields are included as string | null
type CourseWithCounts = Prisma.CourseGetPayload<{
  select: {
    instructor: true;
    duration: true;
    language: true;
    _count: {
      select: {
        lessons: true;
        enrollments: true;
      };
    };
  };
}>;

// ✅ Component
const CourseMetadata = ({ course }: { course: CourseWithCounts }) => {
  const { duration, language, instructor, _count } = course;

  // ✅ Provide safe display values
  const metadata = [
    {
      icon: Clock,
      label: "Duration",
      value: duration ?? "Not specified",
    },
    {
      icon: BookOpen,
      label: "Lessons",
      value: `${_count.lessons} ${_count.lessons === 1 ? "lesson" : "lessons"}`,
    },
    {
      icon: Users,
      label: "Students",
      value: `${_count.enrollments} ${
        _count.enrollments === 1 ? "student" : "students"
      }`,
    },
    {
      icon: Globe,
      label: "Language",
      value: language ?? "Not specified",
    },
    {
      icon: UserStar,
      label: "Instructor",
      value: instructor ?? "Unknown instructor",
    },
  ];

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Course Details</CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="divide-y divide-border grid md:grid-cols-2 grid-cols-1 gap-x-30 gap-2">
          {metadata.map(({ icon: Icon, label, value }, index) => (
            <div
              key={label}
              className={cn(
                "flex items-center justify-between gap-3 p-3 transition-colors duration-200 hover:bg-accent/5",
                index === metadata.length - 1 && "border-b-0"
              )}
            >
              {/* Icon + Label */}
              <div className="flex gap-2 items-center">
                <Icon className="text-primary" />
                <h6>{label}</h6>
              </div>

              {/* Value */}
              <div className="flex justify-between">
                <span className="text-sm font-semibold truncate" title={value}>
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseMetadata;
