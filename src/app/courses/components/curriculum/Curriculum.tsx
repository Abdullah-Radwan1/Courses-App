"use client";

import { memo, useState } from "react";
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
import ProgressCircle from "../animatedCricle";
import dynamic from "next/dynamic";
// Lazy load your modals
const PdfDialog = dynamic(() => import("../dialoges/PdfDialog"), {
  ssr: false,
});
const ExamWarningDialog = dynamic(() => import("../dialoges/ExamWarning"), {
  ssr: false,
});
const ExamDialog = dynamic(() => import("../dialoges/Examdialog"), {
  ssr: false,
});
type LessonWithCompletion = {
  LessonCompletion?: { completed: boolean }[]; // optional now
  type: Type;
  name: string;
  id: string;
  period: string;
  url: string;
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
  ExamData: any;
  alreadyExamed: boolean;
  completedLessonIds: string[];
}

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

// const ProgressCircle = ({ progress }: { progress: number }) => (
//   <div className="animate-accordion-up relative w-14 h-14">
//     <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
//       <circle
//         cx="18"
//         cy="18"
//         r="15.9155"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         className="text-muted"
//       />
//       <circle
//         cx="18"
//         cy="18"
//         r="15.9155"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         className="text-primary"
//         strokeDasharray="100"
//         strokeDashoffset={100 - progress}
//       />
//     </svg>
//     <div className="absolute inset-0 flex items-center justify-center">
//       <span className="text-xs font-semibold text-primary">{progress}%</span>
//     </div>
//   </div>
// );

const CourseCurriculum = ({
  curriculum,
  ExamData,
  alreadyExamed,
  completedLessonIds,
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

  const [modals, setModals] = useState({
    pdf: false,
    examWarning: false,
    examStarted: false,
    selectedExamLessonId: null as string | null,
    loadingExam: false,
  });

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

    if (lesson.type === "PDF") setModals((p) => ({ ...p, pdf: true }));
    else if (lesson.type === "EXAM")
      setModals((p) => ({
        ...p,
        selectedExamLessonId: lesson.id,
        examWarning: true,
      }));
  };

  const handleStartExam = () => {
    setModals((p) => ({ ...p, loadingExam: true }));
    setTimeout(() => {
      setModals((p) => ({
        ...p,
        loadingExam: false,
        examWarning: false,
        examStarted: true,
      }));
    }, 800);
  };

  const LessonRow = memo(
    ({ lesson, alreadyExamed, onLessonClick, onCompleteClick }: any) => {
      return (
        <div
          key={lesson.id}
          onClick={onLessonClick}
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
            <p className="text-[10px] text-muted-foreground">{lesson.period}</p>
          </div>
          <CompletionIcon
            lesson={lesson}
            alreadyExamed={alreadyExamed}
            onClick={onCompleteClick}
          />
        </div>
      );
    }
  );

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
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  alreadyExamed={alreadyExamed}
                  onLessonClick={() => handleLessonClick(lesson)}
                  onCompleteClick={() =>
                    handleCompleteLesson(lesson.id, lesson.completed)
                  }
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* PDF Modal */}

      <PdfDialog
        src="/SA.pdf"
        open={modals.pdf}
        onOpenChange={(v) => setModals((p) => ({ ...p, pdf: v }))}
      />

      {/* Exam Warning */}

      <ExamWarningDialog
        open={modals.examWarning}
        loadingExam={modals.loadingExam}
        onCancel={() => setModals((p) => ({ ...p, examWarning: false }))}
        onConfirm={handleStartExam}
      />

      {/* Exam Modal */}
      <ExamDialog
        open={modals.examStarted}
        onClose={() => setModals((p) => ({ ...p, examStarted: false }))}
        examData={ExamData}
        lessonId={modals.selectedExamLessonId!}
      />
    </div>
  );
};

export default CourseCurriculum;
