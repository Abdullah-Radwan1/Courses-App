"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
}

export default function PdfDialog({ open, onOpenChange, src }: PdfDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent isPDF className="h-[90vh] p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogHeader className="px-4 py-2 border-b">
            <DialogTitle>Lesson PDF</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <iframe
          src={src}
          className="w-full h-full border-0"
          title="Lesson PDF"
        />
      </DialogContent>
    </Dialog>
  );
}
