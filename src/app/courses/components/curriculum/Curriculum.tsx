"use client";

import { memo, useRef, useState } from "react";
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
import ProgressCircle from "../animatedCricle";
import dynamic from "next/dynamic";
import { LessonWithCompletion, Props } from "@/lib/types";
import { ExamWarningDialogRef } from "../dialoges/ExamWarning";
// Lazy load your modals
const PdfDialog = dynamic(() => import("../dialoges/PdfDialog"), {
  ssr: false,
});
const ExamWarningDialog = dynamic(() => import("../dialoges/ExamWarning"), {
  ssr: false,
});

const LessonIcon = memo(({ lesson }: { lesson: LessonWithCompletion }) => {
  switch (lesson.type) {
    case "VIDEO":
      return <PlayCircle className="w-4 h-4 text-primary" />;
    case "PDF":
      return <FileText className="w-4 h-4 text-primary cursor-pointer" />;
    case "EXAM":
      return <BookCheck className="w-4 h-4 text-primary cursor-pointer" />;
    default:
      return null;
  }
});
LessonIcon.displayName = "LessonIcon";
const CompletionIcon = memo(
  ({
    lesson,
    alreadyExamed,
    onClick,
  }: {
    lesson: LessonWithCompletion;
    alreadyExamed: boolean;
    onClick: () => void;
  }) => {
    if (lesson.type === "PDF") return null;

    return lesson.completed || (lesson.type === "EXAM" && alreadyExamed) ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <Circle
        className="w-4 h-4 cursor-pointer text-primary/70"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      />
    );
  }
);
CompletionIcon.displayName = "CompletionIcon";
const CourseCurriculum = ({
  curriculum,
  alreadyExamed,
  completedLessonIds,
  courseId,
}: Props) => {
  const [openWeeks, setOpenWeeks] = useState<number[]>([0, 1]);
  const [localCurriculum, setLocalCurriculum] = useState(
    curriculum.map((week) => ({
      ...week,
      Lessons: week.Lessons.map((lesson) => ({
        ...lesson,
        completed: completedLessonIds.includes(lesson.id),
      })),
    }))
  );

  const [pdfOpen, setPdfOpen] = useState(false);
  const examDialogRef = useRef<ExamWarningDialogRef>(null);

  const toggleWeek = (index: number) =>
    setOpenWeeks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );

  const handleCompleteLesson = async (lessonId: string, completed: boolean) => {
    if (completed) return;
    setLocalCurriculum((prev) =>
      prev.map((week) => ({
        ...week,
        Lessons: week.Lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: true } : l
        ),
      }))
    );
    toggleLessonCompletion(lessonId);
  };
  const handleLessonClick = (lesson: LessonWithCompletion) => {
    // Update query params without refreshing
    const params = new URLSearchParams(window.location.search);
    params.set("url", lesson.url);
    console.log(lesson);
    // This updates the URL without reloading the page
    window.history.replaceState(null, "", `?${params.toString()}`);
    if (lesson.type === "EXAM" && alreadyExamed === true) return;

    if (lesson.type === "PDF") {
      setPdfOpen(true);
    } else if (lesson.type === "EXAM" && !alreadyExamed) {
      examDialogRef.current?.openDialog(courseId);
    }
  };

  //optimistic progress count
  const completedLessonsCount = localCurriculum.reduce(
    (sum, week) =>
      sum +
      week.Lessons.filter((l) => l.completed && l.type === "VIDEO").length,
    0
  );

  const totalLessonsCount = localCurriculum.reduce(
    (sum, week) => sum + week.Lessons.filter((l) => l.type === "VIDEO").length,
    0
  );

  const dynamicProgress =
    totalLessonsCount === 0
      ? 0
      : Number(((completedLessonsCount / totalLessonsCount) * 100).toFixed(2));
  return (
    <div className="space-y-4 font-sans">
      {/* Progress Section */}
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-3">
          <ProgressCircle progress={dynamicProgress} />
          <div>
            <p className="text-sm font-medium text-foreground">
              Course Progress
            </p>
            <p className="text-xs text-muted-foreground">
              {dynamicProgress === 100
                ? "lesgoooo💥🤖"
                : dynamicProgress > 50
                ? "Almost there!!🤠"
                : dynamicProgress > 15
                ? "Keep going! 😚"
                : "wAAAAke UUUuuupp 😼"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{dynamicProgress}%</p>
          <p className="text-sm font-medium text-foreground">Course Progress</p>
        </div>
      </div>
      {/* Curriculum */}
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
              {openWeeks.includes(index) ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pb-3 pt-1 space-y-2">
              {week.Lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`w-full hover:cursor-pointer flex items-center justify-end gap-3 py-3 px-3 rounded-lg transition-all hover:bg-primary/10 focus-visible:outline-ring ${
                    lesson.completed
                      ? "opacity-60 text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  <LessonIcon lesson={lesson} />
                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm ${
                        lesson.completed && "line-through text-muted-foreground"
                      }`}
                    >
                      {lesson.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {lesson.period}
                    </p>
                  </div>

                  <CompletionIcon
                    lesson={lesson}
                    alreadyExamed={alreadyExamed}
                    onClick={() =>
                      handleCompleteLesson(lesson.id, lesson.completed ?? false)
                    }
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      {/* PDF Modal */}
      <PdfDialog src="/SA.pdf" open={pdfOpen} onOpenChange={setPdfOpen} />
      {/* Exam Warning */}
      <ExamWarningDialog ref={examDialogRef} />
    </div>
  );
};

export default CourseCurriculum;
