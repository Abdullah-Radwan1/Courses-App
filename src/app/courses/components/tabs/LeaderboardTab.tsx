import { getLeaderboard } from "@/lib/actions/leaderboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Crown, Flame, Star, ThumbsUp, Trophy } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

// 🔥 رسائل تشجيعية حسب درجة الطالب
function getMessageForScore(score: number) {
  if (score >= 90)
    return {
      text: "🔥 عبقري! حافظ على المستوى المذهل ده 💪",
      color: "bg-amber-200 text-amber-900",
    };
  if (score >= 75)
    return {
      text: "⭐ ممتاز جدًا! لسه خطوة صغيرة وتبقى من الأوائل 👏",
      color: "bg-green-200 text-green-900",
    };
  if (score >= 50)
    return {
      text: "💪 ماشي كويس، كمل كده وطور مستواك!",
      color: "bg-blue-200 text-blue-900",
    };
  return {
    text: "🚀 عندك حماس، حاول تراجع أكتر وتتعلم أكتر!",
    color: "bg-red-200 text-red-900",
  };
}

export default async function LeaderboardPage({
  leaderboard,
}: {
  leaderboard: any;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Crown />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full p-6 rounded-2xl bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-foreground">
            🏆 Leaderboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {leaderboard.length === 0 ? (
            <h2 className="text-center">
              {" "}
              Be the First to be on the BOOOARD 🦅
            </h2>
          ) : (
            leaderboard.map((entry: any, index: number) => {
              const message = getMessageForScore(entry.score);
              return (
                <Card
                  key={entry.user.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl shadow-sm border",
                    "transition-all hover:shadow-md"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <Trophy className="text-yellow-500 w-5 h-5" />
                    )}
                    {index === 1 && <Star className="text-gray-400 w-5 h-5" />}
                    {index === 2 && (
                      <Flame className="text-orange-500 w-5 h-5" />
                    )}
                    {index > 2 && (
                      <ThumbsUp className="text-blue-500 w-5 h-5" />
                    )}

                    <div>
                      <p className="font-semibold text-foreground">
                        {entry.user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Score: {entry.score.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "text-sm px-3 py-1 rounded-full font-medium text-center",
                      message.color
                    )}
                  >
                    {message.text}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
