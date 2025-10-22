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
import { createExamResult } from "@/lib/actions/examActions";
import { Exam, ExamOption, ExamQuestion } from "@/generated/prisma";

interface ExamDialogProps {
  open: boolean;
  onClose: () => void;
  examData: Exam & {
    questions: (ExamQuestion & {
      options: ExamOption[];
    })[];
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
  const [examResult, setexamResult] = useState<number | null>(0);
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
      // handleSubmit();
    }
  }, [timeLeft]);

  if (!examData) return null;

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

    let score = 0;
    examData.questions.forEach((q: any) => {
      const selected = selectedOptions[q.id];
      if (selected && selected === q.correctId) score += 1;
    });

    const percentage = (score / examData.questions.length) * 100;

    try {
      await createExamResult({
        examId: examData.id,
        rank: 0,
        score: percentage,
      });
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
      <DialogContent className="p-6 max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>{examData.title || "Exam"}</DialogTitle>
        </DialogHeader>

        {/* Top Bar: Timer + Question Numbers */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Clock className="w-5 h-5" />
            <span>
              {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}
              :{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <div className="flex gap-2">
            {examData.questions.map((_: any, idx: number) => (
              <div
                key={idx}
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-full border text-xs cursor-pointer",
                  idx === currentIndex
                    ? "bg-primary text-primary-foreground border-primary"
                    : selectedOptions[examData.questions[idx].id]
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-muted text-muted-foreground"
                )}
                onClick={() => setCurrentIndex(idx)}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Question Slide */}
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
                    ? "border-primary bg-primary/20"
                    : "border-muted hover:border-primary/70 hover:bg-muted/50"
                )}
              >
                {opt.text}
              </div>
            ))}
          </div>
        </div>

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
