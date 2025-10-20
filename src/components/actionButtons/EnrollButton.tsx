"use client";

import { useTransition } from "react";
import { enrollInCourse } from "@/lib/actions/enrollmentActions";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function EnrollButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await enrollInCourse();
        toast.success(result.message);
        router.refresh(); // refresh data on page
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      size="lg"
      className="flex items-center gap-2 text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Play className="h-5 w-5" />
      {isPending ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
}
