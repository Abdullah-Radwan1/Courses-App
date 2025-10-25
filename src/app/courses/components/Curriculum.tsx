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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ExamWarningDialog from "./ExamComponents/ExamWarning";
import ExamDialog from "./ExamComponents/Examdialog";
import { Type } from "@/generated/prisma";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type LessonWithCompletion = {
  LessonCompletion: { completed: boolean }[];
  type: Type;
  name: string;
  id: string;
  period: string;
  completed?: boolean;
};

interface CurriculumWithLessons {
  id: string;
  title: string;
  period: string;
  Lessons: LessonWithCompletion[];
}

interface Props {
  curriculum: CurriculumWithLessons[];
  progress: number;
  ExamData: any;
}

const CourseCurriculum = ({ curriculum, progress, ExamData }: Props) => {
  const [openWeeks, setOpenWeeks] = useState<number[]>([0, 1]);
  const [localCurriculum, setLocalCurriculum] = useState(
    curriculum.map((week) => ({
      ...week,
      Lessons: week.Lessons.map((lesson) => ({
        ...lesson,
        completed:
          lesson.LessonCompletion.length > 0 &&
          lesson.LessonCompletion[0].completed,
      })),
    }))
  );

  // --- PDF Modal ---
  const [pdfOpen, setPdfOpen] = useState(false);

  // --- Exam States ---
  const [examWarningOpen, setExamWarningOpen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [selectedExamLessonId, setSelectedExamLessonId] = useState<
    string | null
  >(null);
  const [loadingExam, setLoadingExam] = useState(false);

  const toggleWeek = (index: number) => {
    setOpenWeeks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCompleteLesson = (lessonId: string, completed: boolean) => {
    if (completed) return;
    setLocalCurriculum((prev) =>
      prev.map((week) => ({
        ...week,
        Lessons: week.Lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: true } : l
        ),
      }))
    );
    toggleLessonCompletion(lessonId).catch(console.error);
  };
  console.log(examStarted);
  const handleLessonClick = (lesson: LessonWithCompletion) => {
    if (lesson.type === "PDF") {
      setPdfOpen(true);
    } else if (lesson.type === "EXAM") {
      setSelectedExamLessonId(lesson.id);
      setExamWarningOpen(true);
    }
  };

  const handleStartExam = () => {
    setLoadingExam(true);
    setTimeout(() => {
      setLoadingExam(false);
      setExamWarningOpen(false);
      setExamStarted(true);
    }, 800); // short delay for UX
  };

  if (!curriculum || curriculum.length === 0) return <p>No curriculum found</p>;
  console.log(ExamData);
  return (
    <div className="space-y-4 font-sans">
      {/* Progress Section */}
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-3">
          {/* Circular Progress with SVG */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary"
                strokeDasharray="100"
                strokeDashoffset={100 - progress}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {progress}%
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              Course Progress
            </p>
            <div>
              {" "}
              <p className="text-xs text-muted-foreground">
                {progress === 100
                  ? "lesgoooo💥🤖"
                  : progress > 50
                  ? "Almost there!!🤠"
                  : progress > 20
                  ? "Keep going!"
                  : "wAAAAke UUUuuupp😼"}
              </p>
            </div>
          </div>
        </div>

        {/* Progress percentage */}
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{progress}%</p>
          <p className="text-sm font-medium text-foreground">Course Progress</p>
        </div>
      </div>

      {/* --- Curriculum --- */}
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
                  className={`w-full flex items-center justify-end gap-3 py-3 px-3 rounded-lg transition-all hover:bg-primary/10 focus-visible:outline-ring ${
                    lesson.completed
                      ? "opacity-60 text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {lesson.type === "VIDEO" && (
                    <PlayCircle className="w-4 h-4 text-primary" />
                  )}
                  {lesson.type === "PDF" && (
                    <FileText
                      className="w-4 h-4 text-primary cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLessonClick(lesson);
                      }}
                    />
                  )}
                  {lesson.type === "EXAM" && (
                    <BookCheck
                      className="w-4 h-4 text-primary cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLessonClick(lesson);
                      }}
                    />
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

                  {lesson.type !== "PDF" &&
                    lesson.type !== "EXAM" &&
                    (lesson.completed ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle
                        className="w-4 h-4 cursor-pointer text-primary/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteLesson(lesson.id, lesson.completed);
                        }}
                      />
                    ))}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* --- PDF Modal --- */}
      <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
        <DialogContent isPDF={true} className="p-0 h-[90vh]">
          <VisuallyHidden>
            <DialogTitle>PDF Viewer</DialogTitle>
          </VisuallyHidden>
          <iframe src="/SA.pdf" className="w-full h-full" title="PDF Viewer" />
        </DialogContent>
      </Dialog>

      {/* --- Exam Warning Dialog --- */}
      {selectedExamLessonId && (
        <ExamWarningDialog
          open={examWarningOpen}
          loadingExam={loadingExam}
          onCancel={() => setExamWarningOpen(false)}
          onConfirm={handleStartExam}
        />
      )}

      {/* --- Exam Modal --- */}
      {examStarted && selectedExamLessonId && (
        <ExamDialog
          open={examStarted}
          onClose={() => setExamStarted(false)}
          examData={ExamData}
        />
      )}
    </div>
  );
};

export default CourseCurriculum;
