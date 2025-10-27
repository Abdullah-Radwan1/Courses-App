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
import { Loader2, MessageCircleQuestionMark } from "lucide-react";
import { useEffect, useState } from "react";
import { CustomSkeleton } from "@/components/CustomSkeleton";
import {
  createQuestionAction,
  getQuestionsByCourseAction,
} from "@/lib/actions/questionActions";

import { QuestionWithUser } from "@/lib/types";

interface QuestionModalProps {
  courseId: string;
}

export const QuestionModal = ({ courseId }: QuestionModalProps) => {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionWithUser[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false); // covers both fetching & adding
  const [asking, setAsking] = useState(false); // covers both fetching & adding
  const [fetched, setFetched] = useState(false);
  const take = 3;

  const appendUniqueQuestions = (incoming: QuestionWithUser[]) => {
    setQuestions((prev) => {
      const existingIds = new Set(prev.map((q) => q.id));
      const unique = incoming.filter((q) => !existingIds.has(q.id));
      return [...prev, ...unique];
    });
  };

  const prependUniqueQuestion = (item: QuestionWithUser) => {
    setQuestions((prev) =>
      prev.some((q) => q.id === item.id) ? prev : [item, ...prev]
    );
  };

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return; // ✅ check first
    setAsking(true);
    if (!newQuestion.trim()) return;
    try {
      const res = await createQuestionAction({
        content: newQuestion,
        courseId,
      });
      prependUniqueQuestion(res);
      setNewQuestion("");
    } finally {
      setLoading(false);
      setAsking(false);
    }
  };

  const handleShowMore = async () => {
    setLoading(true);
    if (loading) return;
    try {
      const { questionWithUser, hasMore: more } =
        await getQuestionsByCourseAction({
          courseId,
          page,
          take,
        });
      appendUniqueQuestions(questionWithUser);
      setPage((p) => p + 1);
      setHasMore(more);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || fetched) return; // ✅ only fetch once when dialog opens
    setLoading(true);

    const fetchQuestions = async () => {
      try {
        const { questionWithUser, hasMore: more } =
          await getQuestionsByCourseAction({
            courseId,
            page: 1,
            take,
          });
        setQuestions(questionWithUser);
        setHasMore(more);
        setPage(2);
        setFetched(true); // mark as fetched
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [open, fetched, courseId]);

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
          {/* Initial load skeleton */}
          {!fetched && loading && <CustomSkeleton />}

          {/* Questions list */}
          {questions.length === 0 && fetched && !loading && !asking && (
            <div className="text-center text-sm text-muted-foreground">
              No questions yet. Be the first to ask!
            </div>
          )}

          {questions.map((q) => (
            <div key={q.id} className="space-y-3 pb-4 border-b last:border-0">
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
          {/* Load more or submitting skeleton at top */}
          {fetched && (loading || asking) && <CustomSkeleton />}
        </section>

        <div className="mt-4 space-y-2">
          <Textarea
            placeholder="Ask a question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            minLength={3}
            required
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={asking}>
              {loading ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>

            <Button
              disabled={loading || !hasMore}
              variant="outline"
              onClick={handleShowMore}
            >
              Show More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
