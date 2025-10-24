"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
  createQuestionAction,
  getQuestionsByCourseAction,
} from "@/lib/actions/questionActions";
import { useState } from "react";
import CustomSkeleton from "../../../components/CustomSkeleton";
import { MessageCircleQuestionMark } from "lucide-react";

export const QuestionModal = ({
  questions,
  setQuestions,
  hasMore,
  setHasMore,
  page,
  setPage,
  courseId,
}: any) => {
  const [open, setOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false); // initial load
  const [loadingMore, setLoadingMore] = useState(false); // "Show More"
  const [asking, setAsking] = useState(false);
  const take = 3;

  // Helper to dedupe and set questions
  const appendUniqueQuestions = (incoming: any[]) => {
    setQuestions((prev: any[]) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const unique = incoming.filter((q) => !existingIds.has(q.id));
      return [...prev, ...unique];
    });
  };

  const prependUniqueQuestion = (item: any) => {
    setQuestions((prev: any[]) => {
      // if it already exists, don't prepend
      if (prev.some((p) => p.id === item.id)) return prev;
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
    // If already loading more, ignore
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const { questionWithUser, hasMore: more } =
        await getQuestionsByCourseAction({
          courseId,
          page: page + 1,
          take,
        });

      // Append only the unique ones
      appendUniqueQuestions(questionWithUser);

      // advance page only once (we could check if any unique were added, but safe to advance)
      setPage((p: number) => p + 1);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Course Questions</DialogTitle>
        </DialogHeader>

        <section className="space-y-4 max-h-[350px] overflow-y-auto p-2">
          {questions.length === 0 ? (
            // No questions yet: show initial skeleton while loading, otherwise empty state
            loading ? (
              <CustomSkeleton />
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                No questions yet. Be the first to ask!
              </div>
            )
          ) : (
            <>
              {questions.map((q: any) => (
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

              {/* show-more skeleton */}
              {loadingMore && <CustomSkeleton />}
            </>
          )}
          {/* show skeleton while asking (when pressing submit) */}
          {asking && <CustomSkeleton />}
        </section>

        <div className="mt-4 space-y-2">
          <Textarea
            placeholder="Ask a question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={loading || asking}>
              Submit
            </Button>

            {/* show the Show More button only when there are more and not currently loading more */}
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
