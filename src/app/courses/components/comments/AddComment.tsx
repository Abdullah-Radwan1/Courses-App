"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCommentAction } from "@/lib/actions/commentsAction";
import { CommentWithUser } from "@/lib/types";

interface AddCommentProps {
  courseId: string;
  onCommentCreated: (comment: CommentWithUser) => void;
  setFetching: (fetching: boolean) => void;
}

export default function AddComment({
  courseId,
  onCommentCreated,
  setFetching,
}: AddCommentProps) {
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    setFetching(true);

    try {
      const created = await createCommentAction({
        courseId,
        content: newComment,
      });
      onCommentCreated(created); // ✅ now correctly typed
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
      setFetching(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
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
  );
}
