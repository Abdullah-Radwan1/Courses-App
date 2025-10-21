"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  CheckCircle,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { weeks } from "@/lib/data";

const CourseCurriculum = () => {
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);

  const toggleWeek = (weekId: number) => {
    setOpenWeeks((prev) =>
      prev.includes(weekId)
        ? prev.filter((id) => id !== weekId)
        : [...prev, weekId]
    );
  };

  const totalLessons = weeks.reduce(
    (acc, week) => acc + week.lessons.length,
    0
  );
  const completedLessons = weeks.reduce(
    (acc, week) => acc + week.lessons.filter((l) => l.completed).length,
    0
  );
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <Card
      id="curriculum"
      className="p-6 space-y-6 border border-border/60 shadow-sm rounded-2xl bg-card sticky top-6"
    >
      {/* === Course Progress === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Course Progress
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
        </div>
      </div>

      {/* === Curriculum === */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Course Curriculum
        </h3>

        {weeks.map((week) => (
          <Collapsible
            key={week.id}
            open={openWeeks.includes(week.id)}
            onOpenChange={() => toggleWeek(week.id)}
            className="border border-border/50 rounded-xl overflow-hidden bg-muted/20 hover:bg-muted/30 transition-all"
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4">
                <div className="flex-1 text-left space-y-1">
                  <p className="font-semibold text-sm">{week.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {week.duration}
                  </p>
                </div>
                {openWeeks.includes(week.id) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="px-4 pb-3 pt-1 space-y-1">
                <p className="text-xs text-muted-foreground mb-3">
                  {week.description}
                </p>
                {week.lessons.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto py-3 px-3 rounded-lg hover:bg-accent/40 transition-all text-foreground"
                    disabled={lesson.locked}
                  >
                    {lesson.locked ? (
                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : lesson.completed ? (
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : lesson.type === "exercise" ? (
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    )}

                    <div className="flex-1 text-left">
                      <p
                        className={`text-xs ${
                          lesson.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {lesson.duration}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </Card>
  );
};

export default CourseCurriculum;
