"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestionMark } from "lucide-react";
import { useState } from "react";
import CustomSkeleton from "@/components/CustomSkeleton";
import {
  createQuestionAction,
  getQuestionsByCourseAction,
} from "@/lib/actions/questionActions";

type QuestionModalProps = {
  initialQuestions: any[];
  initialHasMore: boolean;
  courseId: string;
};

export const QuestionModal = ({
  initialQuestions,
  initialHasMore,
  courseId,
}: QuestionModalProps) => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(2);
  const [newQuestion, setNewQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const take = 3;

  const appendUniqueQuestions = (incoming: any[]) => {
    setQuestions((prev) => {
      const existingIds = new Set(prev.map((q) => q.id));
      const unique = incoming.filter((q) => !existingIds.has(q.id));
      return [...prev, ...unique];
    });
  };

  const prependUniqueQuestion = (item: any) => {
    setQuestions((prev) => {
      if (prev.some((q) => q.id === item.id)) return prev;
      return [item, ...prev];
    });
  };

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;
    setAsking(true);
    try {
      const res = await createQuestionAction({
        content: newQuestion,
        courseId,
      });
      prependUniqueQuestion(res);
      setNewQuestion("");
    } finally {
      setAsking(false);
    }
  };

  const handleShowMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const { questionWithUser, hasMore: more } =
        await getQuestionsByCourseAction({
          courseId,
          page, // current page
          take, // items per page
        });

      appendUniqueQuestions(questionWithUser);
      setPage((p) => p + 1); // ✅ increment by 1, not 2
      setHasMore(more);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageCircleQuestionMark />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Course Questions</DialogTitle>
        </DialogHeader>

        <section className="space-y-4 p-2">
          {asking && <CustomSkeleton />}

          {questions.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No questions yet. Be the first to ask!
            </div>
          ) : (
            <>
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="space-y-3 pb-4 border-b last:border-0"
                >
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {q.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {q.user?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {q.createdAt
                            ? new Date(q.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90">{q.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {loadingMore && <CustomSkeleton />}
            </>
          )}
        </section>

        <div className="mt-4 space-y-2">
          <Textarea
            placeholder="Ask a question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={asking}>
              Submit
            </Button>

            {hasMore && !loadingMore && (
              <Button variant="outline" onClick={handleShowMore}>
                Show More
              </Button>
            )}
            {loadingMore && (
              <Button variant="outline" disabled>
                Loading...
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
