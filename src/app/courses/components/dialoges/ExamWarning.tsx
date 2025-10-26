"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ExamWarningDialogProps {
  open: boolean;
  loadingExam: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExamWarningDialog({
  open,
  onConfirm,
  onCancel,
  loadingExam,
}: ExamWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="p-6 max-w-md">
        <DialogHeader>
          <DialogTitle>Start Exam?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground my-4">
          Once you start the exam, the timer will begin, 4 Questions in 10
          minutes. Make sure you are ready and provide a quiet place ❤
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            {loadingExam ? <Loader2 className="animate-spin" /> : "Start Exam"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
