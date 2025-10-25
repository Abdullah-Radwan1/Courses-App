"use client";

import { useState, useEffect } from "react";
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
import Loading from "@/app/loading";

interface ExamDialogProps {
  open: boolean;
  onClose: () => void;
  examData: Exam & {
    questions: (ExamQuestion & {
      options: ExamOption[];
    })[];
    examId: string;
  };
}

export default function ExamDialog({
  open,
  onClose,
  examData,
}: ExamDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [submitted, setSubmitted] = useState(false);
  // Countdown timer — just decreases time
  useEffect(() => {
    if (!open) return;

    setTimeLeft(600); // reset on open
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  // 🔥 Trigger submit only when timeLeft hits 0
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
      onClose();
    }
  }, [timeLeft]);

  if (examData == undefined) return <Loading />;
  const question = examData.questions[currentIndex];

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < examData.questions.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    if (submitted || !examData) return; // prevent multiple submits
    setSubmitted(true);

    const answers = examData.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: selectedOptions[q.id],
    }));

    try {
      const result = await submitExamAction({
        examId: examData.examId,
        answers,
      });
      await submitExamAction({
        examId: examData.examId,
        answers,
      });
      toast(`You scored ${result.score.toFixed(2)}%.`);
    } catch (error) {
      console.error("Exam submit failed", error);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose(); // only close manually
      }}
    >
      <DialogContent isExam={open} className="p-6 h-screen bg-blue-600  w-full">
        <DialogHeader className="mx-auto ">
          <VisuallyHidden>
            <DialogTitle className="text-white">{"Exam"}</DialogTitle>
          </VisuallyHidden>

          <div className="flex items-center  bg-amber-300 gap-2 rounded-xl py-2 px-8  text-white text-xl shadow-lg shadow-amber-300 font-semibold">
            <Clock className="w-5 h-5" />
            <span>
              {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}
              :{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </DialogHeader>

        <section>
          <div className="flex content-center justify-center m-4 gap-2">
            {examData.questions.map((_: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-full border  cursor-pointer",
                  idx === currentIndex
                    ? "bg-white  text-blue-600 "
                    : selectedOptions[examData.questions[idx].id]
                    ? "bg-blue-600 text-white border-accent"
                    : "border-muted bg-blue-600 text-white"
                )}
                onClick={() => setCurrentIndex(idx)}
              >
                {idx + 1}
              </div>
            ))}
          </div>
          {/* questions  */}
          <div className="p-4 border rounded-lg bg-card mb-4">
            <p className="font-medium mb-3">
              {currentIndex + 1}. {question.text}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {question.options.map((opt: any) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(question.id, opt.id)}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all",
                    selectedOptions[question.id] === opt.id
                      ? "border-primary bg-blue-500 text-white"
                      : "border-muted hover:border-primary/70 hover:bg-muted/50"
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
                className="bg-white text-black hover:bg-accent "
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
    </Dialog>
  );
}
