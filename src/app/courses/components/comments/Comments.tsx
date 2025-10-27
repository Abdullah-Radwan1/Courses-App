"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCommentsByCourseAction } from "@/lib/actions/commentsAction";
import { CustomSkeleton } from "@/components/CustomSkeleton";
import AddComment from "./AddComment"; // 👈 new component
import { CommentWithUser } from "@/lib/types";

export default function CommentsSection({
  courseId,
  initialComments,
  initialHasMore,
}: {
  courseId: string;
  initialComments: CommentWithUser[];
  initialHasMore: boolean;
}) {
  const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const take = 3;

  // Load more comments when clicking "See More"
  useEffect(() => {
    if (page === 1) return; // skip initial load
    const fetchComments = async () => {
      setFetching(true);
      try {
        const { comments: newComments, hasMore: more } =
          await getCommentsByCourseAction({ courseId, page, take });
        // todo
        setComments((prev) => [
          ...prev,
          ...newComments.filter((c) => !prev.find((p) => p.id === c.id)),
        ]);
        setHasMore(more);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchComments();
  }, [page, courseId]);

  // Add newly created comment from child
  const handleNewComment = (created: CommentWithUser) => {
    setComments((prev) => [created, ...prev]);
  };

  return (
    <Card id="comments" className="p-4 ">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Comments ({comments.length})
        </h3>
      </div>

      <section className="space-y-3 max-h-[350px] overflow-y-auto ">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="space-y-3 pb-4 border-b last:border-0"
          >
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {comment.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
        {fetching && <CustomSkeleton />}
      </section>

      {/* 👇 Separate component for posting */}
      <div>
        {hasMore && (
          <Button
            className="disabled:animate-pulse text-left w-fit"
            variant="ghost"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={fetching}
          >
            See More
          </Button>
        )}
        <AddComment
          courseId={courseId}
          onCommentCreated={handleNewComment}
          setFetching={setFetching}
        />
      </div>
    </Card>
  );
}
