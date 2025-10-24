"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  BookCheck,
  Check,
  Circle,
} from "lucide-react";
import { toggleLessonCompletion } from "@/lib/actions/courseActions";
import { Type } from "@/generated/prisma";
type LessonWithCompletion = {
  LessonCompletion: { completed: boolean }[];
  type: Type;
  name: string;
  id: string;
  period: string;
  completed?: boolean; // للأوبتيمستيك
};

interface CurriculumWithLessons {
  id: string;
  title: string;
  period: string;
  Lessons: LessonWithCompletion[];
}

interface Props {
  curriculum: CurriculumWithLessons[];
}

const CourseCurriculum = ({ curriculum }: Props) => {
  const [openWeeks, setOpenWeeks] = useState<number[]>([]);
  const [localCurriculum, setLocalCurriculum] = useState(
    curriculum.map((week) => ({
      ...week,
      Lessons: week.Lessons.map((lesson) => ({
        ...lesson,
        completed:
          lesson.LessonCompletion.length > 0 &&
          lesson.LessonCompletion[0].completed, // assumes 1 per user
      })),
    }))
  );

  const toggleWeek = (index: number) => {
    setOpenWeeks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCompleteLesson = (lessonId: string, completed: boolean) => {
    if (completed) return;

    // Optimistic UI
    setLocalCurriculum((prev) =>
      prev.map((week) => ({
        ...week,
        Lessons: week.Lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: true } : l
        ),
      }))
    );

    toggleLessonCompletion(lessonId).catch((err) => {
      console.error("Failed to update lesson completion", err);
    });
  };

  if (!curriculum || curriculum.length === 0)
    return <p className="text-muted-foreground">No curriculum found</p>;

  return (
    <div className="space-y-4 font-sans">
      {localCurriculum.map((week, index) => (
        <Collapsible
          key={week.id}
          open={openWeeks.includes(index)}
          onOpenChange={() => toggleWeek(index)}
          className="border px-3 border-border rounded-xl overflow-hidden bg-card hover:bg-card/90 transition-all shadow-sm"
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-primary text-sm">
                  {week.title}
                </p>
                <p className="text-xs text-muted-foreground">{week.period}</p>
              </div>
              {openWeeks.includes(index) ? (
                <ChevronUp className="text-primary" />
              ) : (
                <ChevronDown className="text-primary" />
              )}
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="pb-3 pt-1 space-y-2">
              {week.Lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`w-full flex items-center justify-end gap-3 py-3 px-3 rounded-lg transition-all hover:bg-primary/10 focus-visible:outline-ring ${
                    lesson.completed
                      ? "opacity-60 text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {lesson.type === "VIDEO" ? (
                    <PlayCircle className="w-4 h-4 text-primary" />
                  ) : lesson.type === "PDF" ? (
                    <FileText className="w-4 h-4 text-primary" />
                  ) : (
                    <BookCheck className="w-4 h-4 text-primary" />
                  )}

                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm ${
                        lesson.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {lesson.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {lesson.period}
                    </p>
                  </div>

                  {lesson.completed ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle
                      className="w-4 h-4 cursor-pointer text-primary/70"
                      onClick={(e) => {
                        e.stopPropagation(); // يمنع collapse toggle
                        handleCompleteLesson(lesson.id, lesson.completed);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default CourseCurriculum;
