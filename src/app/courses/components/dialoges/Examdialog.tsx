"use client";

import { useState, useCallback, memo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitExamAction } from "@/lib/actions/examActions";
import { Exam, ExamOption, ExamQuestion } from "@/generated/prisma";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Confetti from "react-confetti-boom";

interface ExamDialogProps {
  open: boolean;
  onClose: () => void;
  examData: Exam & {
    questions: (ExamQuestion & { options: ExamOption[] })[];
    examId: string;
  };
}

const Timer = memo(({ timeLeft }: { timeLeft: number }) => {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 rounded-xl py-2 px-6 bg-primary text-primary-foreground text-lg font-semibold shadow-md">
      <Clock className="w-5 h-5" />
      <span>
        {minutes}:{seconds}
      </span>
    </div>
  );
});
Timer.displayName = "Timer";

export default function ExamDialog({
  open,
  onClose,
  examData,
}: ExamDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const question = examData.questions[currentIndex];

  const handleSelectOption = useCallback(
    (questionId: string, optionId: string) => {
      setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
    },
    []
  );

  const handleNext = () => {
    if (currentIndex < examData.questions.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = useCallback(async () => {
    if (submitted || !examData) return;
    setSubmitted(true);

    const answers = examData.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: selectedOptions[q.id],
    }));

    try {
      const { score } = await submitExamAction({
        examId: examData.examId,
        answers,
        courseId: examData.courseId,
      });
      setShowConfetti(true);
      toast.success(`Congratulations! Your score is ${score}%`);
    } catch (error) {
      toast.error("Exam submission failed.");
      console.error("Exam submit failed", error);
    }

    onClose();
  }, [submitted, examData, selectedOptions, onClose]);
  useEffect(() => {
    if (!open || submitted) return; // don't start if dialog is closed or exam submitted

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // auto-submit when timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount or dialog close
  }, [open, submitted, handleSubmit]);
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        isExam={open}
        className="p-6 h-screen w-full bg-background text-foreground border-none"
      >
        <DialogHeader className="mx-auto mb-4">
          <VisuallyHidden>
            <DialogTitle>Exam</DialogTitle>
          </VisuallyHidden>
          <Timer timeLeft={timeLeft} />
        </DialogHeader>

        <section>
          {/* Question Navigator */}
          <div className="flex justify-center flex-wrap gap-2 mb-6">
            {examData.questions.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium transition-colors",
                  idx === currentIndex
                    ? "bg-primary text-primary-foreground border-primary"
                    : selectedOptions[examData.questions[idx].id]
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Question Card */}
          <div className="p-4 card mb-4 transition-all duration-300">
            <p className="font-medium mb-4">
              {currentIndex + 1}. {question.text}
            </p>
            <div className="grid gap-3">
              {question.options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(question.id, opt.id)}
                  className={cn(
                    "p-3 rounded-lg border transition-colors cursor-pointer",
                    selectedOptions[question.id] === opt.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted border-border"
                  )}
                >
                  {opt.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <div className="space-x-2">
            {currentIndex < examData.questions.length - 1 && (
              <Button
                variant="secondary"
                onClick={handleNext}
                disabled={!selectedOptions[question.id]}
              >
                Next
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={submitted}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-start justify-center pt-10">
          <Confetti mode="boom" particleCount={200} />
        </div>
      )}
    </Dialog>
  );
}
