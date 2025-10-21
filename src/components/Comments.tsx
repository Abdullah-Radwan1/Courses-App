"use client";

import { useState, useEffect } from "react";
import { Loader, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  getCommentsByCourseAction,
  createCommentAction,
} from "@/lib/actions/commentsAction";

export default function CommentsSection() {
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [posting, setPosting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const take = 3; // comments per batch
  const courseId = "9800eaa7-861b-4141-8752-dc2505826e5d";

  // Fetch comments when page changes
  useEffect(() => {
    setFetching(true);
    const fetchComments = async () => {
      try {
        const { comments: newComments, hasMore: more } =
          await getCommentsByCourseAction({
            courseId,
            page,
            take,
          });

        // Append new comments and deduplicate
        setComments((prev) => {
          const all = [...prev, ...newComments];
          const unique = Array.from(
            new Map(all.map((c) => [c.id, c])).values()
          );
          return unique;
        });

        // Set hasMore based on batch length
        setHasMore(more && newComments.length === take);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchComments();
  }, [page]);

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const created = await createCommentAction({
        courseId,
        content: newComment,
      });
      setComments((prev) => [created, ...prev]); // prepend new comment
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setPosting(false);
    }
  };

  // Load next batch
  const handleSeeMore = () => setPage((prev) => prev + 1);

  return (
    <Card className="p-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Comments ({comments.length})
        </h3>
      </div>

      {/* Scrollable Comments */}

      {comments ? (
        <section className="space-y-4 max-h-[350px] overflow-y-auto  p-2">
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
                  <p className="text-sm text-foreground/90">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {fetching && <Loader className="animate-spin" />}
        </section>
      ) : (
        "no comment"
      )}

      {/* See More Button */}
      {hasMore && (
        <div>
          <Button
            className="disabled:animate-pulse"
            variant="ghost"
            onClick={handleSeeMore}
            disabled={fetching}
          >
            See More
          </Button>
        </div>
      )}
      {/* Add New Comment */}
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="resize-none"
        />
        <Button
          onClick={handleAddComment}
          disabled={posting || !newComment.trim()}
        >
          {posting ? "Posting..." : "Add Comment"}
        </Button>
      </div>
    </Card>
  );
}
