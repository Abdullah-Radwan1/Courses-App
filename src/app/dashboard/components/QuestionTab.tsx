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
import { Loader, MessageCircleQuestionMark } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  const take = 3;

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;
    setAsking(true);
    try {
      const res = await createQuestionAction({
        content: newQuestion,
        courseId,
      });
      setQuestions((prev: any) => [res, ...prev]);
      setNewQuestion("");
    } finally {
      setAsking(false);
    }
  };

  const handleShowMore = async () => {
    setLoading(true);
    const { questionWithUser, hasMore: more } =
      await getQuestionsByCourseAction({
        courseId,
        page: page + 1,
        take,
      });
    setQuestions((prev: any) => [...prev, ...questionWithUser]);
    setPage((p: number) => p + 1);
    setHasMore(more);
    setLoading(false);
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
          {questions.length === 0 && loading ? (
            <CustomSkeleton />
          ) : (
            questions.map((q: any) => (
              <div key={q.id} className="space-y-3 pb-4 border-b last:border-0">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {q.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {q.user.name}
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
            ))
          )}
          {asking || (loading && <CustomSkeleton />)}
        </section>

        <div className="mt-4 space-y-2">
          <Textarea
            placeholder="Ask a question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={loading}>
              Submit
            </Button>

            {hasMore && !loading && (
              <Button variant="outline" onClick={handleShowMore}>
                Show More
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
