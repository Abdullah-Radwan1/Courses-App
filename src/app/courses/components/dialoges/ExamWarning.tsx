"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getExamByCourseId } from "@/lib/actions/examActions";
import ExamDialog from "./Examdialog";
import { Exam, ExamOption, ExamQuestion } from "@/generated/prisma";

export interface ExamWarningDialogRef {
  openDialog: (courseId: string) => void;
}
export type ExamData = Exam & {
  questions: (ExamQuestion & {
    options: ExamOption[];
  })[];
  examId: string;
};

const ExamWarningDialog = forwardRef<ExamWarningDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [examData, setExamData] = useState<ExamData>();
  const [courseId, setCourseId] = useState<string | null>(null);

  // 🔹 Expose `openDialog()` method to parent
  useImperativeHandle(ref, () => ({
    openDialog: (cId: string) => {
      setCourseId(cId);
      setOpen(true);
    },
  }));

  const handleStartExam = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const data = await getExamByCourseId(courseId);
      //@ts-expect-error: matched type will be done later
      setExamData(data);
      setExamOpen(true);
      setOpen(false);
    } catch (error) {
      console.error("Failed to load exam:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔸 Warning dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Start Exam?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground my-3">
            Once you start, you&apos;ll have 10 minutes to complete 4 questions.
            Make sure you&apos;re ready — the timer will start immediately.
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartExam} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Start Exam"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* 🔹 Actual exam dialog */}
      {examData && (
        <ExamDialog
          open={examOpen}
          onClose={() => setExamOpen(false)}
          examData={examData}
        />
      )}
    </>
  );
});

ExamWarningDialog.displayName = "ExamWarningDialog";
export default ExamWarningDialog;
