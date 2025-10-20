import { MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCommentsByCourse } from "@/lib/actions/courseActions";

interface CommentsSectionProps {
  courseId: string;
}

const CommentsSection = async ({ courseId }: CommentsSectionProps) => {
  const comments = await getCommentsByCourse(courseId);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Comments ({comments.length})
        </h3>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="space-y-3 pb-4 border-b last:border-0"
          >
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {comment.user.name}
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
            sd
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CommentsSection;
